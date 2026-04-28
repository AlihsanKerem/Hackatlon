package com.paraustu.backend.controller

import com.paraustu.backend.model.StockDto
import com.paraustu.backend.service.StockService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/stocks")
class StockController(private val stockService: StockService) {

    @GetMapping("/{symbol}")
    fun getStock(@PathVariable symbol: String): ResponseEntity<StockDto> {
        val stock = stockService.getStockInfo(symbol)
        return if (stock != null) {
            ResponseEntity.ok(stock)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
