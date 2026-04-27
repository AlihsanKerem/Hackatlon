package com.paraustu.backend.repository

import com.paraustu.backend.model.Islem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface IslemRepository : JpaRepository<Islem, Long> {
    // Spring Boot bu arayüzü gördüğü an veritabanı komutlarını otomatik hazırlar.
    // Senin SQL yazmana gerek kalmaz.
}