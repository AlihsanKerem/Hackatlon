package com.paraustu.backend.model

import java.math.BigDecimal

data class StockDto(
    val symbol: String,
    val name: String?,
    val price: BigDecimal?,
    val currency: String?,
    val exchange: String?
)
