package com.paraustu.backend.repository

import com.paraustu.backend.entity.Transaction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TransactionRepository : JpaRepository<Transaction, UUID> {
    fun findByUserIdOrderByProcessedAtDesc(userId: UUID): List<Transaction>
}
