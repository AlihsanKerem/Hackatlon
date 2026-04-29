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
        val tcKimlik = request.tcKimlik.trim()

        if (userRepository.existsByTcKimlik(tcKimlik)) {
            throw IllegalArgumentException("Bu TC Kimlik numarası zaten kullanımda.")
        }
        if (userRepository.existsByEmail(email)) {
            throw IllegalArgumentException("Bu e-posta adresi zaten kullanımda.")
        }
        if (userRepository.existsByPhone(phone)) {
            throw IllegalArgumentException("Bu telefon numarası zaten kullanımda.")
        }

        val user = User().apply {
            this.tcKimlik = request.tcKimlik
            this.fullName = request.fullName
            this.email = request.email
            this.phone = request.phone
            this.pin = request.pin // Pin'i şifreli saklıyoruz (CryptoConverter ile)
            this.passwordHash = passwordUtils.hashPassword(request.pin) // Geriye dönük uyumluluk
            this.roundingPreference = "NEAREST_10"
        }

        val savedUser = userRepository.save(user)
        
        return AuthResponse(
            token = savedUser.id.toString(),
            id = savedUser.id.toString(),
            message = "Kayıt başarılı.",
            roundingPreference = savedUser.roundingPreference
        )
    }

    fun login(request: com.paraustu.backend.dto.LoginRequest): AuthResponse {
        val tcKimlik = request.tcKimlik.trim()
        val pinInput = request.pin.trim()

        val user = userRepository.findByTcKimlik(tcKimlik)
            ?: throw IllegalArgumentException("TC Kimlik veya PIN hatalı.")

        // Hem düz PIN karşılaştırması (CryptoConverter ile) hem de hash kontrolü yapabiliriz
        if (user.pin != pinInput && !passwordUtils.checkPassword(pinInput, user.passwordHash ?: "")) {
            throw IllegalArgumentException("TC Kimlik veya PIN hatalı.")
        }

        return AuthResponse(
            token = user.id.toString(),
            id = user.id.toString(),
            message = "Giriş başarılı.",
            roundingPreference = user.roundingPreference
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
            roundupBalance = 0.0,
            roundingPreference = user.roundingPreference
        )
    }
}