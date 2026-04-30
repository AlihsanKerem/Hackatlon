package com.paraustu.backend.service

import com.paraustu.backend.entity.User
import com.paraustu.backend.model.Islem
import com.paraustu.backend.repository.IslemRepository
import com.paraustu.backend.repository.TransactionRepository
import com.paraustu.backend.repository.BalanceRepository
import com.paraustu.backend.repository.UserRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import kotlin.math.ceil

@Service
class ParaUstuService(
    private val islemRepository: IslemRepository,
    private val transactionRepository: TransactionRepository,
    private val balanceRepository: BalanceRepository,
    private val userRepository: UserRepository
) {

    fun calculateRoundup(amount: BigDecimal, user: User): BigDecimal {
        val amountDouble = amount.toDouble()
        val roundingStr = when {
            amountDouble < 10.0 -> user.roundingUnder10
            amountDouble < 100.0 -> user.roundingUnder100
            amountDouble < 1000.0 -> user.roundingUnder1000
            else -> user.roundingUnder10000
        }
        
        val roundingType = roundingStr.toDouble()
        val target = ceil(amountDouble / roundingType) * roundingType
        val diff = target - amountDouble
        
        return BigDecimal.valueOf(diff).setScale(2, RoundingMode.HALF_UP)
    }

    fun simulateTransaction(request: com.paraustu.backend.dto.SimulationRequest) {
        val user = userRepository.findById(request.userId).orElseThrow { IllegalArgumentException("Kullanıcı bulunamadı") }
        
        // RECALCULATE roundup based on Backend Rules (User Preferences)
        val validatedRoundup = calculateRoundup(request.amountSpent, user)

        // 1. İşlemi kaydet
        val transaction = com.paraustu.backend.entity.Transaction().apply {
            userId = request.userId
            proxyCardId = request.cardId
            merchantName = request.merchantName
            amountSpent = request.amountSpent
            amountRounded = request.amountSpent.add(validatedRoundup)
            roundupAmount = validatedRoundup
        }
        transactionRepository.save(transaction)
        println(">>> ISLEM KAYDEDILDI: ${transaction.merchantName} - Tutar: ${transaction.amountSpent} - ParaUstu: ${transaction.roundupAmount}")

        // 2. Bakiyeyi güncelle (roundup_pool)
        val balance = balanceRepository.findByUserId(request.userId) 
            ?: com.paraustu.backend.entity.Balance().apply { 
                userId = request.userId
                totalBalance = BigDecimal.ZERO 
            }
        
        balance.totalBalance = (balance.totalBalance ?: BigDecimal.ZERO).add(validatedRoundup)
        balance.lastUpdated = java.time.LocalDateTime.now()
        balanceRepository.save(balance)
    }

    fun hesaplaVeKaydet(harcama: Double, yuvarlamaTipi: Int): Islem {
        val hedef = when (yuvarlamaTipi) {
            1 -> ceil(harcama)
            5 -> ceil(harcama / 5.0) * 5.0
            10 -> ceil(harcama / 10.0) * 10.0
            else -> ceil(harcama)
        }
        
        val fark = hedef - harcama
        val temizFark = String.format("%.2f", fark).replace(",", ".").toDouble()

        val yeniIslem = Islem(
            harcamaTutari = harcama,
            birikenPara = temizFark,
            yuvarlamaTipi = yuvarlamaTipi
        )

        return islemRepository.save(yeniIslem)
    }
}