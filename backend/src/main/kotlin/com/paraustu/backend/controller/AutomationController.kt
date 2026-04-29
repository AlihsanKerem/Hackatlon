package com.paraustu.backend.controller

import com.paraustu.backend.entity.StackAutomation
import com.paraustu.backend.repository.StackAutomationRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/automation")
class AutomationController(private val stackAutomationRepository: StackAutomationRepository) {

    @PostMapping("/save")
    fun saveAutomation(
        @RequestHeader("Authorization") token: String,
        @RequestBody request: AutomationRequest
    ): ResponseEntity<Any> {
        return try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))
            val existing = stackAutomationRepository.findByUserId(userId)
            
            val automation = existing ?: StackAutomation().apply { this.userId = userId }
            automation.isEnabled = request.active
            automation.targetStock = request.symbol
            automation.thresholdAmount = request.threshold
            
            stackAutomationRepository.save(automation)
            ResponseEntity.ok(mapOf("success" to true, "message" to "Otomasyon başarıyla kaydedildi"))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to e.message))
        }
    }

    @DeleteMapping
    fun deleteAutomation(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        return try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))
            val existing = stackAutomationRepository.findByUserId(userId)
            if (existing != null) {
                stackAutomationRepository.delete(existing)
            }
            ResponseEntity.ok(mapOf("success" to true, "message" to "Otomasyon başarıyla silindi"))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to e.message))
        }
    }
}

data class AutomationRequest(
    val active: Boolean,
    val threshold: java.math.BigDecimal,
    val symbol: String
)
