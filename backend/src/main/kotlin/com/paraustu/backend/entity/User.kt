package com.paraustu.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "users")
class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null
    
    @Column(unique = true)
    var email: String? = null
    
    var passwordHash: String? = null
    
    @Column(unique = true)
    var phone: String? = null
}