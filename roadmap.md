# ParaÜstü Proje Yol Haritası (Roadmap)

## 🏁 Faz 1: Backend Temizliği & Mimari (TAMAMLANDI ✅)
- [x] **Dil Birliği (Refactor):** Tüm `Islem` → `Transaction` dönüşümleri yapıldı.
- [x] **Varlık Ayrımı:** `RoundupPool` ve `Transaction` katmanları ayrıldı.
- [x] **Paket Yapısı:** Tüm entity'ler `com.paraustu.backend.entity` altına taşındı.
- [x] **H2 Geçişi:** Veritabanı kurulumu gerektirmeyen esnek yapıya geçildi.

## 💾 Faz 2: Seed Data (TAMAMLANDI ✅)
- [x] **Test Kullanıcısı:** `test@paraustu.com` / `test123` / `NEAREST_10` ile oluşturuldu.
- [x] **Kartlar:** A Bankası (Aktif) ve B Bankası (Pasif) eklendi.
- [x] **Geçmiş İşlemler:** Amazon, Migros, Trendyol vb. geçmiş veriler yüklendi.
- [x] **Otomasyon & Pool:** 100 TL eşikli kural ve 47.30 TL bakiye tanımlandı.

## 🔗 Faz 3: Temel Entegrasyon (DEVAM EDİYOR 🏗️)
- [x] **Auth Flow:** Login ekranı backend'e bağlandı, gerçek JWT altyapısı kuruldu.
- [ ] **Dashboard Entegrasyonu:** Dashboard'daki bakiyeler ve işlemler backend'den çekilecek.
- [ ] **Sanal Kart UI:** Kart bilgilerinin (son 4 hane, banka adı) arayüzde gösterilmesi.

## 🎭 Faz 4: Simülasyon Dünyası (TASLAK HAZIR 🧪)
- [x] **Simülasyon Dosyaları:** `ecommerce.html`, `bank_a.html`, `bank_b.html` oluşturuldu.
- [ ] **Ödeme Sayfası (/pay):** Uygulama içine e-ticaret'ten yönlendirme alacak sayfanın kodlanması.

## 💎 Faz 5: Otomasyon & Cila
- [ ] **Tetikleyici (Trigger):** Biriken para 100 TL'yi geçtiğinde otomatik alım simülasyonu.
- [ ] **PnL Hesaplama:** Portföy kâr/zarar durumunun güncellenmesi.
