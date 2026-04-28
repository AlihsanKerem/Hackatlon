package com.paraustu.backend.repository

import com.paraustu.backend.entity.Portfolio
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PortfolioRepository : JpaRepository<Portfolio, UUID> {
    fun findByUserId(userId: UUID): List<Portfolio>
}
