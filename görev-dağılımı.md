Teknoloji Yığını (Tech Stack) Seçimi
Backend (Sunucu Katmanı): Python (FastAPI veya Flask). Python, hızlı prototipleme ve veri işleme için en iyi araçtır. Özellikle yapay zeka araçlarıyla (Aider, Claude Code vb.) desteklendiğinde backend sürecini inanılmaz hızlandırır.

Veritabanı (Güvenlik Katmanı): SQLite + SQLCipher. Şartnamedeki "Güvenlik tasarımı" puanını almak için veritabanının şifreli olması kritik.

Frontend (Arayüz): Ekibin yatkınlığına göre basit bir Web Arayüzü (HTML/CSS/JS + Bootstrap) veya temel bir Flutter/React uygulaması. Amaç sadece simülasyonu göstermek.

Yatırım Verisi: BIST 100 hisse veya altın fiyatlarını çekmek için yfinance gibi hazır Python kütüphaneleri.

Yarışma Formatı İçin: Neyi Biz Yapmalıyız, Nerede Kütüphane Kullanmalıyız?
Kesinlikle Sizin Yazmanız Gerekenler (Bağımsızlık Puanı İçin):

ParaÜstü Algoritması: Gelen harcama verisini okuyan, kullanıcının seçtiği çarpana (1'e, 5'e, 10'a yuvarlama) göre farkı hesaplayan matematiksel mantık.

Proxy Kart (Soyutlama) Mantığı: Hangi bankadan para çekileceğine karar veren ve veriyi anonimleştiren (harcama detayını silip sadece tutarı bırakan) aracı yazılım katmanı.

Hazır Kütüphane Kullanmanız Gerekenler:

Şifreleme: AES-256 şifrelemesi veya şifre hash'leme (örn. bcrypt) için kendi algoritmanızı yazmayın, standart kütüphaneleri kullanın (Güvenlik zafiyeti yaratmamak adına kural budur).

Finansal Veri Çekimi: Borsa/altın fiyatlarını çekmek için API kütüphaneleri kullanmak tamamen serbest ve mantıklıdır.

3 Kişilik Görev Dağılımı ve Yapılacaklar Listesi
🧑‍💻 Kişi 1: Sistem Mimarı ve Backend (Veri & Güvenlik)
Odak: Veritabanı işlemleri, şifreleme ve projenin kalbi olan algoritma.

Görev 1: FastAPI veya Flask ile bir backend projesi ayağa kaldırmak.

Görev 2: SQLCipher kullanarak verilerin şifrelenmiş bir şekilde tutulduğu güvenli bir SQLite veritabanı şeması (Kullanıcılar, İşlemler, Portföy tabloları) oluşturmak.

Görev 3: Gelen işlem tutarını alıp, yuvarlama farkını hesaplayan (ParaÜstü Algoritması) API uç noktasını (endpoint) yazmak.

Görev 4: Kullanıcının şifrelerinin hash'lenerek saklanması ve API istekleri için JWT (Token) doğrulaması eklemek.

🎨 Kişi 2: Frontend (Cihaz İçi İşlem ve Arayüz)
Odak: Jürinin göreceği ekranları tasarlamak ve "Edge Computing" (cihazda işlem) kısmını simüle etmek.

Görev 1: Kullanıcının 3 farklı banka kartını (sanal olarak) ekleyebildiği temiz bir arayüz tasarlamak.

Görev 2: Harcama simülasyonu ekranı yapmak. (Örn: "187.40 TL'lik kahve harcaması yapıldı" butonuna basılınca çalışan bir arayüz).

Görev 3: Jürinin "Veriler cihazda nasıl işleniyor?" sorusuna yanıt olarak, kullanıcının banka alışveriş dökümündeki gereksiz bilgileri (nereden alındığı) JavaScript/Frontend tarafında filtreleyip, backend'e sadece ve sadece "Çekilen Tutar" bilgisini gönderen yapıyı kurmak (Veri Minimizasyonu).

Görev 4: Biriken paranın ve alınan hisse/altın grafiklerinin gösterildiği bir "Portföy Özeti" paneli hazırlamak.

📊 Kişi 3: Yatırım Entegrasyonu, Simülasyon ve Sunum
Odak: Sistemdeki "mock" (sahte) verileri gerçekçi kılmak, borsa takibini bağlamak ve jüriyi ikna edecek dokümanları hazırlamak.

Görev 1: Yatırım tarafı için BIST 100 veya altın verilerini otomatik çeken bir Python script'i hazırlayıp Kişi 1'in backend'ine entegre etmek. Borsadaki temel analiz mantığını (örneğin sadece hacimli hisselere otomatik yatırım yapılması) koda dökmek.

Görev 2: Sisteme ilk veri akışını sağlamak için sahte ama gerçekçi bir "Banka Harcama Verisi" (JSON formatında) dökümü hazırlamak.

Görev 3: Şartnamede %25 ağırlığı olan "Bağımlılık Haritası" ve %30 ağırlığı olan "Siber Güvenlik Mimarisi" dokümanlarını/slaytlarını hazırlamak. Mevcut banka sistemlerinin zayıflıklarını ve ParaÜstü'nün bu bağımlılıkları nasıl ortadan kaldırdığını (Proxy Kart mantığı) görselleştirmek.

Zaman Çizelgesi (26 Nisan - 30 Nisan)
26 Nisan (Bugün): Görevleri netleştirin, boş GitHub veya GitLab reposunu açın. Kişi 1 güvenli veritabanını ayağa kaldırsın, Kişi 2 arayüz taslaklarına başlasın, Kişi 3 sahte banka verilerini (JSON) hazırlasın.

27 Nisan: Çekirdek birleştirme. Frontend'deki harcama butonuna basıldığında, veri backend'e gitsin, algoritma yuvarlama yapsın ve şifreli veritabanına kayıt atılsın.

28 Nisan: Yatırım entegrasyonu. Veritabanında biriken para 100 TL'yi geçtiğinde, sistem gerçek zamanlı hisse fiyatını çekip "X partisinden 2 lot hisse alındı" olarak portföye yansıtsın.

29 Nisan: Hata ayıklama (Debugging) ve Sunum provası. Projeyi uçtan uca çalıştırın. Kişi 3'ün hazırladığı slaytlar üzerinden jüriye nasıl sunacağınızı (özellikle bağımsızlık ve güvenlik vurgularını) çalışın.

30 Nisan: Kod dondurma (Code Freeze) ve Final Demosu.