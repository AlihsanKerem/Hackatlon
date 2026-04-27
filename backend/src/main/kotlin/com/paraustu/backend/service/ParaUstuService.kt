package com.paraustu.backend.service

import com.paraustu.backend.model.Islem
import com.paraustu.backend.repository.IslemRepository
import org.springframework.stereotype.Service
import kotlin.math.ceil

@Service
class ParaUstuService(private val islemRepository: IslemRepository) {

    fun hesaplaVeKaydet(harcama: Double, yuvarlamaTipi: Int): Islem {
        // 1. Hesaplama Mantığı
        val hedef = when (yuvarlamaTipi) {
            1 -> ceil(harcama)
            5 -> ceil(harcama / 5.0) * 5.0
            10 -> ceil(harcama / 10.0) * 10.0
            else -> ceil(harcama)
        }
        
        val fark = hedef - harcama
        // Virgülden sonraki hataları engellemek için küçük bir yuvarlama
        val temizFark = String.format("%.2f", fark).replace(",", ".").toDouble()

        // 2. Veritabanı Nesnesini Oluşturma
        val yeniIslem = Islem(
            harcamaTutari = harcama,
            birikenPara = temizFark,
            yuvarlamaTipi = yuvarlamaTipi
        )

        // 3. Veritabanına Kaydetme
        return islemRepository.save(yeniIslem)
    }
}