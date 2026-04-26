package com.paraustu.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "transactions")
class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var transactionId: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    @Column(name = "proxy_card_id")
    var proxyCardId: UUID? = null // proxy_cards tablosundaki cardId
    
    @Column(precision = 10, scale = 2)
    var spentAmount: BigDecimal? = null
    
    @Column(precision = 10, scale = 2)
    var roundUpAmount: BigDecimal? = null
    
    var address: String? = null
    var processedAt: LocalDateTime = LocalDateTime.now()
}