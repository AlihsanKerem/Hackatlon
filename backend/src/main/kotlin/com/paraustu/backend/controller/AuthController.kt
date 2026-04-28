package com.paraustu.backend.controller

import com.paraustu.backend.dto.AuthResponse
import com.paraustu.backend.dto.RegisterRequest
import com.paraustu.backend.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        return try {
            val response = authService.register(request)
            ResponseEntity.ok(response)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Sunucu hatası oluştu."))
        }
    }
    @PostMapping("/login")
    fun login(@RequestBody request: com.paraustu.backend.dto.LoginRequest): ResponseEntity<Any> {
        return try {
            val response = authService.login(request)
            ResponseEntity.ok(response)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(401).body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Sunucu hatası oluştu."))
        }
    }

    @GetMapping("/me")
    fun me(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        return try {
            val id = token.replace("Bearer ", "")
            val user = authService.getUserById(id)
            ResponseEntity.ok(user)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }
}