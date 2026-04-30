package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "users")
class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    var fullName: String? = null
    
    @Column(unique = true)
    @Convert(converter = com.paraustu.backend.security.CryptoConverter::class)
    var tcKimlik: String? = null
    
    @Convert(converter = com.paraustu.backend.security.CryptoConverter::class)
    var pin: String? = null
    
    var roundingUnder10: String = "5"
    var roundingUnder100: String = "10"
    var roundingUnder1000: String = "50"
    var roundingUnder10000: String = "100"

    
    @Column(unique = true)
    var email: String? = null
    
    var passwordHash: String? = null
    
    @Column(unique = true)
    @Convert(converter = com.paraustu.backend.security.CryptoConverter::class)
    var phone: String? = null
}