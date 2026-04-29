package com.paraustu.backend.controller

import com.paraustu.backend.entity.*
import com.paraustu.backend.repository.*
import com.paraustu.backend.service.DashboardService
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
    private val stackAutomationRepository: StackAutomationRepository,
    private val dashboardService: DashboardService
) {

    @PostMapping("/seed")
    fun seedData(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))

            // 1. Ensure Balance and Proxy Card exist for demo
            var currentBal = balanceRepository.findByUserId(userId)
            if (currentBal == null) {
                currentBal = Balance().apply {
                    this.userId = userId
                    this.totalBalance = BigDecimal.ZERO
                }
                balanceRepository.save(currentBal)
            }

            if (proxyCardRepository.findByUserId(userId).isEmpty()) {
                val c1 = ProxyCard().apply {
                    this.userId = userId
                    this.bankName = "Akbank"
                    this.cardNumber = "1234567812345678"
                    this.expiryDate = "08/27"
                    this.cardCvv = "123"
                    this.isActive = true
                }
                proxyCardRepository.save(c1)
            }

            // 2. Add Exactly ONE Randomized Transaction
            val merchants = listOf(
                Pair("Migros", BigDecimal("47.20") to BigDecimal("2.80")),
                Pair("Starbucks", BigDecimal("83.50") to BigDecimal("6.50")),
                Pair("Trendyol", BigDecimal("189.90") to BigDecimal("10.10")),
                Pair("Shell", BigDecimal("1240.00") to BigDecimal("60.00")),
                Pair("A101", BigDecimal("22.40") to BigDecimal("2.60")),
                Pair("Netflix", BigDecimal("149.00") to BigDecimal("1.00")),
                Pair("Getir", BigDecimal("64.30") to BigDecimal("5.70"))
            )
            
            val randomChoice = merchants.random()
            val tx = Transaction().apply {
                this.userId = userId
                this.merchantName = randomChoice.first
                this.amountSpent = randomChoice.second.first
                this.roundupAmount = randomChoice.second.second
                this.processedAt = LocalDateTime.now()
            }
            transactionRepository.save(tx)

            // 3. Update Balance
            val currentBalance = balanceRepository.findByUserId(userId)
            if (currentBalance != null) {
                currentBalance.totalBalance = (currentBalance.totalBalance ?: BigDecimal.ZERO).add(randomChoice.second.second)
                balanceRepository.save(currentBalance)
            }
            
            // 4. Trigger Automation IMMEDIATELY by checking dashboard data
            // This will execute the buyStock logic if the threshold is met
            dashboardService.getDashboardData(userId.toString())

            return ResponseEntity.ok(mapOf("message" to "İşlem eklendi: ${randomChoice.first} (+${randomChoice.second.second} TL)"))
        } catch (e: Exception) {
            e.printStackTrace()
            return ResponseEntity.internalServerError().body(mapOf("error" to "Veri eklenirken hata oluştu."))
        }
    }
}
