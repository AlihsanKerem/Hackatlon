package com.paraustu.backend.controller

import com.paraustu.backend.entity.Portfolio
import com.paraustu.backend.repository.PortfolioRepository
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/portfolio")
class PortfolioController(private val portfolioRepository: PortfolioRepository) {

    @GetMapping
    fun getPortfolio(@RequestParam userId: UUID): List<Portfolio> {
        return portfolioRepository.findByUserId(userId)
    }
}
