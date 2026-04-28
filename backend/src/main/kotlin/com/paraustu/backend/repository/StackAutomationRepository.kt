package com.paraustu.backend.repository

import com.paraustu.backend.entity.StackAutomation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface StackAutomationRepository : JpaRepository<StackAutomation, UUID> {
    fun findByUserId(userId: UUID): StackAutomation?
}
