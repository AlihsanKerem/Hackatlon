package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "roundup_pool")
class RoundupPool {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id", unique = true)
    var userId: UUID? = null
    
    @Column(precision = 10, scale = 2)
    var balance: BigDecimal = BigDecimal.ZERO
    
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()
}
