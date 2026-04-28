package com.paraustu.backend.service

import com.paraustu.backend.dto.BuyRequest
import com.paraustu.backend.dto.SellRequest
import com.paraustu.backend.entity.Portfolio
import com.paraustu.backend.repository.BalanceRepository
import com.paraustu.backend.repository.PortfolioRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID

@Service
class PortfolioService(
    private val portfolioRepository: PortfolioRepository,
    private val balanceRepository: BalanceRepository
) {

    @Transactional
    fun buyStock(userIdStr: String, request: BuyRequest) {
        val userId = UUID.fromString(userIdStr)
        val price = BigDecimal("100.00") // Mock fiyat, gerçekte Yahoo Finance'ten alınabilir

        val totalCost = price.multiply(request.qty)

        if (request.source == "roundup") {
            val balance = balanceRepository.findByUserId(userId)
                ?: throw IllegalArgumentException("Bakiye bulunamadı")
                
            if (balance.totalBalance!! < totalCost) {
                throw IllegalArgumentException("Yetersiz kumbara bakiyesi")
            }
            balance.totalBalance = balance.totalBalance!!.subtract(totalCost)
            balanceRepository.save(balance)
        }

        val existingPortfolio = portfolioRepository.findByUserId(userId).find { it.assetSymbol == request.symbol }

        if (existingPortfolio != null) {
            val oldQty = existingPortfolio.totalQuantity ?: BigDecimal.ZERO
            val oldCost = existingPortfolio.averageCost ?: BigDecimal.ZERO
            val newQty = oldQty.add(request.qty)
            val newAvgCost = ((oldQty.multiply(oldCost)).add(totalCost)).divide(newQty, 2, java.math.RoundingMode.HALF_UP)

            existingPortfolio.totalQuantity = newQty
            existingPortfolio.averageCost = newAvgCost
            portfolioRepository.save(existingPortfolio)
        } else {
            val newPortfolio = Portfolio().apply {
                this.userId = userId
                this.assetSymbol = request.symbol
                this.totalQuantity = request.qty
                this.averageCost = price
            }
            portfolioRepository.save(newPortfolio)
        }
    }

    @Transactional
    fun sellStock(userIdStr: String, request: SellRequest) {
        val userId = UUID.fromString(userIdStr)
        val price = BigDecimal("100.00")

        val existingPortfolio = portfolioRepository.findByUserId(userId).find { it.assetSymbol == request.symbol }
            ?: throw IllegalArgumentException("Bu hisseye sahip değilsiniz")

        val currentQty = existingPortfolio.totalQuantity ?: BigDecimal.ZERO
        if (currentQty < request.qty) {
            throw IllegalArgumentException("Yetersiz hisse adedi")
        }

        existingPortfolio.totalQuantity = currentQty.subtract(request.qty)
        if (existingPortfolio.totalQuantity!!.compareTo(BigDecimal.ZERO) == 0) {
            portfolioRepository.delete(existingPortfolio)
        } else {
            portfolioRepository.save(existingPortfolio)
        }

        // Satıştan gelen para kumbaraya eklenebilir veya vadesiz hesaba gider
        // Demo için kumbaraya ekleyelim:
        val balance = balanceRepository.findByUserId(userId)
        if (balance != null) {
            balance.totalBalance = balance.totalBalance!!.add(price.multiply(request.qty))
            balanceRepository.save(balance)
        }
    }
}
