# ParaÜstü — Simülasyon Mimarisi (E-Ticaret & POS)

Bu doküman, e-ticaret simülasyonu ve POS simülasyonunun nasıl çalışacağını, ödeme akışını ve banka arayüzlerini kapsar.

---

## 1. Genel Bakış

Sistemde 3 ayrı uygulama vardır:

| Uygulama | Teknoloji | Açıklama |
|----------|-----------|---------|
| **ParaÜstü Ana Uygulama** | React | Kullanıcının kumbara ve portföyünü yönettiği asıl uygulama |
| **E-Ticaret Simülasyonu** | HTML/CSS/JS | Sahte online alışveriş sitesi |
| **Banka Arayüzleri** | HTML/CSS/JS | A Bankası ve B Bankası işlem geçmişi sayfaları |

POS simülasyonu e-ticaret bittikten sonra yapılacak, aynı ödeme akışını kullanacak.

---

## 2. Ödeme Akışı (Tam Senaryo)

```
1. Kullanıcı e-ticaret sitesinde ürün seçer (ör. 15 TL'lik kitap)
2. "Satın Al" butonuna basar
3. E-ticaret sitesi kullanıcıyı ParaÜstü Ödeme Sayfasına yönlendirir:
   → https://paraüstü.app/pay?amount=15.00&merchant=KitapDünyası&callback=https://eticaret.app/result

4. ParaÜstü Ödeme Sayfasında:
   → Kullanıcı kart bilgilerini girer (kart verisi sadece burada işlenir)
   → Yuvarlama önizlemesi gösterilir: "15 TL → 20 TL (5 TL kumbaraya)"
   → "Onayla" butonuna basar

5. ParaÜstü backend işlemi yapar:
   → Kullanıcının seçili bankasından 20 TL çekilir
   → 15 TL ödeme olarak işaretlenir
   → 5 TL roundup_pool'a eklenir
   → Transaction kaydı oluşturulur
   → Otomasyon kontrol edilir (eşik geçildi mi?)

6. Kullanıcı e-ticaret sitesine geri yönlendirilir:
   → https://eticaret.app/result?status=success&amount=15.00&ref=TXN123

7. E-ticaret sitesi "Ödeme Başarılı" ekranını gösterir
```

---

## 3. URL Parametreleri

### ParaÜstü Ödeme Sayfasına Gelen Parametreler:
```
/pay?amount=15.00&merchant=KitapDünyası&callback=https://eticaret.app/result
```

| Parametre | Açıklama | Örnek |
|-----------|---------|-------|
| `amount` | Satın alınan ürünün gerçek tutarı | `15.00` |
| `merchant` | Satıcı adı (işlem geçmişinde görünecek) | `KitapDünyası` |
| `callback` | İşlem sonrası dönülecek URL | `https://eticaret.app/result` |

### E-Ticaret Sitesine Dönen Parametreler:
```
/result?status=success&amount=15.00&ref=TXN123
```

| Parametre | Açıklama |
|-----------|---------|
| `status` | `success` veya `failed` |
| `amount` | Ödenen tutar (orijinal, 15 TL) |
| `ref` | Transaction ID (referans numarası) |

---

## 4. ParaÜstü Ödeme Sayfası (`/pay`)

Bu sayfa **ParaÜstü ana uygulamasının** bir sayfasıdır, e-ticaret sitesinden bağımsızdır.

### Kullanıcı giriş yapmışsa:
```
┌─────────────────────────────┐
│  ParaÜstü ile Öde           │
├─────────────────────────────┤
│  KitapDünyası               │
│  Ürün tutarı: 15,00 ₺       │
├─────────────────────────────┤
│  Yuvarlama Özeti:           │
│  15 TL → 20 TL              │
│  5 TL kumbarana gidecek 🐷  │
├─────────────────────────────┤
│  Aktif Kart:                │
│  [A Bankası **** 4242]      │
│  (Kartını değiştirmek için  │
│   uygulamaya git)           │
├─────────────────────────────┤
│  [İptal]    [20 TL Öde ✓]  │
└─────────────────────────────┘
```

### Kullanıcı giriş yapmamışsa:
- Login ekranına yönlendir, giriş sonrası `/pay` sayfasına geri dön

### Önemli Notlar:
- Kart bilgisi tekrar girilmez — kullanıcının ParaÜstü'de seçili aktif kartı kullanılır
- Kullanıcı kartı değiştirmek isterse ana uygulamaya gitmesi gerekir
- Yuvarlama miktarı kullanıcının kayıtlı tercihine göre otomatik hesaplanır

---

## 5. E-Ticaret Simülasyon Sitesi

### Sayfalar:
| Sayfa | URL | Açıklama |
|-------|-----|---------|
| Ana Sayfa / Ürün Listesi | `/` | Sahte ürünler listelenir |
| Ürün Detay | `/product/:id` | Ürün adı, fiyatı, "Satın Al" butonu |
| Ödeme Sonucu | `/result` | Başarılı/başarısız ekranı |

