package com.paraustu.backend.service

import com.paraustu.backend.model.Islem
import com.paraustu.backend.repository.IslemRepository
import org.springframework.stereotype.Service
import kotlin.math.ceil

@Service
class ParaUstuService(
    private val islemRepository: IslemRepository,
    private val transactionRepository: com.paraustu.backend.repository.TransactionRepository,
    private val balanceRepository: com.paraustu.backend.repository.BalanceRepository
) {

    fun simulateTransaction(request: com.paraustu.backend.dto.SimulationRequest) {
        // 1. İşlemi kaydet
        val transaction = com.paraustu.backend.entity.Transaction().apply {
            userId = request.userId
            proxyCardId = request.cardId
            merchantName = request.merchantName
            amountSpent = request.amountSpent
            amountRounded = request.amountRounded
            roundupAmount = request.roundupAmount
        }
        transactionRepository.save(transaction)

        // 2. Bakiyeyi güncelle (roundup_pool)
        val balance = balanceRepository.findByUserId(request.userId) 
            ?: com.paraustu.backend.entity.Balance().apply { 
                userId = request.userId
                totalBalance = java.math.BigDecimal.ZERO 
            }
        
        balance.totalBalance = (balance.totalBalance ?: java.math.BigDecimal.ZERO).add(request.roundupAmount)
        balance.lastUpdated = java.time.LocalDateTime.now()
        balanceRepository.save(balance)
    }

    fun hesaplaVeKaydet(harcama: Double, yuvarlamaTipi: Int): Islem {
        // 1. Hesaplama Mantığı
        val hedef = when (yuvarlamaTipi) {
            1 -> ceil(harcama)
            5 -> ceil(harcama / 5.0) * 5.0
            10 -> ceil(harcama / 10.0) * 10.0
            else -> ceil(harcama)
        }
        
        val fark = hedef - harcama
        // Virgülden sonraki hataları engellemek için küçük bir yuvarlama
        val temizFark = String.format("%.2f", fark).replace(",", ".").toDouble()

        // 2. Veritabanı Nesnesini Oluşturma
        val yeniIslem = Islem(
            harcamaTutari = harcama,
            birikenPara = temizFark,
            yuvarlamaTipi = yuvarlamaTipi
        )

        // 3. Veritabanına Kaydetme
        return islemRepository.save(yeniIslem)
    }
}