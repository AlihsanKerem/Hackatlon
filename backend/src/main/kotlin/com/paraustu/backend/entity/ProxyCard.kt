package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "proxy_cards")
class ProxyCard {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var cardId: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null // users tablosundaki id
    
    var bankName: String? = null
    
    @Convert(converter = com.paraustu.backend.security.CryptoConverter::class)
    var cardNumber: String? = null
    
    @Convert(converter = com.paraustu.backend.security.CryptoConverter::class)
    var expiryDate: String? = null
    
    
    var maskedNumber: String? = null

    
    var isActive: Boolean = true
}