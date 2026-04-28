package com.paraustu.backend.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "proxy_cards")
class ProxyCard {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null

    @Column(name = "user_id")
    var userId: UUID? = null

    @Column(name = "bank_name")
    var bankName: String? = null

    @Column(name = "masked_number")
    var maskedNumber: String? = null

    @Column(name = "full_number")
    var fullNumber: String? = null  // 16 haneli tam kart numarası

    @Column(name = "cvv")
    var cvv: String? = null  // 3 haneli CVV

    @Column(name = "expiry_month")
    var expiryMonth: String? = null  // AA formatında

    @Column(name = "expiry_year")
    var expiryYear: String? = null  // YYYY formatında

    @Column(name = "card_holder")
    var cardHolder: String? = null  // Kart sahibi adı

    @Column(name = "is_active")
    var isActive: Boolean = false
}