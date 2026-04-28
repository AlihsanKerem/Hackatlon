package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "stack_automations")
class StackAutomation {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id", unique = true)
    var userId: UUID? = null
    
    @Column(name = "stock_symbol")
    var stockSymbol: String? = null
    
    @Column(name = "threshold_amount", precision = 10, scale = 2)
    var thresholdAmount: BigDecimal? = null
    
    @Column(name = "is_active")
    var isActive: Boolean = true
}