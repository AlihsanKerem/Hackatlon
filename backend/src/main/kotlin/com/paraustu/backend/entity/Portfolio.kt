package com.paraustu.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "portfolio")
class Portfolio {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    var assetSymbol: String? = null
    
    @Column(precision = 10, scale = 4)
    var totalQuantity: BigDecimal? = null
    
    @Column(precision = 10, scale = 2)
    var averageCost: BigDecimal? = null
}