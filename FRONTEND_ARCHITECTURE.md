# ParaÜstü — Frontend Mimarisi
*Son güncelleme: 26 Nisan 2026*

---

## 1. Tech Stack

| Araç | Versiyon | Açıklama |
|------|----------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool, dev server |
| **Tailwind CSS** | 3+ | Utility-first styling |
| **React Router** | 6+ | Sayfa yönlendirme |
| **Axios** | - | API istekleri |
| **Recharts** | - | Portföy grafikleri |

```bash
npm create vite@latest para-ustu -- --template react
cd para-ustu && npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom axios recharts
npx tailwindcss init -p
```

---

## 2. Renk Sistemi

| Token | Hex | Kullanım |
|-------|-----|---------|
| `forest` | `#012619` | Navbar, başlıklar, ana yazı |
| `green` | `#4EA664` | Primary buton, pozitif değer, vurgu |
| `mint` | `#78BF9E` | İkon, secondary element |
| `sage` | `#A9D9C2` | Border, disabled, ayraç |
| `cream` | `#E8E5DE` | Sayfa arkaplanı |

---

## 3. Klasör Yapısı

```
src/
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── cardApi.js
│   ├── transactionApi.js
│   ├── portfolioApi.js        # Hisse listesi (tüm BIST) + portföy
│   └── automationApi.js       # Tek kural CRUD
│
├── components/
│   ├── ui/                    # Button, Card, Input, Badge, Loader
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── BottomNav.jsx      # Mobil alt nav: Kumbaram | Hisselerim | Ayarlar
│   ├── cards/
│   ├── transactions/
│   ├── portfolio/
│   └── automation/
│       ├── StockSearchList.jsx   # Arama kutusu + hisse listesi
│       └── AutomationPanel.jsx   # Kayar alt panel (seçili hisse kurulumu)
│
├── pages/
│   ├── Login.jsx              ✅
│   ├── Register.jsx           ✅
│   ├── RoundingSplash.jsx     ✅
│   ├── Dashboard.jsx          ✅  (Kumbaram + Hisselerim tabları)
│   ├── Cards.jsx              ✅
│   ├── Automation.jsx         🔜  (yeni)
│   └── Settings.jsx           🔜  (yeni)
│
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── usePortfolio.js
└── utils/
    ├── formatCurrency.js
    ├── formatDate.js
    └── roundup.js
```

---

## 4. Sayfa Listesi

### 4.1–4.3 Login / Register / RoundingSplash ✅
*(değişiklik yok)*

---

### 4.4 Dashboard (`/dashboard`) ✅ — küçük güncelleme

**"Kumbaram" tab:**
- Biriken para üstü bakiyesi
- **"Yuvarlama Ayarı" butonu** → `/settings` sayfasına yönlendirir
- Aktif otomasyon özeti (varsa): `"100 TL → THYAO.IS"` — tıklanınca `/automation`'a gider
- Son 5 işlem listesi

**"Hisselerim" tab:**
- Toplam portföy değeri + kar/zarar
- Hisse listesi (sembol, adet, fiyat, kar/zarar)
- **"Otomasyon Kur" / "Otomasyonu Düzenle" butonu** → `/automation`'a yönlendirir
- Manuel alım/satım

---

### 4.5 Cards (`/cards`) ✅
*(değişiklik yok)*

---

### 4.6 Automation (`/automation`) 🔜 YENİ

**Amaç:** Kullanıcı biriken para üstü belirli bir eşiği geçince hangi hisseyi otomatik alsın seçer. Tek aktif kural olabilir.

**Layout (mobil öncelikli, tek sütun):**

