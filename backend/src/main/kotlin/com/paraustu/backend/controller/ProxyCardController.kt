package com.paraustu.backend.controller

import com.paraustu.backend.entity.ProxyCard
import com.paraustu.backend.repository.ProxyCardRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/cards")
class ProxyCardController(private val proxyCardRepository: ProxyCardRepository) {

    @GetMapping
    fun getCards(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            val cards = proxyCardRepository.findByUserId(userId)
            ResponseEntity.ok(cards)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }

    @PostMapping
    fun addCard(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?,
        @RequestBody request: ProxyCard
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            request.userId = userId
            val savedCard = proxyCardRepository.save(request)
            ResponseEntity.ok(savedCard)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Kart eklenemedi"))
        }
    }

    @PostMapping("/{id}/activate")
    fun activateCard(
        @PathVariable id: UUID,
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            
            val cards = proxyCardRepository.findByUserId(userId)
            cards.forEach { card ->
                card.isActive = (card.cardId == id)
            }
            proxyCardRepository.saveAll(cards)
            
            ResponseEntity.ok(mapOf("success" to true))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteCard(
        @PathVariable id: UUID,
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            proxyCardRepository.deleteById(id)
            ResponseEntity.ok(mapOf("success" to true))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}
