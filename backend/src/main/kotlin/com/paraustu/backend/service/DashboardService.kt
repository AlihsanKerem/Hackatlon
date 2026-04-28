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
    private val stackAutomationRepository: StackAutomationRepository
) {
    fun getDashboardData(userIdStr: String): DashboardResponse {
        val userId = UUID.fromString(userIdStr)
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
            portfolio = portfolio.map {
                PortfolioDto(
                    symbol = it.assetSymbol ?: "",
                    name = it.assetSymbol ?: "",
                    qty = it.totalQuantity ?: BigDecimal.ZERO,
                    avgCost = it.averageCost ?: BigDecimal.ZERO,
                    price = it.averageCost ?: BigDecimal.ZERO // Şimdilik fiyat = maliyet
                )
            }
        )
    }
}
