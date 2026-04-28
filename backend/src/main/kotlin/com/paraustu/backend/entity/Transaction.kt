package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "transactions")
class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    @Column(name = "card_id")
    var cardId: UUID? = null
    
    @Column(name = "merchant_name")
    var merchantName: String? = null
    
    @Column(name = "amount_spent", precision = 10, scale = 2)
    var amountSpent: BigDecimal? = null
    
    @Column(name = "amount_rounded", precision = 10, scale = 2)
    var amountRounded: BigDecimal? = null
    
    @Column(name = "roundup_amount", precision = 10, scale = 2)
    var roundupAmount: BigDecimal? = null
    
    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now()
}