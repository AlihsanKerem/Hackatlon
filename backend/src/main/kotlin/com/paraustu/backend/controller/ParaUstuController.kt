package com.paraustu.backend.controller

import com.paraustu.backend.model.Islem
import com.paraustu.backend.service.ParaUstuService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/islem")
class IslemController(val paraUstuService: ParaUstuService) {

    @GetMapping("/yuvarla")
    fun yuvarla(
        @RequestParam harcama: Double, 
        @RequestParam tip: Int
    ): Islem { // Artık Map değil, direkt Islem objesi dönüyoruz
        
        // Servis katmanına git, hesapla ve veritabanına KAYDET
        return paraUstuService.hesaplaVeKaydet(harcama, tip)
    }
}