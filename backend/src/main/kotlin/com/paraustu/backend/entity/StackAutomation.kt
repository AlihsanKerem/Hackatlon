package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "stack_automation")
class StackAutomation {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var automationId: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    var isEnabled: Boolean = false
    var targetStock: String? = null
    
    @Column(precision = 10, scale = 2)
    var thresholdAmount: BigDecimal? = null
}