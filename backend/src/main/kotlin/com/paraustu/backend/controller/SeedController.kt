package com.paraustu.backend.controller

import com.paraustu.backend.entity.*
import com.paraustu.backend.repository.*
import com.paraustu.backend.service.DashboardService
import com.paraustu.backend.service.ParaUstuService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/test")
class SeedController(
    private val balanceRepository: BalanceRepository,
    private val transactionRepository: TransactionRepository,
    private val portfolioRepository: PortfolioRepository,
    private val proxyCardRepository: ProxyCardRepository,
    private val userRepository: UserRepository,
    private val paraUstuService: ParaUstuService,
    private val dashboardService: DashboardService
) {

    @PostMapping("/seed")
    fun seedData(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        try {
            // Token temizleme ve UserId elde etme
            val userIdStr = token.replace("Bearer ", "").trim()
            val userId = UUID.fromString(userIdStr)
            
            println(">>> SEED ISTEGI: Kullanici ID = $userId")
            
            val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("Kullanıcı bulunamadı") }

            // 1. Kart ve Bakiye Kontrolü
            var currentBal = balanceRepository.findByUserId(userId)
            if (currentBal == null) {
                currentBal = Balance().apply {
                    this.userId = userId
                    this.totalBalance = BigDecimal.ZERO
                }
                balanceRepository.save(currentBal)
            }

            if (proxyCardRepository.findByUserId(userId).isEmpty()) {
                proxyCardRepository.save(ProxyCard().apply {
                    this.userId = userId
                    this.bankName = "Akbank"
                    this.cardNumber = "4565424242424242"
                    this.expiryDate = "12/28"
                    this.isActive = true
                })
            }

            // 2. Demo İşlemleri Ekle (Görseldeki Shell, Getir, A101)
            val demoTransactions = listOf(
                Triple("A101", BigDecimal("22.40"), LocalDateTime.now().minusDays(1).withHour(10)),
                Triple("A101", BigDecimal("22.40"), LocalDateTime.now().minusDays(1).withHour(11)),
                Triple("Getir", BigDecimal("64.30"), LocalDateTime.now().minusHours(5)),
                Triple("Shell", BigDecimal("1240.00"), LocalDateTime.now().minusHours(2))
            )

            var totalAddedRoundup = BigDecimal.ZERO

            demoTransactions.forEach { (merchant, amount, time) ->
                val roundup = paraUstuService.calculateRoundup(amount, user)
                totalAddedRoundup = totalAddedRoundup.add(roundup)

                val savedTx = transactionRepository.save(Transaction().apply {
                    this.userId = userId
                    this.merchantName = merchant
                    this.amountSpent = amount
                    this.amountRounded = amount.add(roundup)
                    this.roundupAmount = roundup
                    this.processedAt = time
                })
                println(">>> DEMO ISLEM KAYDEDILDI: ${savedTx.merchantName} - Tutar: ${savedTx.amountSpent} - ParaUstu: ${savedTx.roundupAmount}")
            }

            // 3. Bakiyeyi bu işlemlere göre eşitle (eski bakiyenin üzerine ekle)
            currentBal.totalBalance = (currentBal.totalBalance ?: BigDecimal.ZERO).add(totalAddedRoundup)
            balanceRepository.save(currentBal)
            
            println(">>> SEED TAMAMLANDI. Yeni Bakiye: ${currentBal.totalBalance}")

            return ResponseEntity.ok(mapOf("message" to "Demo işlemler (Shell, Getir, A101) başarıyla eklendi."))
        } catch (e: Exception) {
            println(">>> SEED HATASI: ${e.message}")
            e.printStackTrace()
            return ResponseEntity.internalServerError().body(mapOf("error" to "Hata: ${e.message}"))
        }
    }
}
