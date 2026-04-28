package com.paraustu.backend.controller

import com.paraustu.backend.entity.Transaction
import com.paraustu.backend.service.TransactionService
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val transactionService: TransactionService,
    private val transactionRepository: com.paraustu.backend.repository.TransactionRepository
) {

    @GetMapping
    fun getTransactions(@RequestParam userId: UUID): List<Transaction> {
        return transactionRepository.findAll().filter { it.userId == userId }
            .sortedByDescending { it.createdAt }
    }

    @PostMapping("/simulate")
    fun simulate(@RequestBody request: SimulateRequest): Transaction {
        return transactionService.calculateAndSave(
            userId = request.userId,
            merchant = request.merchant,
            amountSpent = request.amount,
            cardId = request.cardId
        )
    }
}

data class SimulateRequest(
    val userId: UUID,
    val merchant: String,
    val amount: Double,
    val cardId: UUID
)
