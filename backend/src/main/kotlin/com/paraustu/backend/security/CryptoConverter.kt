package com.paraustu.backend.security

import jakarta.annotation.PostConstruct
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

@Component
class CryptoProperties {
    @Value("\${app.security.encryption.key:MySecretKey12345}")
    lateinit var key: String
    
    @PostConstruct
    fun init() {
        CryptoConverter.SECRET_KEY = key
    }
}

@Converter
class CryptoConverter : AttributeConverter<String, String> {

    companion object {
        var SECRET_KEY = "MySecretKey12345" // Spring üzerinden güncellenecek
        private const val ALGORITHM = "AES"
    }

    override fun convertToDatabaseColumn(attribute: String?): String? {
        if (attribute == null) return null
        return try {
            val cipher = Cipher.getInstance(ALGORITHM)
            val secretKey = SecretKeySpec(SECRET_KEY.toByteArray(), ALGORITHM)
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
            Base64.getEncoder().encodeToString(cipher.doFinal(attribute.toByteArray()))
        } catch (e: Exception) {
            throw RuntimeException("Veri şifrelenirken hata oluştu", e)
        }
    }

    override fun convertToEntityAttribute(dbData: String?): String? {
        if (dbData == null) return null
        return try {
            val cipher = Cipher.getInstance(ALGORITHM)
            val secretKey = SecretKeySpec(SECRET_KEY.toByteArray(), ALGORITHM)
            cipher.init(Cipher.DECRYPT_MODE, secretKey)
            String(cipher.doFinal(Base64.getDecoder().decode(dbData)))
        } catch (e: Exception) {
            // Eğer veri veritabanında şifrelenmemiş düz metin olarak duruyorsa
            // (eski kayıtlar vs.) çökmemesi için düz metni geri dön.
            dbData 
        }
    }
}
