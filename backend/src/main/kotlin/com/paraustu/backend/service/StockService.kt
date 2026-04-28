package com.paraustu.backend.service

import com.paraustu.backend.model.StockDto
import org.springframework.stereotype.Service
import yahoofinance.YahooFinance
import java.math.BigDecimal

@Service
class StockService {

    private val fallbackPrices = mapOf(
        "THYAO.IS" to (BigDecimal("318.40") to "Türk Hava Yolları"),
        "BIMAS.IS" to (BigDecimal("398.20") to "BİM Birleşik Mağazalar"),
        "AKBNK.IS" to (BigDecimal("61.30") to "Akbank"),
        "GARAN.IS" to (BigDecimal("112.80") to "Garanti Bankası"),
        "EREGL.IS" to (BigDecimal("54.60") to "Ereğli Demir Çelik"),
        "KCHOL.IS" to (BigDecimal("187.30") to "Koç Holding")
    )

    fun getStockInfo(symbol: String): StockDto? {
        return try {
            val stock = YahooFinance.get(symbol)
            if (stock != null && stock.quote.price != null) {
                StockDto(
                    symbol = stock.symbol,
                    name = stock.name,
                    price = stock.quote.price,
                    currency = stock.currency,
                    exchange = stock.stockExchange
                )
            } else {
                getFallback(symbol)
            }
        } catch (e: Exception) {
            println("--- STOCK SERVICE HATASI (API LIMIT?): ${e.message} ---")
            getFallback(symbol)
        }
    }

    private fun getFallback(symbol: String): StockDto? {
        val fallback = fallbackPrices[symbol] ?: (BigDecimal("100.00") to "BIST Hisse")
        return StockDto(
            symbol = symbol,
            name = fallback.second,
            price = fallback.first,
            currency = "TRY",
            exchange = "BIST"
        )
    }
}
