package com.paraustu.backend.repository

import com.paraustu.backend.entity.Transaction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
interface TransactionRepository : JpaRepository<Transaction, UUID> {
    fun findByUserIdOrderByProcessedAtDesc(userId: UUID): List<Transaction>
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Transaction t WHERE t.userId = :userId")
    fun deleteByUserId(userId: UUID)
}
