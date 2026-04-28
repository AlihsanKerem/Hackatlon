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
    fun getCards(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        return try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))
            val cards = proxyCardRepository.findByUserId(userId)
            ResponseEntity.ok(cards)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }

    @PostMapping
    fun addCard(@RequestHeader("Authorization") token: String, @RequestBody request: ProxyCard): ResponseEntity<Any> {
        return try {
            val userId = UUID.fromString(token.replace("Bearer ", ""))
            request.userId = userId
            val savedCard = proxyCardRepository.save(request)
            ResponseEntity.ok(savedCard)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Kart eklenemedi"))
        }
    }
}