### Ürün Listesi (Sabit, mock data):
```js
const products = [
  { id: 1, name: "Python ile Programlama",     price: 149.90, image: "📚" },
  { id: 2, name: "Bluetooth Kulaklık",          price: 299.00, image: "🎧" },
  { id: 3, name: "Organik Kahve 500g",          price: 87.50,  image: "☕" },
  { id: 4, name: "Yoga Matı",                   price: 210.00, image: "🧘" },
  { id: 5, name: "Mekanik Klavye",              price: 1249.00,image: "⌨️" },
  { id: 6, name: "Günlük Defter",               price: 34.90,  image: "📓" },
]
```

### Akış:
```
Ana Sayfa → Ürüne tıkla → Ürün Detay → "Satın Al"
→ ParaÜstü'ye yönlendir (amount + merchant + callback parametreleriyle)
→ Ödeme tamamlanır → /result?status=success
```

### Tasarım Notları:
- Sade, tanıdık bir e-ticaret görünümü (Amazon/Trendyol'dan ilham)
- Header'da sahte site adı: "KitapDünyası" veya "ShopNow" gibi
- Ürün kartları: resim (emoji), ad, fiyat, "Satın Al" butonu
- Mobil uyumlu olmasına gerek yok, masaüstü yeterli

---

## 6. Banka Arayüzleri (A Bankası & B Bankası)

Her banka için **ayrı bir HTML sayfası** olacak. Sadece işlem geçmişini gösterecek.

### A Bankası Arayüzü:

```
┌─────────────────────────────────┐
│  🏦 A Bankası                   │
│  Ahmet Yılmaz — **** 4242       │
├─────────────────────────────────┤
│  Güncel Bakiye: 4.280,00 ₺      │
├─────────────────────────────────┤
│  SON İŞLEMLER                   │
│  ─────────────────────────────  │
│  ParaÜstü Ödeme Hizmetleri      │
│  28 Nis 2026          -20,00 ₺  │
│                                 │
│  ParaÜstü Ödeme Hizmetleri      │
│  27 Nis 2026         -149,90 ₺  │
│                                 │
│  Market Alışverişi              │
│  26 Nis 2026          -67,50 ₺  │
└─────────────────────────────────┘
```

### Önemli Notlar:
- İşlem adı her zaman **"ParaÜstü Ödeme Hizmetleri"** olarak görünür (biz aracıyız)
- Tutar her zaman **yuvarlanmış tutar** (20 TL, 150 TL vs.) — orijinal tutar değil
- Bakiye backend'den çekilecek (`GET /cards/:id/balance` veya mock)
- İşlem geçmişi backend'den çekilecek (`GET /transactions?bank=A`)
- İki banka sayfası tasarım olarak benzer, sadece renk ve logo farklı

### Banka Renk Önerileri:
| Banka | Ana Renk | İkincil Renk |
|-------|---------|-------------|
| A Bankası | `#003087` (koyu mavi) | `#FFD700` (altın) |
| B Bankası | `#C8102E` (kırmızı) | `#FFFFFF` (beyaz) |

---

## 7. Backend API Gereksinimleri

E-ticaret ve banka arayüzleri için backend'e eklenmesi gereken endpoint'ler:

```
# Ödeme işlemi (e-ticaret'ten gelen)
POST /payments/process
Body: { amount, merchant, cardId }
Response: { status, transactionId, chargedAmount, roundupAmount }

# Banka işlem geçmişi
GET /transactions?bankName=A Bankası
Response: [{ merchant, amount, date, type }]

# Kart bakiyesi (mock olabilir)
GET /cards/:id/balance
Response: { balance }
```

---

## 8. Geliştirme Sırası

| # | İş | Açıklama |
|---|-----|---------|
| 1 | `/pay` sayfası | ParaÜstü ana uygulamasına eklenecek |
| 2 | `POST /payments/process` | Backend endpoint |
| 3 | E-ticaret sitesi | Ürün listesi + yönlendirme akışı |
| 4 | Banka arayüzleri | A ve B bankası işlem geçmişi |
| 5 | POS simülasyonu | E-ticaret bittikten sonra, aynı ödeme akışı |

---

## 9. POS Simülasyonu (Sonraki Adım)

E-ticaret bittikten sonra yapılacak. Temel fark:

| | E-Ticaret | POS |
|--|-----------|-----|
| Tutarı kim giriyor? | Ürün fiyatı sabit | Kasiyer giriyor |
| Yönlendirme var mı? | Evet | Hayır (tek ekran) |
| Geri dönüş | E-ticaret sitesine | POS ekranında kalır |

POS için tek sayfa yeterli:
```
Tutar gir → ParaÜstü ile öde → Onay ekranı → Yeni işlem
```

---

*Son güncelleme: 28 Nisan 2026*
