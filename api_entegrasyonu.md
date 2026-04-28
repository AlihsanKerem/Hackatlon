# ParaÜstü: API & Database Entegrasyon Rehberi

Bu rehber, frontend üzerindeki butonların backend'deki hangi endpoint'lere bağlandığını ve beklenen veri formatlarını özetler.

---

## 1. Kimlik Doğrulama (Auth)
**Sayfa:** `Login.jsx` & `Register.jsx`

| İşlem | Metot | Endpoint | Request Body |
| :--- | :--- | :--- | :--- |
| Giriş Yap | `POST` | `/api/auth/login` | `{ "email": "...", "password": "..." }` |
| Kayıt Ol | `POST` | `/api/auth/register` | `{ "email": "...", "password": "...", "phone": "..." }` |

**Not:** Login başarılı olduğunda backend'in mutlaka `id` ve `roundingPreference` alanlarını dönmesi gerekir.

---

## 2. Ana Sayfa (Dashboard)
**Sayfa:** `Dashboard.jsx`

| Bileşen | Metot | Endpoint | Açıklama |
| :--- | :--- | :--- | :--- |
| Kumbara Bakiyesi | `GET` | `/api/roundup/balance?userId=...` | Toplam biriken tutarı döner. |
| İşlem Geçmişi | `GET` | `/api/transactions?userId=...` | Son harcamaları ve yuvarlanan miktarları döner. |
| Portföy (Hisseler) | `GET` | `/api/portfolio?userId=...` | Sahip olunan hisse senetlerini döner. |

---

## 3. Kart Yönetimi
**Sayfa:** `Cards.jsx`

| İşlem | Metot | Endpoint | Açıklama |
| :--- | :--- | :--- | :--- |
| Kartları Listele | `GET` | `/api/cards?userId=...` | Kullanıcının bağlı tüm kartlarını getirir. |
| Yeni Kart Üret | `POST` | `/api/cards/generate` | Query Params: `userId` & `bankName`. Sahte kart no üretir. |
| Kartı Aktifleştir | `PUT` | `/api/cards/{id}/activate` | Seçilen kartı `isActive=true` yapar, diğerlerini `false`. |

---

## 4. E-Ticaret Simülasyonu & Ödeme
**Sayfa:** `Checkout.jsx` (Proxy Payment)

Bu sistemin en kritik noktasıdır. Kullanıcı "Ödemeyi Onayla" dediğinde şu istek gider:

*   **Metot:** `POST`
*   **Endpoint:** `/api/transactions/simulate`
*   **Request Body:**
```json
{
  "userId": "UUID",
  "cardId": "UUID",
  "merchantName": "KitapDünyası",
  "amountSpent": 149.90,
  "amountRounded": 150.00,
  "roundupAmount": 0.10
}
```
**Backend Beklentisi:** Bu istek gelince `transactions` tablosuna kayıt atılmalı ve `roundup_pool` bakiyesi `roundupAmount` kadar artırılmalıdır.

---

## 5. Otomasyon (Yatırım)
**Sayfa:** `Automation.jsx`

| İşlem | Metot | Endpoint | Request Body |
| :--- | :--- | :--- | :--- |
| Kural Sorgula | `GET` | `/api/automation/rule?userId=...` | Aktif bir kural var mı kontrol eder. |
| Kural Kur | `POST` | `/api/automation/rule` | `{ "userId": "...", "stockSymbol": "THYAO.IS", "threshold": 100 }` |
| Kural İptal | `DELETE` | `/api/automation/rule?userId=...` | Mevcut otomasyonu siler. |

---

## 💡 Database Arkadaşlara Notlar (Seed Data)
Backend ilk çalıştığında şu verilerin hazır olması frontend testlerini çok kolaylaştırır:
1.  `users` tablosunda `test@paraustu.com` kullanıcısı.
2.  `cards` tablosunda bu kullanıcıya ait biri aktif 2 kart.
3.  `roundup_pool` tablosunda kullanıcıya ait 0.00 (veya örnek 47.30) bakiye satırı.

---

