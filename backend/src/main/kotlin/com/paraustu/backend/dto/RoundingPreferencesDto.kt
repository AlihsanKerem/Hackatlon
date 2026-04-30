package com.paraustu.backend.dto

data class RoundingPreferencesDto(
    val under10: String? = null,
    val under100: String? = null,
    val under1000: String? = null,
    val under10000: String? = null
)
