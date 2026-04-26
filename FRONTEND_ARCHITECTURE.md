## 1. Tech Stack

| Araç | Versiyon | Açıklama |
|------|----------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool, dev server |
| **Tailwind CSS** | 3+ | Utility-first styling |
| **React Router** | 6+ | Sayfa yönlendirme |
| **Axios** | - | API istekleri |
| **Recharts** | - | Portföy grafikleri |

Kurulum komutu:
```bash
npm create vite@latest para-ustu -- --template react
cd para-ustu
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom axios recharts
npx tailwindcss init -p
```

---

## 2. Renk Sistemi

Uygulama **açık mod** olarak tasarlanmıştır. Koyu mod hackathon kapsamında yoktur.

`tailwind.config.js` içine eklenecek:

```js
theme: {
  extend: {
    colors: {
      forest: '#012619',   // Ana yazı, navbar arkaplanı, başlıklar
      green:  '#4EA664',   // Primary buton, pozitif değer, vurgu
      mint:   '#78BF9E',   // İkon, secondary element, etiket
      sage:   '#A9D9C2',   // Border, hover state, disabled
      cream:  '#E8E5DE',   // Sayfa arkaplanı
    }
  }
}
```

**Kullanım kuralları:**
- Sayfa arkaplanı → `bg-cream`
- Kart arkaplanı → `bg-white` + `border border-sage`
- Navbar arkaplanı → `bg-forest`
- Navbar yazı → `text-cream`
- Ana yazı → `text-forest`
- İkincil yazı → `text-forest/60`
- Primary buton → `bg-green text-white`
- Primary buton hover → `bg-green/90`
- Pozitif değer (kar) → `text-green`
- Negatif değer (zarar) → `text-red-500`
- İkincil bilgi / ikonlar → `text-mint`
- Border / ayraç → `border-sage`

---

## 3. Klasör Yapısı

```
src/
├── api/
│   ├── axiosInstance.js     # Axios base config, interceptor (token ekleme)
│   ├── authApi.js           # Kayıt, giriş endpoint'leri
│   ├── cardApi.js           # Kart CRUD
│   ├── transactionApi.js    # İşlem geçmişi (dış simülasyon uygulamasından gelir)
│   ├── portfolioApi.js      # Portföy, alım/satım
│   └── automationApi.js     # Otomasyon kural yönetimi
│
├── components/
│   ├── ui/                  # Genel, tekrar kullanılan küçük componentler
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Badge.jsx
│   │   └── Loader.jsx
│   ├── layout/
│   │   ├── Navbar.jsx       # Üst navigasyon (sadece giriş sonrası)
│   │   ├── Sidebar.jsx      # Sol menü (masaüstü)
│   │   └── BottomNav.jsx    # Alt menü (mobil)
│   ├── cards/
│   │   ├── CardItem.jsx     # Tek kart gösterimi
│   │   └── AddCardModal.jsx # Kart ekleme formu
│   ├── transactions/
│   │   └── TransactionList.jsx # İşlem geçmişi listesi
│   ├── portfolio/
│   │   ├── StockRow.jsx     # Portföydeki tek hisse satırı
│   │   └── ProfitBadge.jsx  # Kar/zarar göstergesi
│   └── automation/
│       └── RuleForm.jsx     # Otomasyon kural formu
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx        # "Kumbaram" ve "Hisselerim" tabları burada
│   ├── Cards.jsx
│   └── Settings.jsx
│
├── context/
│   └── AuthContext.jsx      # JWT token ve kullanıcı bilgisi global state
│
├── hooks/
│   ├── useAuth.js           # AuthContext'e erişim hook'u
│   └── usePortfolio.js      # Portföy verisi fetch hook'u
│
├── utils/
│   ├── formatCurrency.js    # "1234.50" → "1.234,50 ₺"
│   ├── formatDate.js        # Tarih formatlama
│   └── roundup.js           # Yuvarlama algoritması (frontend önizleme için)
│
├── App.jsx                  # Router tanımları
└── main.jsx                 # Entry point
```


---

## 4. Sayfa Listesi ve İçerikleri

