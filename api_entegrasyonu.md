# ParaÜstü: API & Database Entegrasyon Rehberi

Bu rehber, frontend üzerindeki butonların backend'deki hangi endpoint'lere bağlandığını ve beklenen veri formatlarını özetler.

---

## 1. Kimlik Doğrulama (Auth)
**Sayfa:** `Login.jsx` & `Register.jsx`

| İşlem | Metot | Endpoint | Request Body |
| :--- | :--- | :--- | :--- |
| Giriş Yap | `POST` | `/api/auth/login` | `{ "tcKimlik": "...", "pin": "..." }` |
| Kayıt Ol | `POST` | `/api/auth/register` | `{ "tcKimlik": "...", "fullName": "...", "email": "...", "phone": "...", "pin": "..." }` |

**Not:** Login başarılı olduğunda backend'in mutlaka `id`, `token` ve `roundingPreference` alanlarını dönmesi gerekir.

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
| Yeni Kart Ekle | `POST` | `/api/cards?userId=...` | Request Body: `{ "bankName": "...", "cardNumber": "...", "expiryDate": "...", "maskedNumber": "...", "isActive": true }` |
| Kartı Aktifleştir | `POST` | `/api/cards/{id}/activate?userId=...` | Seçilen kartı `isActive=true` yapar, diğerlerini `false`. |
| Kartı Sil | `DELETE` | `/api/cards/{id}?userId=...` | Mevcut kartı siler. |

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
  "merchantName": "Zamazor",
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
| Kural Sorgula | `GET` | `/api/automation?userId=...` | Aktif bir kural var mı kontrol eder. |
| Kural Kaydet/Güncelle | `POST` | `/api/automation/save?userId=...` | `{ "active": true, "stockSymbol": "THYAO.IS", "threshold": 100 }` |
| Kural Sil | `DELETE` | `/api/automation?userId=...` | Mevcut otomasyonu siler. |

---

## 💡 Database Arkadaşlara Notlar (Seed Data)
Backend ilk çalıştığında şu verilerin hazır olması frontend testlerini çok kolaylaştırır:
1.  `users` tablosunda `12345678901` TC numaralı ve `123456` PIN kodlu test kullanıcısı.
2.  `cards` tablosunda bu kullanıcıya ait biri aktif 2 kart.
3.  `roundup_pool` (veya ilgili tablo) içerisinde kullanıcıya ait başlangıç bakiyesi.

---

