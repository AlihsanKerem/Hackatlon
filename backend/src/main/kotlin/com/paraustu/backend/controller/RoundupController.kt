package com.paraustu.backend.controller

import com.paraustu.backend.entity.RoundupPool
import com.paraustu.backend.repository.RoundupPoolRepository
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/roundup")
class RoundupController(private val roundupPoolRepository: RoundupPoolRepository) {

    @GetMapping("/balance")
    fun getBalance(@RequestParam userId: UUID): RoundupPool {
        return roundupPoolRepository.findByUserId(userId) ?: throw Exception("Pool not found")
    }
}