### 4.1 Login (`/login`)
- Email + şifre formu
- "Giriş Yap" butonu
- "Hesabın yok mu? Kayıt ol" linki
- Hatalı giriş → kırmızı uyarı mesajı

### 4.2 Register (`/register`)
- Ad soyad, email, telefon
- 6 haneli PIN + PIN tekrar
- Telefon OTP doğrulama adımı
- Yuvarlama tercihi bu adımda **sorulmaz** — dashboard'a ilk girişte ayrı splash ekranında gösterilir

### 4.3 Rounding Splash (`/dashboard` ilk girişte, modal/overlay değil tam ekran)
Kullanıcının tüm yuvarlama tercihleri `null` ise dashboard render edilmeden önce gösterilir.

4 aralık için ayrı ayrı seçim yapılır (accordion düzeni):
- **10 TL altı** → 1 / 5 / 10 TL
- **10–100 TL arası** → 1 / 5 / 10 / 50 / 100 TL
- **100–1.000 TL arası** → 1 / 10 / 50 / 100 / 1.000 TL
- **1.000 TL üzeri** → 1 / 10 / 100 / 1.000 / 10.000 TL

Her seçenek için o aralığa uygun örnek tutar ve tahmini para üstü gösterilir.
Tüm aralıklar seçilmeden "Devam Et" butonu aktif olmaz.
Seçimler `PUT /users/rounding-preferences` ile kaydedilir, ardından dashboard'a yönlendirilir.

> Kullanıcı ayarlar sayfasından bu tercihleri her zaman değiştirebilir.
# ParaÜstü — Frontend Mimarisi

Bu doküman, frontend geliştirme sürecinde tüm kararları, klasör yapısını, sayfa listesini, component hiyerarşisini ve API entegrasyonunu kapsar.

---

### 4.4 Dashboard (`/dashboard`) — Ana Sayfa

> **Önemli:** Harcama simülasyonu bu uygulamada yoktur. Simülasyon ayrı bir uygulama üzerinden yapılacak, işlemler backend'e oradan gelecektir. Bu uygulama gerçek banka uygulaması gibi davranır.

Üst kısım:
- Selamlama: "Merhaba, [Ad]"
- İki tab butonu: **Kumbaram** | **Hisselerim**
- Tab değişince içerik değişir, URL aynı kalır (`/dashboard`)

**"Kumbaram" Tab İçeriği:**
- Biriken para üstü bakiyesi (büyük, vurgulu)
- Aktif otomasyon kural özeti (varsa): "100 TL → THYAO.IS"
- Son 5 işlem listesi (tarih, satıcı, orijinal tutar, para üstü)
- "Tüm işlemleri gör" linki

**"Hisselerim" Tab İçeriği:**
- Toplam portföy değeri
- Toplam kar/zarar (TL ve %)
- Hisse listesi (sembol, adet, anlık fiyat, kar/zarar)
- Manuel alım/satım butonu

### 4.5 Cards (`/cards`) — Kart Yönetimi
- Kullanıcının kartları (her biri masked numarayla gösterilir: `**** 1234`)
  - Banka adı
  - Aktif/Pasif toggle
  - Sil butonu
- "Yeni Kart Ekle" butonu → Modal açılır
  - Banka seç: A Bankası / B Bankası
  - Kart numarası (16 hane, otomatik boşluk)
  - Son kullanma tarihi (MM/YY)
  - CVV (form gönderilince unutulur, saklanmaz)

### 4.6 Portfolio (`/portfolio`) — Portföy
Üst kısım:
- Toplam portföy değeri
- Toplam kar/zarar (TL ve %)

