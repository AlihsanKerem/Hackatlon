package com.paraustu.backend.controller

import com.paraustu.backend.dto.SimulationRequest
import com.paraustu.backend.repository.TransactionRepository
import com.paraustu.backend.service.ParaUstuService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val paraUstuService: ParaUstuService,
    private val transactionRepository: TransactionRepository
) {

    @PostMapping("/simulate")
    fun simulate(@RequestBody request: SimulationRequest): ResponseEntity<Any> {
        return try {
            paraUstuService.simulateTransaction(request)
            ResponseEntity.ok(mapOf("success" to true))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to e.message))
        }
    }

    @GetMapping
    fun getTransactions(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            
            val transactions = transactionRepository.findByUserIdOrderByProcessedAtDesc(userId)
            
            // Frontend formatına dönüştür (isteğe bağlı, şimdilik direkt listeyi dönüyoruz)
            val response = transactions.map {
                mapOf(
                    "id" to it.transactionId,
                    "merchant" to (it.merchantName ?: "Bilinmeyen Mağaza"),
                    "amount" to it.amountSpent,
                    "roundup" to it.roundupAmount,
                    "date" to it.processedAt.toString()
                )
            }
            
            ResponseEntity.ok(response)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }
}
