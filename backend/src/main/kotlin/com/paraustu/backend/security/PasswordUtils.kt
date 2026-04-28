package com.paraustu.backend.security

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Component
class PasswordUtils {
    
    private val passwordEncoder = BCryptPasswordEncoder()

    /**
     * Düz metin şifreyi (örneğin kullanıcının girdiği şifre) güvenli BCrypt formatına dönüştürür (Hash).
     * Bu hash veritabanında saklanır.
     */
    fun hashPassword(rawPassword: String): String {
        return passwordEncoder.encode(rawPassword)
    }

    /**
     * Kullanıcı giriş yaparken, girdiği düz metin şifrenin veritabanındaki hash ile uyuşup uyuşmadığını kontrol eder.
     */
    fun checkPassword(rawPassword: String, encodedPasswordHash: String): Boolean {
        return passwordEncoder.matches(rawPassword, encodedPasswordHash)
    }
}
