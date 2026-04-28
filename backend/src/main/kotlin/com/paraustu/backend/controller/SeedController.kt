package com.paraustu.backend.controller

import com.paraustu.backend.entity.*
import com.paraustu.backend.repository.*
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
    private val stackAutomationRepository: StackAutomationRepository
) {

    @PostMapping("/seed")
    fun seedData(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))

            // 1. Balance
            var balance = balanceRepository.findByUserId(userId)
            if (balance == null) {
                balance = Balance().apply {
                    this.userId = userId
                    this.totalBalance = BigDecimal("847.60")
                }
            } else {
                balance.totalBalance = balance.totalBalance?.add(BigDecimal("847.60"))
            }
            balanceRepository.save(balance!!)

            // 2. Transactions
            val tx1 = Transaction().apply {
                this.userId = userId
                this.address = "Migros"
                this.spentAmount = BigDecimal("47.20")
                this.roundUpAmount = BigDecimal("2.80")
                this.processedAt = LocalDateTime.now().minusDays(2)
            }
            val tx2 = Transaction().apply {
                this.userId = userId
                this.address = "Trendyol"
                this.spentAmount = BigDecimal("189.90")
                this.roundUpAmount = BigDecimal("10.10")
                this.processedAt = LocalDateTime.now().minusDays(1)
            }
            val tx3 = Transaction().apply {
                this.userId = userId
                this.address = "Starbucks"
                this.spentAmount = BigDecimal("83.50")
                this.roundUpAmount = BigDecimal("16.50")
                this.processedAt = LocalDateTime.now()
            }
            transactionRepository.saveAll(listOf(tx1, tx2, tx3))

            // 3. Portfolio
            val p1 = Portfolio().apply {
                this.userId = userId
                this.assetSymbol = "THYAO.IS"
                this.totalQuantity = BigDecimal("12.00")
                this.averageCost = BigDecimal("285.00")
            }
            val p2 = Portfolio().apply {
                this.userId = userId
                this.assetSymbol = "BIMAS.IS"
                this.totalQuantity = BigDecimal("8.00")
                this.averageCost = BigDecimal("412.50")
            }
            portfolioRepository.saveAll(listOf(p1, p2))

            // 4. ProxyCards
            if (proxyCardRepository.findByUserId(userId).isEmpty()) {
                val c1 = ProxyCard().apply {
                    this.userId = userId
                    this.bankName = "Akbank"
                    this.cardNumber = "1234567812345678"
                    this.cardDate = "08/27"
                    this.cardCvv = "123"
                    this.isActive = true
                }
                val c2 = ProxyCard().apply {
                    this.userId = userId
                    this.bankName = "Garanti"
                    this.cardNumber = "8765432187654321"
                    this.cardDate = "11/26"
                    this.cardCvv = "456"
                    this.isActive = false
                }
                proxyCardRepository.saveAll(listOf(c1, c2))
            }

            // 5. Automation
            if (stackAutomationRepository.findByUserId(userId) == null) {
                val auto = StackAutomation().apply {
                    this.userId = userId
                    this.isEnabled = true
                    this.targetStock = "THYAO.IS"
                    this.thresholdAmount = BigDecimal("100.00")
                }
                stackAutomationRepository.save(auto)
            }

            return ResponseEntity.ok(mapOf("message" to "Demo veriler başarıyla eklendi!"))
        } catch (e: Exception) {
            e.printStackTrace()
            return ResponseEntity.internalServerError().body(mapOf("error" to "Veriler eklenirken hata oluştu."))
        }
    }
}