Liste:
- Her hisse için bir satır:
  - Sembol (THYAO.IS)
  - Adet
  - Ortalama maliyet
  - Güncel fiyat (API'den anlık)
  - Kar/zarar (yeşil/kırmızı)
  - "Sat" butonu → miktar gir, onayla

Alt kısım:
- Manuel alım formu:
  - Sembol gir (veya listeden seç)
  - Miktar
  - "Roundup bakiyemden al" veya "Direkt öde" seçeneği
  - "Al" butonu

### 4.7 Settings (`/settings`) — Ayarlar
- Yuvarlama tercihi değiştirme
- Otomasyon kuralı:
  - Aktif/Pasif toggle
  - Eşik tutarı (ör. 100 TL)
  - Hedef hisse seçimi
- Şifre değiştirme (opsiyonel, zamana göre)
- Çıkış Yap butonu

---

## 5. Navigasyon (Routing)

```
/                   → /dashboard'a yönlendir (giriş varsa) veya /login
/login              → Login sayfası (giriş varsa /dashboard'a yönlendir)
/register           → Register sayfası
/dashboard          → Ana sayfa, Kumbaram + Hisselerim tabları [Korumalı]
/cards              → Kart yönetimi [Korumalı]
/settings           → Ayarlar [Korumalı]
```

**Korumalı route:** Token yoksa otomatik `/login`'e yönlendir.

### App.jsx yapısı:
```jsx
<Routes>
  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected */}
  <Route element={<PrivateRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/cards" element={<Cards />} />
    <Route path="/settings" element={<Settings />} />
  </Route>

  {/* Default */}
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
```

---

## 6. JWT Token Yönetimi

Token `localStorage`'da tutulacak:

```js
// Giriş sonrası
localStorage.setItem('token', response.data.token)

// Çıkış
localStorage.removeItem('token')
```

**AuthContext (`context/AuthContext.jsx`):**
- Token'ı okur, kullanıcı bilgisini tutar
- `login()`, `logout()` fonksiyonları sağlar
- Tüm app bunu kullanır

**Axios interceptor (`api/axiosInstance.js`):**
- Her API isteğine otomatik token ekler
- 401 gelirse `/login`'e yönlendirir

```js
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

---

## 7. API Endpoint Bağlantıları

```js
// axiosInstance.js
const BASE_URL = 'http://localhost:8080/api'  // Backend adresi

// authApi.js
POST /auth/register   { email, password, roundingPreference }
POST /auth/login      { email, password } → { token }

// cardApi.js
GET    /cards              → Kullanıcının kartları
POST   /cards              → Yeni kart ekle
DELETE /cards/:id          → Kart sil

// transactionApi.js
POST   /transactions/simulate    { cardId, merchant, amount } → { charged, roundup }
GET    /transactions             → İşlem geçmişi

// portfolioApi.js
GET    /portfolio                → Portföy (kar/zarar anlık hesaplanır)
POST   /portfolio/buy            { symbol, quantity, source }
POST   /portfolio/sell           { symbol, quantity }
GET    /portfolio/history        → Alım/satım geçmişi

// automationApi.js
GET    /automation/rule          → Aktif kural
POST   /automation/rule          { symbol, threshold }
PUT    /automation/rule          { isActive }
```

---

## 8. Responsive Tasarım

- **Mobil (<768px):** Alt navigasyon bar (BottomNav), tek sütun layout
- **Tablet/Desktop (≥768px):** Sol sidebar, çok sütun layout

Tailwind breakpoint kullanımı:
```jsx
<div className="flex flex-col md:flex-row">
  <Sidebar className="hidden md:block" />
  <BottomNav className="block md:hidden" />
  <main className="flex-1">...</main>
</div>
```

---

## 9. Öncelik Sırası (Geliştirme Sırası)

1. **Login / Register** → Olmadan hiçbir şey test edilemez
2. **Dashboard — Kumbaram tab'ı** → Biriken bakiye ve işlem geçmişi
3. **Dashboard — Hisselerim tab'ı** → Portföy özeti ve alım/satım
4. **Kart Yönetimi** → Kart ekleme/silme/görüntüleme
5. **Ayarlar** → Otomasyon kuralı ve yuvarlama tercihi

---

## 10. Claude ile Çalışma Stratejisi

Her component için yeni konuşma aç ve şu template'i kullan:

```
Renk sistemim şu:
- forest: #012619 (arkaplan)
- green: #4EA664 (primary)
- mint: #78BF9E (secondary)
- sage: #A9D9C2 (border/hover)
- cream: #E8E5DE (yazı/kart)

React + Tailwind CSS kullanıyorum.
Sade, modern, fintech görünümü istiyorum.

[Component adı] component'ini yaz. İçeriği şu olsun: [detay]
```

---

*Son güncelleme: 26 Nisan 2026*