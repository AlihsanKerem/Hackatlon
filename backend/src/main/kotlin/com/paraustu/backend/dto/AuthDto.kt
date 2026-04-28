package com.paraustu.backend.dto

data class RegisterRequest(
    val fullName: String,
    val email: String,
    val phone: String,
    val pin: String
)

data class AuthResponse(
    val token: String,
    val message: String
)

data class LoginRequest(
    val email: String,
    val pin: String
)

data class UserDto(
    val id: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val roundupBalance: Double
)