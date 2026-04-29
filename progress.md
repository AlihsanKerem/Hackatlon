# Proje İlerleme Raporu (Frontend)

Bu dosya, frontend tarafında yapılan son güncellemeleri ve backend ile entegrasyon durumunu özetlemektedir.

## Yapılan Başlıca Değişiklikler

### 1. Giriş ve Kayıt Ekranları
- **Giriş (Login):** TC Kimlik Numarası ve 6 haneli PIN ile giriş sistemine geçildi. Mock modda 11 hane TC ve herhangi 6 hane PIN ile giriş yapılabilir.
- **Kayıt (Register):** Kayıt formuna TC Kimlik Numarası alanı eklendi.
- **Logo:** Hazırlanan logo (`/logo.png`) tüm giriş sayfalarında ve navbar'da kullanılmaya başlandı.

### 2. E-Ticaret Simülasyonu (Zamazor)
- Sitenin adı ve teması **Zamazor** (Amazon stili) olarak güncellendi.
- **Ödeme Akışı:** 
    - `ecommerce.html` -> `sepet.html` -> `odeme.html`
    - `odeme.html` artık doğrudan ParaÜstü uygulamasına (`/checkout`) yönlendirme yapıyor.
    - Ödeme tamamlandığında ParaÜstü uygulaması kullanıcıyı otomatik logout yaparak `sonuc.html` sayfasına geri yönlendiriyor.

### 3. Backend Entegrasyonu (API)
Aşağıdaki sayfalar `axiosInstance` üzerinden gerçek API uç noktalarına bağlandı:
- **Dashboard:** Bakiye, son işlemler, portföy ve kart listesi `/roundup/balance`, `/transactions`, `/portfolio`, `/cards` uç noktalarından çekiliyor.
- **Automation:** Otomasyon kuralı çekme, kaydetme, duraklatma ve silme işlemleri `/automation` ve `/automation/save` uç noktalarına bağlandı.
- **Cards:** Kart listeleme, aktif yapma, silme ve yeni kart ekleme işlemleri `/cards` uç noktalarına bağlandı.
- **Settings:** Kullanıcı bilgileri ve yuvarlama tercihleri `/users/me` ve `/users/preferences` uç noktalarına bağlandı.
- **Checkout:** Simüle edilen işlemler `/transactions/simulate` uç noktasına gönderiliyor.

## Backend Geliştiricisi İçin Notlar
- API isteklerinde `userId` parametresi query string olarak gönderilmektedir (Örn: `/cards?userId=...`).
- `axiosInstance`, `localStorage` üzerindeki `token`ı otomatik olarak `Authorization: Bearer <token>` header'ı olarak ekler.
- `Checkout.jsx` içerisinde başarılı ödeme sonrası `sonuc.html`'e yönlendirme yapılırken `amount` ve `merchant` parametreleri query string olarak iletilir.

## Eksik/Yapılacak İşler
- Bazı uç noktaların hata yönetimleri backend hazır olduğunda tekrar test edilmeli.
- Hisse senedi fiyatları şu an frontend tarafında mock verilerden (`MOCK_STOCKS`) gelmektedir, ileride bir fiyat servisi ile entegre edilebilir.
- Geri butonları eksik olan sayfalara (Geçmiş işlemler detayı vb.) navigasyon eklendi.

---
*Hazırlayan: Frontend Ekibi (AI Assistant)*
