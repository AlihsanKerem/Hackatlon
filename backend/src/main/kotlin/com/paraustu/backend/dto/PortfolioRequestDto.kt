package com.paraustu.backend.dto

import java.math.BigDecimal

data class BuyRequest(
    val symbol: String,
    val qty: BigDecimal,
    val source: String // "roundup" veya "direct"
)

data class SellRequest(
    val symbol: String,
    val qty: BigDecimal
)
