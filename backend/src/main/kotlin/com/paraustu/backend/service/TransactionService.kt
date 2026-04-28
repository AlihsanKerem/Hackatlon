package com.paraustu.backend.service

import com.paraustu.backend.entity.Transaction
import com.paraustu.backend.repository.TransactionRepository
import com.paraustu.backend.repository.RoundupPoolRepository
import com.paraustu.backend.repository.UserRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.UUID

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val roundupPoolRepository: RoundupPoolRepository,
    private val userRepository: UserRepository
) {

    fun calculateAndSave(userId: UUID, merchant: String, amountSpent: Double, cardId: UUID): Transaction {
        val spent = BigDecimal.valueOf(amountSpent)

        // Get user's rounding preference
        val user = userRepository.findById(userId).orElseThrow { Exception("User not found") }
        val roundingType = when (user.roundingPreference) {
            "NEAREST_10" -> 10
            "NEAREST_5" -> 5
            "NEAREST_1" -> 1
            else -> 10
        }

        val rounded = when (roundingType) {
            1 -> spent.setScale(0, RoundingMode.CEILING)
            5 -> spent.divide(BigDecimal.valueOf(5), 0, RoundingMode.CEILING).multiply(BigDecimal.valueOf(5))
            10 -> spent.divide(BigDecimal.valueOf(10), 0, RoundingMode.CEILING).multiply(BigDecimal.valueOf(10))
            else -> spent.setScale(0, RoundingMode.CEILING)
        }

        val roundup = rounded.subtract(spent)

        val transaction = Transaction().apply {
            this.userId = userId
            this.cardId = cardId
            this.merchantName = merchant
            this.amountSpent = spent
            this.amountRounded = rounded
            this.roundupAmount = roundup
        }

        // Update roundup pool
        val pool = roundupPoolRepository.findByUserId(userId) ?: throw Exception("User pool not found")
        pool.balance = pool.balance.add(roundup)
        roundupPoolRepository.save(pool)

        return transactionRepository.save(transaction)
    }
}
