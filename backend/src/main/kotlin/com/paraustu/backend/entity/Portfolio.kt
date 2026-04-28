package com.paraustu.backend.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "portfolios")
class Portfolio {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(name = "user_id")
    var userId: UUID? = null
    
    @Column(name = "stock_symbol")
    var stockSymbol: String? = null
    
    @Column(precision = 10, scale = 4)
    var quantity: BigDecimal = BigDecimal.ZERO
    
    @Column(name = "average_cost", precision = 10, scale = 2)
    var averageCost: BigDecimal = BigDecimal.ZERO
}