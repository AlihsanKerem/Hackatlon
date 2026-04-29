package com.paraustu.backend.dto

data class RegisterRequest(
    val tcKimlik: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val pin: String
)

data class AuthResponse(
    val token: String,
    val id: String,
    val message: String,
    val roundingPreference: String = "NEAREST_10"
)

data class LoginRequest(
    val tcKimlik: String,
    val pin: String
)

data class UserDto(
    val id: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val roundupBalance: Double,
    val roundingPreference: String = "NEAREST_10"
)