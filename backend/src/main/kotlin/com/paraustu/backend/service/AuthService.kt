package com.paraustu.backend.service

import com.paraustu.backend.dto.AuthResponse
import com.paraustu.backend.dto.RegisterRequest
import com.paraustu.backend.entity.User
import com.paraustu.backend.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class AuthService(private val userRepository: UserRepository) {

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("Bu e-posta adresi zaten kullanımda.")
        }
        if (userRepository.existsByPhone(request.phone)) {
            throw IllegalArgumentException("Bu telefon numarası zaten kullanımda.")
        }

        val user = User().apply {
            this.fullName = request.fullName
            this.email = request.email
            this.phone = request.phone
            this.passwordHash = request.pin
        }

        val savedUser = userRepository.save(user)
        
        return AuthResponse(
            token = savedUser.id.toString(),
            message = "Kayıt başarılı."
        )
    }

    fun login(request: com.paraustu.backend.dto.LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("E-posta veya şifre hatalı.")

        if (user.passwordHash != request.pin) {
            throw IllegalArgumentException("E-posta veya şifre hatalı.")
        }

        return AuthResponse(
            token = user.id.toString(),
            message = "Giriş başarılı."
        )
    }

    fun getUserById(id: String): com.paraustu.backend.dto.UserDto {
        val user = userRepository.findById(java.util.UUID.fromString(id))
            .orElseThrow { IllegalArgumentException("Kullanıcı bulunamadı") }
        
        return com.paraustu.backend.dto.UserDto(
            id = user.id.toString(),
            fullName = user.fullName ?: "İsimsiz",
            email = user.email ?: "",
            phone = user.phone ?: "",
            roundupBalance = 0.0
        )
    }
}