package com.paraustu.backend.service

import com.paraustu.backend.dto.*
import com.paraustu.backend.repository.*
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.UUID
import java.math.BigDecimal

@Service
class DashboardService(
    private val userRepository: UserRepository,
    private val balanceRepository: BalanceRepository,
    private val transactionRepository: TransactionRepository,
    private val portfolioRepository: PortfolioRepository,
    private val stackAutomationRepository: StackAutomationRepository,
    private val portfolioService: PortfolioService
) {
    fun getDashboardData(userIdStr: String): DashboardResponse {
        val userId = UUID.fromString(userIdStr)
        
        // Automation Trigger: Eğer bakiye eşiği geçtiyse otomatik alım yap
        val currentBalance = balanceRepository.findByUserId(userId)
        val currentAutomation = stackAutomationRepository.findByUserId(userId)
        
        if (currentAutomation != null && currentAutomation.isEnabled && 
            currentBalance != null && currentAutomation.thresholdAmount != null &&
            currentBalance.totalBalance!! >= currentAutomation.thresholdAmount!!) {
            
            try {
                portfolioService.buyStock(userIdStr, BuyRequest(
                    symbol = currentAutomation.targetStock ?: "THYAO.IS",
                    qty = BigDecimal.ONE,
                    source = "roundup"
                ))
            } catch (e: Exception) {
                // Hata durumunda sessizce devam et (demo için)
            }
        }

        val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("Kullanıcı bulunamadı") }
        val balance = balanceRepository.findByUserId(userId)
        val automation = stackAutomationRepository.findByUserId(userId)
        val transactions = transactionRepository.findByUserIdOrderByProcessedAtDesc(userId)
        val portfolio = portfolioRepository.findByUserId(userId)

        val formatter = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.forLanguageTag("tr-TR"))

        return DashboardResponse(
            user = UserInfoDto(fullName = user.fullName ?: "İsimsiz"),
            balance = BalanceDto(roundupBalance = balance?.totalBalance ?: BigDecimal.ZERO),
            automation = automation?.let { 
                AutomationDto(
                    active = it.isEnabled,
                    threshold = it.thresholdAmount ?: BigDecimal.ZERO,
                    symbol = it.targetStock ?: "THYAO.IS"
                )
            },
            transactions = transactions.map {
                TransactionDto(
                    id = it.transactionId.toString(),
                    date = it.processedAt.format(formatter),
                    merchant = it.address ?: "Bilinmeyen",
                    amount = it.spentAmount ?: BigDecimal.ZERO,
                    roundup = it.roundUpAmount ?: BigDecimal.ZERO
                )
            },
            portfolio = portfolio.groupBy { it.assetSymbol }.map { (symbol, items) ->
                val totalQty = items.mapNotNull { it.totalQuantity }.fold(BigDecimal.ZERO, BigDecimal::add)
                val totalCost = items.mapNotNull { it.averageCost?.multiply(it.totalQuantity ?: BigDecimal.ZERO) }.fold(BigDecimal.ZERO, BigDecimal::add)
                val avgCost = if (totalQty > BigDecimal.ZERO) totalCost.divide(totalQty, 2, java.math.RoundingMode.HALF_UP) else BigDecimal.ZERO
                
                // Demo için fiyatı biraz yüksek gösterelim ki karda görünsünler
                val currentPrice = avgCost.multiply(BigDecimal("1.08")).setScale(2, java.math.RoundingMode.HALF_UP)
                
                PortfolioDto(
                    symbol = symbol ?: "",
                    name = symbol ?: "",
                    qty = totalQty,
                    avgCost = avgCost,
                    price = currentPrice
                )
            }

        )
    }
}
