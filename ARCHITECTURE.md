# ParaÜstü — Proje Mimarisi ve Teknik Kararlar

Bu doküman, geliştirme sürecine başlamadan önce alınan tüm teknik ve ürün kararlarını içermektedir. Uygulamaya geçmeden önce tüm takım üyelerinin bu dokümanı okuması beklenmektedir.

---

## 1. Projenin Özeti

ParaÜstü, kullanıcıların günlük alışverişlerindeki para üstlerini otomatik olarak biriktirip hisse senedine veya altına yatıran bir fintech simülasyon uygulamasıdır.

**Temel akış:**
1. Kullanıcı sisteme kayıt olur ve banka kartı bilgilerini ekler.
2. Bir alışveriş simüle edilir (ör. 14 TL'lik kitap).
3. Sistem tutarı kullanıcının seçtiği yuvarlama tercihine göre yukarı yuvarlar (ör. 20 TL).
4. Kullanıcıdan 20 TL çekilir; 14 TL ödeme olarak işaretlenir (mock), 6 TL roundup pool'a eklenir.
5. Kullanıcının belirlediği eşik aşıldığında otomatik hisse alımı gerçekleşir.

> **Önemli Not:** Bu bir simülasyondur. Gerçek POS/banka entegrasyonu yoktur. "A Bankası" ve "B Bankası" adında iki sahte banka ve kart tanımlanacak; harcamalar arayüzdeki butonlarla simüle edilecektir. Jüriye sunarken bu durum açıkça belirtilecek, gerçek implementasyonda ödeme ağ geçidi entegrasyonu yapılacağı not edilecektir.

---

## 2. Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| **Backend** | Kotlin + Spring Boot | Ekip kararı |
| **Veritabanı** | PostgreSQL | Hackathon için yeterli, production-ready |
| **Hisse Fiyat Servisi** | Python + FastAPI + yfinance | Kotlin'den ayrı küçük bir mikroservis. BIST hisseleri `.IS` uzantısıyla Yahoo Finance'te mevcut |
| **Frontend** | Web (Mobile-Responsive) | Önce web, ilerleyen sürümlerde mobil |
| **Auth** | JWT (Token tabanlı) | Stateless, standart |
| **Şifreleme** | bcrypt (şifre), AES-256 (kart verisi) | Kütüphane kullanılacak, sıfırdan yazılmayacak |

---

## 3. Sistem Mimarisi

```
[Web Frontend - Mobile Responsive]
           │
           │ REST API (JSON)
           ▼
[Spring Boot Monolith]
  ├── Auth Module          → Kayıt, giriş, JWT doğrulama
  ├── Transaction Module   → Harcama simülasyonu, yuvarlama algoritması
  ├── Roundup Module       → Pool yönetimi, otomasyon kural motoru
  ├── Portfolio Module     → Hisse alım/satım, kar/zarar hesabı
  └── Card Module          → Kart CRUD, maskeleme
           │
           ├──────────────────────────────┐
           ▼                              ▼
     [PostgreSQL]            [Python FastAPI Mikroservis]
                              GET /price?symbol=THYAO.IS
                              → Anlık BIST fiyatı döner
```

**Neden Monolith?** Hackathon süresinde microservice kurmak zaman kaybı yaratır. Tek Spring Boot uygulaması yeterlidir.

---

## 4. Veritabanı Şeması

### 4.1 `users`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `email` | VARCHAR | Unique |
| `password_hash` | VARCHAR | bcrypt ile hashlenmiş, düz metin asla saklanmaz |
| `rounding_preference` | VARCHAR | Enum: `NEAREST_1`, `NEAREST_5`, `NEAREST_10`, `NEAREST_50`, `NEAREST_100` |
| `created_at` | TIMESTAMP | |

### 4.2 `cards`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `user_id` | FK → users | |
| `bank_name` | VARCHAR | "A Bankası" veya "B Bankası" (simülasyon) |
| `masked_last4` | VARCHAR | Kullanıcıya gösterilen son 4 hane (ör. `**** 1234`) |
| `encrypted_card_no` | TEXT | AES-256 ile şifreli kart numarası |
| `encrypted_expiry` | TEXT | AES-256 ile şifreli son kullanma tarihi |
| `created_at` | TIMESTAMP | |

> **CVV asla saklanmaz.** Gerçek dünyada tokenization yapılır; burada AES şifreleme ile simüle edilmektedir.

### 4.3 `transactions`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `user_id` | FK → users | |
| `card_id` | FK → cards | Hangi kartla yapıldı |
| `merchant` | VARCHAR | Satıcı adı (ör. "Amazon") |
| `original_amount` | DECIMAL(10,2) | Gerçek harcama tutarı (ör. 14.00) |
| `charged_amount` | DECIMAL(10,2) | Kullanıcıdan çekilen tutar (ör. 20.00) |
| `roundup_amount` | DECIMAL(10,2) | Para üstü (ör. 6.00) |
| `created_at` | TIMESTAMP | |

### 4.4 `roundup_pool`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `user_id` | FK → users | Primary key (user başına 1 kayıt) |
| `balance` | DECIMAL(10,2) | Birikmiş toplam para üstü |
| `updated_at` | TIMESTAMP | |

### 4.5 `automation_rules`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `user_id` | FK → users | Unique — kullanıcı başına **tek kural** |
| `stock_symbol` | VARCHAR | Hedef hisse (ör. `THYAO.IS`) |
| `trigger_threshold` | DECIMAL(10,2) | Tetiklenme eşiği (ör. 100.00 TL) |
| `is_active` | BOOLEAN | Kural aktif/pasif |
| `created_at` | TIMESTAMP | |

> **Neden tek kural?** Birden fazla kural tanımlanırsa eşik çakışmaları ve öncelik sorunları ortaya çıkar. Hackathon kapsamı için kullanıcı başına tek aktif kural kararlaştırılmıştır.

### 4.6 `portfolio`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `user_id` | FK → users | |
| `stock_symbol` | VARCHAR | ör. `THYAO.IS` |
| `quantity` | DECIMAL(10,4) | Sahip olunan adet |
| `avg_cost` | DECIMAL(10,2) | Ağırlıklı ortalama alış fiyatı |
| `updated_at` | TIMESTAMP | |

### 4.7 `trade_history`
| Sütun | Tip | Açıklama |
|-------|-----|---------|
| `id` | UUID / SERIAL | Primary key |
| `user_id` | FK → users | |
| `stock_symbol` | VARCHAR | |
| `type` | ENUM | `BUY` veya `SELL` |
| `quantity` | DECIMAL(10,4) | |
| `price_per_unit` | DECIMAL(10,2) | İşlem anındaki fiyat |
| `total_amount` | DECIMAL(10,2) | Toplam işlem tutarı |
| `source` | ENUM | `AUTO` (otomasyon) veya `MANUAL` (kullanıcı) |
| `created_at` | TIMESTAMP | |

---

## 5. Yuvarlama Algoritması

Kullanıcı kayıt/ayarlar ekranından yuvarlama tercihini seçer. Bu tercih `users.rounding_preference` sütununa kaydedilir.

| Tercih | Örnek (14 TL) | Para Üstü |
|--------|--------------|-----------|
| `NEAREST_1` | 15 TL | 1 TL |
| `NEAREST_5` | 15 TL | 1 TL |
| `NEAREST_10` | 20 TL | 6 TL |
| `NEAREST_50` | 50 TL | 36 TL |
| `NEAREST_100` | 100 TL | 86 TL |

**Pseudocode:**
```
roundup_amount = ceiling(original_amount / preference) * preference - original_amount
charged_amount = original_amount + roundup_amount
```

---

## 6. Otomasyon Akışı (Trigger Mantığı)

> **DB Trigger kullanılmayacak.** PostgreSQL trigger'ı senkron çalışır; işlem kaydedilirken borsa API'sine istek atmak hem performans hem güvenilirlik riski yaratır (API down olursa işlem fail eder).

**Tercih edilen yöntem: Application-Level Event**

```
Harcama işlemi kaydedilir
  → roundup_pool.balance güncellenir
    → Spring @EventListener tetiklenir
      → Kullanıcının aktif automation_rule'u var mı? kontrol et
        → balance >= trigger_threshold mi?
          → Python mikroservisinden anlık fiyat çek
            → Hisse alımı gerçekleştir (trade_history'e kaydet)
              → portfolio güncelle
                → roundup_pool sıfırla (eşiği geçen kısım düşülür)
```

---

## 7. Kar/Zarar Hesabı

**On-demand** hesaplama yapılacak: kullanıcı portföy sayfasına her girdiğinde.

```
Kar/Zarar = (anlık_fiyat - avg_cost) × quantity
```

Anlık fiyat Python mikroservisinden o an çekilir. Veritabanında snapshot tutulmaz.

---

## 8. Python Hisse Fiyat Mikroservisi

Tek endpoint, bağımsız FastAPI uygulaması:

```
GET /price?symbol=THYAO.IS
→ { "symbol": "THYAO.IS", "price": 312.50, "currency": "TRY", "timestamp": "..." }
```

Spring Boot bu servisi HTTP client (ör. WebClient) ile çağırır.

**Desteklenecek semboller (başlangıç):**
- `THYAO.IS` — Türk Hava Yolları
- `GARAN.IS` — Garanti Bankası
- `ASELS.IS` — Aselsan
- `XU100.IS` — BIST 100 (indeks)
- `GC=F` — Altın (Gold Futures, USD)

---

## 9. Güvenlik Kararları

| Alan | Karar |
|------|-------|
| Kullanıcı şifresi | bcrypt ile hash, düz metin asla DB'ye yazılmaz |
| Kart numarası | AES-256 şifreli, son 4 hane maskelenmiş şekilde ayrıca saklanır |
| CVV | **Hiçbir şekilde saklanmaz** |
| API güvenliği | JWT Bearer token, her istekte doğrulanır |
| Token süresi | Access token: 15 dk, Refresh token: 7 gün (öneri) |

---

## 10. Simülasyon Kararları

Hackathon kapsamında gerçek banka/POS entegrasyonu yapılmayacaktır:

- **"A Bankası"** ve **"B Bankası"** adında iki sahte banka tanımlanacak.
- Kullanıcı arayüzden bu bankaların kartlarını ekleyebilecek.
- Harcama simülasyonu için arayüzde **"X TL harcama yap"** butonu bulunacak; bu buton arka planda Transaction akışını tetikleyecek.
- Jüri sunumunda: *"Gerçek implementasyonda burası ödeme ağ geçidi (payment gateway) entegrasyonuyla çalışır"* notu eklenecek.

---

## 11. Henüz Kararlaştırılmamış / İleriye Bırakılan Konular

- Frontend framework seçimi (React vs Vanilla JS)
- Hisse alımında kısmi birim desteği (ör. 0.5 hisse alımı)
- Birden fazla otomasyon kuralı desteği (v2)
- Mobil uygulama (v2)
- Gerçek ödeme ağ geçidi entegrasyonu (v2)

---

*Son güncelleme: 26 Nisan 2026*
