package com.paraustu.entity

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
    var cardNumber: String? = null
    var cardDate: String? = null
    var cardCvv: String? = null
    var isActive: Boolean = true
}