package com.paraustu.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "balances")
class Balance {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    @Column(precision = 10, scale = 2)
    var totalBalance: BigDecimal? = null
    
    var lastUpdated: LocalDateTime = LocalDateTime.now()
}