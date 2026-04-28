package com.paraustu.backend.controller

import com.paraustu.backend.dto.BuyRequest
import com.paraustu.backend.dto.SellRequest
import com.paraustu.backend.service.PortfolioService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/portfolio")
class PortfolioController(private val portfolioService: PortfolioService) {

    @PostMapping("/buy")
    fun buy(
        @RequestHeader("Authorization") token: String,
        @RequestBody request: BuyRequest
    ): ResponseEntity<Any> {
        return try {
            val userId = token.replace("Bearer ", "")
            portfolioService.buyStock(userId, request)
            ResponseEntity.ok(mapOf("success" to true, "message" to "Hisse başarıyla alındı"))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to e.message))
        }
    }

    @PostMapping("/sell")
    fun sell(
        @RequestHeader("Authorization") token: String,
        @RequestBody request: SellRequest
    ): ResponseEntity<Any> {
        return try {
            val userId = token.replace("Bearer ", "")
            portfolioService.sellStock(userId, request)
            ResponseEntity.ok(mapOf("success" to true, "message" to "Hisse başarıyla satıldı"))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("success" to false, "message" to e.message))
        }
    }
}
