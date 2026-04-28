package com.paraustu.backend.repository

import com.paraustu.backend.entity.Balance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BalanceRepository : JpaRepository<Balance, UUID> {
    fun findByUserId(userId: UUID): Balance?
}
