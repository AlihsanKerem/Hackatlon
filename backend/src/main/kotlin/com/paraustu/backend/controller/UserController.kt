package com.paraustu.backend.controller

import com.paraustu.backend.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val authService: AuthService) {

    @GetMapping("/me")
    fun me(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userId: String?
    ): ResponseEntity<Any> {
        return try {
            val id = userId ?: token?.replace("Bearer ", "") 
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            
            val user = authService.getUserById(id)
            ResponseEntity.ok(user)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }
}
