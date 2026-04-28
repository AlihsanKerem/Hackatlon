package com.paraustu.backend.config

import com.paraustu.backend.entity.*
import com.paraustu.backend.repository.*
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate
import java.math.BigDecimal
import java.util.UUID

@Configuration
class DataInitializer(
    private val jdbcTemplate: JdbcTemplate,
    private val userRepository: UserRepository,
    private val proxyCardRepository: ProxyCardRepository
) {

    @Bean
    fun initData(): CommandLineRunner = CommandLineRunner {
        val fixedUserId = "dac46d06-118e-43a7-96ed-dbf4ac7b0582"

        // 1. Check if seeded using Repository
        if (userRepository.existsById(UUID.fromString(fixedUserId))) {
            println("✅ Seed data already exists.")
            return@CommandLineRunner
        }

        println("🚀 Seeding data via direct JDBC to bypass JPA lifecycle issues...")

        try {
            // 2. Insert User
            jdbcTemplate.update(
                "INSERT INTO users (id, email, password_hash, rounding_preference) VALUES (?, ?, ?, ?)",
                fixedUserId, "test@paraustu.com", "test123", "NEAREST_10"
            )

            // 3. Insert Cards
            val cardIdA = UUID.randomUUID().toString()
            jdbcTemplate.update(
                """INSERT INTO proxy_cards 
                    (id, user_id, bank_name, masked_number, full_number, cvv, expiry_month, expiry_year, card_holder, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                cardIdA, fixedUserId, "A Bankası", "**** 4242", "4565 4242 4242 4242", "424", "12", "2028", "AHMET YILMAZ", true
            )

            val cardIdB = UUID.randomUUID().toString()
            jdbcTemplate.update(
                """INSERT INTO proxy_cards 
                    (id, user_id, bank_name, masked_number, full_number, cvv, expiry_month, expiry_year, card_holder, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                cardIdB, fixedUserId, "B Bankası", "**** 5353", "5425 5353 5353 5353", "353", "06", "2027", "AHMET YILMAZ", false
            )

            // 4. Insert Roundup Pool
            jdbcTemplate.update(
                "INSERT INTO roundup_pool (id, user_id, balance, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                UUID.randomUUID().toString(), fixedUserId, BigDecimal("47.30")
            )

            // 5. Insert Automation
            jdbcTemplate.update(
                "INSERT INTO stack_automations (id, user_id, stock_symbol, threshold_amount, is_active) VALUES (?, ?, ?, ?, ?)",
                UUID.randomUUID().toString(), fixedUserId, "THYAO.IS", BigDecimal("100.00"), true
            )

            println("✨ Seed data injected successfully via JDBC!")
            
        } catch (e: Exception) {
            println("❌ Error during seeding: ${e.message}")
            e.printStackTrace()
        }
    }
}