```
┌─────────────────────────────┐
│  ← Geri    Otomasyon        │  ← Navbar / başlık
├─────────────────────────────┤
│  Mevcut kural özeti         │  ← varsa göster (aktif/pasif toggle)
├─────────────────────────────┤
│  🔍 Hisse ara...            │  ← arama kutusu
│  ─────────────────────────  │
│  THYAO.IS  Türk Hava Yolları│
│  BIMAS.IS  BİM Mağazalar    │  ← API'den gelen liste (filtrelenir)
│  AKBNK.IS  Akbank           │
│  ...                        │
└─────────────────────────────┘
         ↓ hisseye tıklanınca
┌─────────────────────────────┐
│  ████████████████████████   │  ← backdrop
│                             │
│  ┌─────────────────────┐   │
│  │ THYAO.IS seçildi    │   │
│  │ Eşik: [___] TL      │   │  ← kayar alt panel (bottom sheet)
│  │ Her [___] TL'de 1 adet al│
│  │ [Otomasyonu Kaydet] │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

**Detaylar:**
- API'den tüm BIST hisseleri çekilir: `GET /stocks` → `[{ symbol, name, price }]`
- Arama kutusu sembol veya şirket adına göre anlık filtreler
- Mevcut aktif kural varsa sayfanın üstünde özet kart gösterilir (aktif/pasif toggle + sil)
- Hisseye tıklanınca **bottom sheet** kayar (aynı sayfa, modal değil)
- Bottom sheet içeriği:
  - Seçili hisse adı + güncel fiyat
  - **Eşik tutarı** inputu: "Biriken para üstü bu tutara ulaşınca al" (ör. 100 TL)
  - **Kaydet** butonu → `POST /automation/rule { symbol, threshold }`
  - Mevcut kural varsa "Mevcut kural silinecek, devam et?" uyarısı
- Kayıt sonrası bottom sheet kapanır, üstteki özet kart güncellenir

**API:**
```js
GET  /stocks                          → [{ symbol, name, price, sector }]
GET  /automation/rule                 → { symbol, threshold, isActive } | null
POST /automation/rule  { symbol, threshold }  → kural oluştur/güncelle
PUT  /automation/rule  { isActive }           → aktif/pasif toggle
DELETE /automation/rule                       → kuralı sil
```

---

### 4.7 Settings (`/settings`) 🔜 YENİ

**Bölümler:**

1. **Yuvarlama Tercihi**
   - Mevcut seçimler özet olarak listelenir (4 aralık)
   - "Düzenle" → RoundingSplash ekranını tekrar göster (modal veya ayrı sayfa)

2. **Otomasyon**
   - Mevcut kural özeti (varsa)
   - "Düzenle" → `/automation`'a yönlendir

3. **Hesap**
   - Şifre / PIN değiştirme (opsiyonel, zamana göre)
   - **Çıkış Yap** butonu

---

## 5. Navigasyon

```
/                   → /dashboard (token varsa) veya /login
/login              → Login
/register           → Register
/dashboard          → Ana sayfa [Korumalı]
/cards              → Kart yönetimi [Korumalı]
/automation         → Otomasyon [Korumalı]
/settings           → Ayarlar [Korumalı]
```

### App.jsx:
```jsx
<Routes>
  <Route path="/login"    element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<PrivateRoute />}>
    <Route path="/dashboard"   element={<Dashboard />} />
    <Route path="/cards"       element={<Cards />} />
    <Route path="/automation"  element={<Automation />} />
    <Route path="/settings"    element={<Settings />} />
  </Route>
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
```

### BottomNav (mobil):
```
[ 🏠 Kumbaram ] [ 📈 Hisselerim ] [ ⚙️ Ayarlar ]
```
- Kumbaram → `/dashboard` (kumbaras tab)
- Hisselerim → `/dashboard` (hisselerim tab)
- Ayarlar → `/settings`

---

## 6. JWT & Auth
*(değişiklik yok — localStorage + AuthContext + Axios interceptor)*

---

## 7. API Endpoint Özeti

```js
// Auth
POST /auth/register
POST /auth/login

// Cards
GET    /cards
POST   /cards
DELETE /cards/:id

// Transactions
GET  /transactions
POST /transactions/simulate

// Portfolio
GET  /portfolio
POST /portfolio/buy   { symbol, quantity, source }
POST /portfolio/sell  { symbol, quantity }

// Stocks (YENİ)
GET  /stocks          → tüm BIST hisseleri [{ symbol, name, price, sector }]

// Automation (güncellendi)
GET    /automation/rule
POST   /automation/rule   { symbol, threshold }
PUT    /automation/rule   { isActive }
DELETE /automation/rule

// User
PUT /users/rounding-preferences
```

---

## 8. Geliştirme Sırası (güncel)

| # | Sayfa / Bileşen | Durum |
|---|----------------|-------|
| 1 | Login | ✅ |
| 2 | Register + OTP | ✅ |
| 3 | Rounding Splash | ✅ |
| 4 | Dashboard | ✅ |
| 5 | Cards | ✅ |
| 6 | Automation | ✅ |
| 7 | Settings | ✅ |
| 8 | Dashboard küçük güncellemeler | ✅ |