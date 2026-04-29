package com.paraustu.backend.controller

import com.paraustu.backend.entity.StackAutomation
import com.paraustu.backend.repository.StackAutomationRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/automation")
class AutomationController(private val stackAutomationRepository: StackAutomationRepository) {

    @GetMapping
    fun getAutomation(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            val automation = stackAutomationRepository.findByUserId(userId)
            
            if (automation != null) {
                ResponseEntity.ok(mapOf(
                    "active" to automation.isEnabled,
                    "symbol" to automation.targetStock,
                    "threshold" to automation.thresholdAmount
                ))
            } else {
                ResponseEntity.ok(mapOf("active" to false))
            }
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

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
