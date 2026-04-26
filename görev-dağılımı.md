# 🚀 ParaÜstü: Proje Geliştirme Planı ve Mimari

Bu doküman, ParaÜstü projesinin teknoloji yığınını, hackathon kurallarına uygun geliştirme stratejisini, takım içi görev dağılımını ve proje takvimini içermektedir.

---

## 🛠️ Teknoloji Yığını (Tech Stack) Seçimi

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend (Sunucu Katmanı)** | Python (FastAPI / Flask) | Hızlı prototipleme ve veri işleme için ideal. Yapay zeka kodlama asistanlarıyla (Aider, Claude Code) hızlı entegrasyon. |
| **Veritabanı (Güvenlik)** | SQLite + SQLCipher | Şartnamedeki "Güvenlik tasarımı" puanı için şifreli yerel veritabanı. |
| **Frontend (Arayüz)** | HTML/CSS/JS (Bootstrap) veya React/Flutter | Ekibin hızına bağlı olarak simülasyonu çalıştıracak temiz bir arayüz. |
| **Yatırım Verisi** | `yfinance` (Python Kütüphanesi) | BIST 100 hisse ve altın fiyatlarının anlık çekimi. |

---

## ⚖️ Yarışma Formatı Stratejisi

Hackathon değerlendirme kriterlerine göre **"Bağımsızlık"** ve **"Güvenlik"** puanlarını maksimize etmek için geliştirme sınırlarımız:

### 🎯 Kesinlikle Bizim Yazmamız Gerekenler (Bağımsızlık Puanı)
* **ParaÜstü Algoritması:** Gelen harcama verisini okuyan, kullanıcının seçtiği çarpana (1'e, 5'e, 10'a yuvarlama) göre farkı hesaplayan çekirdek matematiksel mantık.
* **Proxy Kart (Soyutlama) Mantığı:** Hangi bankadan para çekileceğine karar veren ve veriyi anonimleştiren (harcama detayını silip sadece tutarı bırakan) aracı yazılım katmanı.

### 📦 Hazır Kütüphane Kullanacağımız Yerler
* **Şifreleme:** Kendi algoritmamızı *yazmıyoruz*. AES-256 şifrelemesi veya şifre hash'leme (örn. bcrypt) için standart, kanıtlanmış kütüphaneler kullanılacak.
* **Finansal Veri:** Borsa/altın fiyatlarını çekmek için hazır API kütüphaneleri kullanılacak.

---

## 👥 3 Kişilik Görev Dağılımı ve Yapılacaklar Listesi

### 🧑‍💻 Kişi 1: Sistem Mimarı ve Backend (Veri & Güvenlik)
*Odak: Veritabanı işlemleri, şifreleme ve projenin kalbi olan algoritma.*

- [ ] **Görev 1:** FastAPI veya Flask ile backend iskeletini ayağa kaldırmak.
- [ ] **Görev 2:** SQLCipher kullanarak verilerin şifrelenmiş tutulduğu güvenli bir SQLite veritabanı şeması (Kullanıcılar, İşlemler, Portföy) tasarlamak.
- [ ] **Görev 3:** Gelen işlem tutarını alıp, yuvarlama farkını hesaplayan (ParaÜstü Algoritması) API endpoint'ini yazmak.
- [ ] **Görev 4:** Kullanıcı şifrelerinin hash'lenmesi ve API istekleri için JWT (Token) doğrulamasını entegre etmek.

### 🎨 Kişi 2: Frontend (Cihaz İçi İşlem ve Arayüz)
*Odak: Jürinin göreceği ekranları tasarlamak ve "Edge Computing" kısmını simüle etmek.*

- [ ] **Görev 1:** Kullanıcının 3 farklı sanal banka kartını ekleyebildiği arayüzü tasarlamak.
- [ ] **Görev 2:** Harcama simülasyonu arayüzünü geliştirmek (Örn: "187.40 TL'lik kahve harcaması yapıldı" butonu).
- [ ] **Görev 3:** **Veri Minimizasyonu:** JS/Frontend tarafında alışveriş dökümündeki gereksiz bilgileri (mekan adı vb.) filtreleyip, backend'e sadece "Çekilen Tutar" bilgisini gönderen yapıyı kurmak.
- [ ] **Görev 4:** Biriken tutarın ve alınan hisse/altın grafiklerinin gösterildiği "Portföy Özeti" panelini hazırlamak.

### 📊 Kişi 3: Yatırım Entegrasyonu, Simülasyon ve Sunum
*Odak: Mock verileri gerçekçi kılmak, borsa takibini bağlamak ve jüri dokümanlarını hazırlamak.*

- [ ] **Görev 1:** BIST 100/Altın verilerini otomatik çeken Python script'ini hazırlayıp backend'e entegre etmek (Temel analiz mantığının koda dökülmesi).
- [ ] **Görev 2:** Sisteme ilk veri akışını sağlamak için sahte ama gerçekçi bir "Banka Harcama Verisi" (JSON) hazırlamak.
- [ ] **Görev 3:** Şartnamede %25 ağırlığı olan **"Bağımlılık Haritası"** ve %30 ağırlığı olan **"Siber Güvenlik Mimarisi"** slaytlarını hazırlamak. (Proxy Kart mantığının görselleştirilmesi).

---

## 📅 Zaman Çizelgesi (26 Nisan - 30 Nisan)

| Tarih | Aşama | Detaylar |
| :--- | :--- | :--- |
| **26 Nisan** | 🏗️ Kurulum ve Taslak | Görev netleştirme, Git repo kurulumu. Backend veritabanı kurulumu, Frontend taslak çizimi, Mock JSON verilerinin hazırlanması. |
| **27 Nisan** | 🔗 Çekirdek Birleştirme | Frontend harcama butonunun backend'e bağlanması, algoritmanın yuvarlama yapıp şifreli DB'ye kayıt atması. |
| **28 Nisan** | 📈 Yatırım Entegrasyonu | Biriken tutar 100 TL'yi geçtiğinde gerçek zamanlı hisse fiyatı çekimi ve portföye yansıtılması işlemleri. |
| **29 Nisan** | 🐛 Debug ve Prova | Uçtan uca testler, hata ayıklama. Bağımsızlık ve güvenlik vurgulu jüri sunumunun provası. |
| **30 Nisan** | 🚀 Code Freeze & Demo | Kodun dondurulması ve final sunumu için hazır bekleyiş. |