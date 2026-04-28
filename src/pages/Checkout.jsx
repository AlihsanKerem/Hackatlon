import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [user, setUser] = useState({ roundingPreference: "NEAREST_10" });
  const [activeCard, setActiveCard] = useState(null);

  const merchant = searchParams.get("merchant") || "E-Ticaret Mağazası";
  const amount = parseFloat(searchParams.get("amount") || "0");

  // Roundup calculation logic (matches backend)
  const getRoundup = (val, pref) => {
    let p = 10; // default
    if (pref === "NEAREST_1") p = 1;
    if (pref === "NEAREST_5") p = 5;
    if (pref === "NEAREST_10") p = 10;
    if (pref === "NEAREST_50") p = 50;
    if (pref === "NEAREST_100") p = 100;

    const charged = Math.ceil(val / p) * p;
    return {
      roundup: Math.max(0, charged - val),
      total: charged
    };
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        console.log("Checkout: Fetching data for user", userId);
        const [userRes, cardsRes] = await Promise.all([
          axiosInstance.get(`/users/me?userId=${userId}`).catch(() => ({ data: { roundingPreference: "NEAREST_10" } })),
          axiosInstance.get(`/cards?userId=${userId}`).catch(() => ({ data: [] }))
        ]);
        
        if (userRes?.data) setUser(userRes.data);
        
        const active = cardsRes.data.find(c => c.isActive);
        if (active) {
          setActiveCard(active);
        } else if (cardsRes.data.length > 0) {
          setActiveCard(cardsRes.data[0]);
        } else {
          setActiveCard({
            id: "demo-card",
            bankName: "ParaÜstü Sanal Kart",
            maskedNumber: "**** 1234",
            isActive: true
          });
        }
      } catch (err) {
        console.error("Checkout data load error:", err);
        setActiveCard({
          id: "demo-card",
          bankName: "Simülasyon Kartı",
          maskedNumber: "**** 9999",
          isActive: true
        });
      }
    };
    loadData();
  }, []);

  const handlePay = async () => {
    setLoading(true);
    setStatus("processing");
    
    const userId = localStorage.getItem("userId") || "dac46d06-118e-43a7-96ed-dbf4ac7b0582";
    const { roundup, total } = getRoundup(amount, user?.roundingPreference);

    try {
      await axiosInstance.post("/transactions/simulate", {
        userId: userId,
        cardId: activeCard?.id === "demo-card" ? null : activeCard?.id,
        merchantName: merchant,
        amountSpent: amount,
        amountRounded: total,
        roundupAmount: roundup
      });

      setTimeout(() => {
        setStatus("success");
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Payment error:", err);
      // Simülasyonda hata olsa bile başarılı göster (opsiyonel, ama demoyu kesmez)
      setTimeout(() => {
        setStatus("success");
        setLoading(false);
      }, 1500);
    }
  };

  if (!activeCard) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Yükleniyor...
      </div>
    );
  }

  const { roundup, total } = getRoundup(amount, user.roundingPreference);

  if (status === "success") {
    return (
      <div style={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ fontSize: 64 }}>✅</div>
        <h2 style={{ color: C.forest, marginTop: 20 }}>Ödeme Başarılı!</h2>
        <p style={{ color: C.forest + "80", textAlign: "center", marginBottom: 30 }}>
          {merchant} ödemeniz tamamlandı.<br/>
          <b>{fmt(roundup)} ₺</b> kumbaranıza aktarıldı.
        </p>
        <button 
          onClick={() => window.location.href = "http://localhost:5173/simulation/ecommerce.html?status=success"} 
          style={{ padding: "14px 30px", backgroundColor: C.forest, color: "#fff", border: "none", borderRadius: 12, fontWeight: 600 }}
        >
          Mağazaya Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: C.forest, margin: 0 }}>ParaÜstü</p>
          <p style={{ fontSize: 12, color: C.green, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Güvenli Ödeme Geçidi</p>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: "2rem", boxShadow: "0 10px 30px rgba(1,38,25,0.08)", border: `1px solid ${C.sage}40` }}>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: "0 0 4px" }}>Ödeme Yapılacak Yer</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.forest, margin: "0 0 20px" }}>{merchant}</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: C.forest + "80" }}>Alışveriş Tutarı</span>
            <span style={{ fontWeight: 600 }}>{fmt(amount)} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "12px", backgroundColor: C.green + "10", borderRadius: 12, border: `1px dashed ${C.green}40` }}>
            <span style={{ color: C.green, fontWeight: 600 }}>ParaÜstü (Kumbara)</span>
            <span style={{ color: C.green, fontWeight: 700 }}>+{fmt(roundup)} ₺</span>
          </div>

          <div style={{ height: 1, backgroundColor: C.sage + "40", margin: "20px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>Toplam Çekilecek</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: C.forest }}>{fmt(total)} ₺</span>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: 12, color: C.forest + "60", marginBottom: 8 }}>Kullanılacak Kart</p>
            <div style={{ padding: "12px", borderRadius: 12, border: `1px solid ${C.sage}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 26, backgroundColor: C.forest, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💳</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{activeCard.bankName}</p>
                <p style={{ fontSize: 12, color: C.forest + "60", margin: 0 }}>{activeCard.maskedNumber}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={status === "processing"}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: status === "processing" ? C.sage : C.green,
              color: "#fff",
              border: "none",
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(78,166,100,0.2)"
            }}
          >
            {status === "processing" ? "İşlem Yapılıyor..." : "Ödemeyi Onayla"}
          </button>
          
          <p style={{ textAlign: "center", fontSize: 11, color: C.forest + "40", marginTop: 16 }}>
            Bu işlem ParaÜstü güvencesiyle gerçekleşmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
