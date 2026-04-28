package com.paraustu.backend.service

import com.paraustu.backend.model.StockDto
import org.springframework.stereotype.Service
import yahoofinance.YahooFinance
import java.math.BigDecimal

@Service
class StockService {

    fun getStockInfo(symbol: String): StockDto? {
        return try {
            // Yahoo Finance üzerinden hisse verilerini çekiyoruz
            val stock = YahooFinance.get(symbol) ?: return null
            
            StockDto(
                symbol = stock.symbol,
                name = stock.name,
                price = stock.quote.price,
                currency = stock.currency,
                exchange = stock.stockExchange
            )
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
