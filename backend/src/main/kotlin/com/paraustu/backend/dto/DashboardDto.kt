package com.paraustu.backend.dto

import java.math.BigDecimal

data class DashboardResponse(
    val user: UserInfoDto,
    val balance: BalanceDto,
    val automation: AutomationDto?,
    val transactions: List<TransactionDto>,
    val portfolio: List<PortfolioDto>
)

data class UserInfoDto(
    val fullName: String
)

data class BalanceDto(
    val roundupBalance: BigDecimal
)

data class AutomationDto(
    val active: Boolean,
    val threshold: BigDecimal,
    val symbol: String
)

data class TransactionDto(
    val id: String,
    val date: String,
    val merchant: String,
    val amount: BigDecimal,
    val roundup: BigDecimal
)

data class PortfolioDto(
    val symbol: String,
    val name: String,
    val qty: BigDecimal,
    val avgCost: BigDecimal,
    val price: BigDecimal
)
