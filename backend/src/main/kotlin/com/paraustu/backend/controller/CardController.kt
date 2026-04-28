package com.paraustu.backend.controller

import com.paraustu.backend.entity.ProxyCard
import com.paraustu.backend.repository.ProxyCardRepository
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/cards")
class CardController(private val proxyCardRepository: ProxyCardRepository) {

    @GetMapping
    fun getCards(@RequestParam userId: UUID): List<ProxyCard> {
        return proxyCardRepository.findByUserId(userId)
    }

    @PostMapping("/generate")
    fun generateCard(@RequestParam userId: UUID, @RequestParam bankName: String): ProxyCard {
        // Rastgele 16 haneli kart numarası üret (Luhn algorithm ile)
        val cardNumber = generateCardNumber()
        val maskedNumber = "**** ${cardNumber.takeLast(4)}"

        val card = ProxyCard().apply {
            this.userId = userId
            this.bankName = bankName
            this.maskedNumber = maskedNumber
            this.fullNumber = cardNumber
            this.cvv = (100..999).random().toString()
            this.expiryMonth = String.format("%02d", (1..12).random())
            this.expiryYear = (2027..2032).random().toString()
            this.cardHolder = "PARAÜSTÜ KULLANICI"
            this.isActive = false // Yeni kart pasif olarak oluşturulur
        }

        return proxyCardRepository.save(card)
    }

    @PutMapping("/{cardId}/activate")
    fun activateCard(@PathVariable cardId: UUID): ProxyCard {
        val card = proxyCardRepository.findById(cardId).orElseThrow { Exception("Card not found") }
        // Tüm kartları pasif yap
        proxyCardRepository.findByUserId(card.userId!!).forEach {
            it.isActive = false
            proxyCardRepository.save(it)
        }
        // Seçili kartı aktif yap
        card.isActive = true
        return proxyCardRepository.save(card)
    }

    // Basit Luhn algorithm ile kart numarası üretimi
    private fun generateCardNumber(): String {
        // 4 haneli banka identifier + 12 haneli rastgele
        val prefix = when {
            Math.random() < 0.5 -> "4565" // A Bankası
            else -> "5425"               // B Bankası
        }
        val random = (100000000..999999999).random()
        val partial = "$prefix$random"
        val checkDigit = luhnCheckDigit(partial)
        return "$partial$checkDigit"
    }

    private fun luhnCheckDigit(partial: String): Int {
        val digits = partial.map { it.digitToInt() }
        val sum = digits.mapIndexed { index, digit ->
            if (index % 2 == 0) {
                val doubled = digit * 2
                if (doubled > 9) doubled - 9 else doubled
            } else digit
        }.sum()
        return (10 - (sum % 10)) % 10
    }
}
