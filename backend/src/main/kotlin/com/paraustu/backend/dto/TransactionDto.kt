package com.paraustu.backend.dto

import java.math.BigDecimal
import java.util.UUID

data class SimulationRequest(
    val userId: UUID,
    val cardId: UUID?,
    val merchantName: String,
    val amountSpent: BigDecimal,
    val amountRounded: BigDecimal,
    val roundupAmount: BigDecimal
)
