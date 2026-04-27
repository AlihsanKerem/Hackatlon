package com.paraustu.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BackendApplication

fun main(args: Array<String>) {
    println("--- SIFRE KONTROL: ${System.getProperty("spring.datasource.password")} ---")
    runApplication<BackendApplication>(*args)
}
