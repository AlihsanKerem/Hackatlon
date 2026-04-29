package com.paraustu.backend.service

import com.paraustu.backend.dto.AuthResponse
import com.paraustu.backend.dto.RegisterRequest
import com.paraustu.backend.entity.User
import com.paraustu.backend.repository.UserRepository
import com.paraustu.backend.security.PasswordUtils
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordUtils: PasswordUtils
) {

    fun register(request: RegisterRequest): AuthResponse {
        val email = request.email.trim()
        val phone = request.phone.trim()
        val pin = request.pin.trim()

        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Bu e-posta adresi zaten kullanımda.")
        }
        if (userRepository.existsByPhone(phone)) {
            throw IllegalArgumentException("Bu telefon numarası zaten kullanımda.")
        }

        val user = User().apply {
            this.fullName = request.fullName
            this.email = request.email
            this.phone = request.phone
            this.passwordHash = passwordUtils.hashPassword(request.pin)
        }

        val savedUser = userRepository.save(user)
        
        return AuthResponse(
            token = savedUser.id.toString(),
            message = "Kayıt başarılı."
        )
    }

    fun login(request: com.paraustu.backend.dto.LoginRequest): AuthResponse {
        val email = request.email.trim()
        val pin = request.pin.trim()

        val user = userRepository.findByEmail(email)
            ?: throw IllegalArgumentException("E-posta veya şifre hatalı.")

        if (!passwordUtils.checkPassword(request.pin, user.passwordHash ?: "")) {
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