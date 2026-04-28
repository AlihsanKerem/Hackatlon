package com.paraustu.backend.controller

import com.paraustu.backend.repository.UserRepository
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val userRepository: UserRepository) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: Map<String, String>): Map<String, Any> {
        val email = loginRequest["email"]
        val password = loginRequest["password"]

        val user = userRepository.findByEmail(email ?: "")
            ?: throw Exception("User not found")

        if (user.passwordHash != password) {
            throw Exception("Invalid password")
        }

        // Returning a simple mock JWT for now
        return mapOf(
            "token" to "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token",
            "email" to user.email!!,
            "id" to user.id.toString()
        )
    }
}
