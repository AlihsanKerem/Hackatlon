package com.paraustu.backend.entity

import jakarta.persistence.*
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
    
    @Column(name = "rounding_preference")
    var roundingPreference: String = "NEAREST_10" // Default as requested
}