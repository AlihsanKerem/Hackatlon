package com.paraustu.backend.repository

import com.paraustu.backend.entity.ProxyCard
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProxyCardRepository : JpaRepository<ProxyCard, UUID> {
    fun findByUserId(userId: UUID): List<ProxyCard>
}
