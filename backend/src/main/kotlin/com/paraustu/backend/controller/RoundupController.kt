package com.paraustu.backend.controller

import com.paraustu.backend.repository.BalanceRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/roundup")
class RoundupController(private val balanceRepository: BalanceRepository) {

    @GetMapping("/balance")
    fun getBalance(
        @RequestHeader(value = "Authorization", required = false) token: String?,
        @RequestParam(value = "userId", required = false) userIdParam: String?
    ): ResponseEntity<Any> {
        return try {
            val idStr = userIdParam ?: token?.replace("Bearer ", "")
                ?: throw IllegalArgumentException("Kullanıcı kimliği bulunamadı")
            val userId = UUID.fromString(idStr)
            
            val balance = balanceRepository.findByUserId(userId)
            val amount = balance?.totalBalance ?: java.math.BigDecimal.ZERO
            
            ResponseEntity.ok(mapOf("roundupBalance" to amount))
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim"))
        }
    }
}
