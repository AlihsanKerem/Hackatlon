package com.paraustu.backend.service

import org.springframework.stereotype.Service
import kotlin.math.ceil

@Service
class ParaUstuService {

    // Temel yuvarlama mantığı
    fun hesapla(tutar: Double, yuvarlamaTipi: Int): Double {
        val hedef = when (yuvarlamaTipi) {
            1 -> ceil(tutar) // 18.40 -> 19.00
            5 -> ceil(tutar / 5.0) * 5.0 // 18.40 -> 20.00
            10 -> ceil(tutar / 10.0) * 10.0 // 18.40 -> 20.00
            else -> ceil(tutar)
        }
        
        // Aradaki farkı (biriken parayı) döndür
        val fark = hedef - tutar
        return "%.2f".format(fark).replace(",", ".").toDouble()
    }
}