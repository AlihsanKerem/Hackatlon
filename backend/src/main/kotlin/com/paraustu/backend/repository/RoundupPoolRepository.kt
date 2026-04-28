package com.paraustu.backend.repository

import com.paraustu.backend.entity.RoundupPool
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RoundupPoolRepository : JpaRepository<RoundupPool, UUID> {
    fun findByUserId(userId: UUID): RoundupPool?
}
