package com.paraustu.backend.controller

import com.paraustu.backend.service.ParaUstuService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/islem") // <-- Burası ana adres
class IslemController(val paraUstuService: ParaUstuService) {

    @GetMapping("/yuvarla") // <-- Burası alt adres
    fun yuvarla(
        @RequestParam harcama: Double, 
        @RequestParam tip: Int
    ): Map<String, Any> {
        // Servis katmanındaki algoritmayı çağırıyoruz
        val fark = paraUstuService.hesapla(harcama, tip)
        
        // Veritabanı olmasa bile bu Map sayesinde ekrana veri basarız
        return mapOf(
            "harcama_tutari" to harcama,
            "yuvarlama_tipi" to tip,
            "biriken_para" to fark,
            "mesaj" to "Deneme verisi basariyla uretildi!"
        )
    }
}