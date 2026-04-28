package com.paraustu.backend.controller

import com.paraustu.backend.dto.DashboardResponse
import com.paraustu.backend.service.DashboardService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(private val dashboardService: DashboardService) {

    @GetMapping
    fun getDashboard(@RequestHeader("Authorization") token: String): ResponseEntity<Any> {
        return try {
            val id = token.replace("Bearer ", "")
            val dashboardData = dashboardService.getDashboardData(id)
            ResponseEntity.ok(dashboardData)
        } catch (e: Exception) {
            ResponseEntity.status(401).body(mapOf("error" to "Yetkisiz erişim veya veri bulunamadı"))
        }
    }
}
