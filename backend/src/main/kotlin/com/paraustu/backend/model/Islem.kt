package com.paraustu.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "islemler")
class Islem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val harcamaTutari: Double,
    val birikenPara: Double,  // Servis burayı 'birikenPara' olarak bekliyor
    val yuvarlamaTipi: Int,   // Servis burayı 'yuvarlamaTipi' olarak bekliyor
    val islemZamani: LocalDateTime = LocalDateTime.now()
)