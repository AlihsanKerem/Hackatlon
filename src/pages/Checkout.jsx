import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const C = {
  forest: "#012619",
  green: "#4EA664",
  mint: "#78BF9E",
  sage: "#A9D9C2",
  cream: "#E8E5DE",
};

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

const getRoundup = (val, pref) => {
  const map = { NEAREST_1: 1, NEAREST_5: 5, NEAREST_10: 10, NEAREST_50: 50, NEAREST_100: 100 };
  const p = map[pref] ?? 10;
  const charged = Math.ceil(val / p) * p;
  return { roundup: Math.max(0, charged - val), total: charged };
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const merchant = searchParams.get("merchant") || "E-Ticaret Mağazası";
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [user, setUser] = useState({ roundingPreference: "NEAREST_10" });
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | processing | success | rejected
  const [countdown, setCountdown] = useState(60);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvError, setCvvError] = useState("");
  const timerRef = useRef(null);

  // Countdown
  useEffect(() => {
    if (status !== "idle") return;
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setStatus("rejected");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }
    const load = async () => {
      try {
        const [userRes, cardsRes] = await Promise.all([
          axiosInstance.get(`/users/me?userId=${userId}`).catch(() => ({ data: { roundingPreference: "NEAREST_10" } })),
          axiosInstance.get(`/cards?userId=${userId}`).catch(() => ({ data: [] })),
        ]);
        if (userRes?.data) setUser(userRes.data);

        const list = cardsRes.data;
        setCards(list);
        const active = list.find(c => c.isActive) || list[0] || {
          id: "demo-card", bankName: "ParaÜstü Sanal Kart", maskedNumber: "**** 1234", isActive: true,
        };
        setActiveCard(active);
      } catch {
        setActiveCard({ id: "demo-card", bankName: "Simülasyon Kartı", maskedNumber: "**** 9999" });
      }
    };
    load();
  }, [navigate]);

  const handlePay = async () => {
    const userId = localStorage.getItem("userId");

    if (pin.length < 6) {
      setPinError("Lütfen 6 haneli şifrenizi (PIN) giriniz.");
      return;
    }
    setPinError("");

    if (cvv.length < 3) {
      setCvvError("Geçerli bir CVV giriniz.");
      return;
    }
    setCvvError("");

    clearInterval(timerRef.current);
    setStatus("processing");

    const { roundup, total } = getRoundup(amount, user?.roundingPreference);
    try {
      await axiosInstance.post("/transactions/simulate", {
        userId: userId,
        cardId: activeCard?.id === "demo-card" ? null : activeCard?.id,
        merchantName: merchant,
        amountSpent: amount,
        amountRounded: total,
        roundupAmount: roundup,
      });
      setStatus("success");
    } catch (err) {
      console.error("Simulation error:", err);
      alert("Ödeme sırasında bir hata oluştu.");
      setStatus("idle");
    }
  };

  const handleReject = () => {
    clearInterval(timerRef.current);
    setStatus("rejected");
  };

  const handleReturnToStore = (isSuccess) => {
    const status = isSuccess ? "success" : "error";
    window.location.href = `/simulation/sonuc.html?status=${status}&amount=${amount}&merchant=${encodeURIComponent(merchant)}`;
  };

  if (!activeCard) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.forest }}>
        Yükleniyor...
      </div>
    );
  }

  const { roundup, total } = getRoundup(amount, user.roundingPreference);

  // Başarılı ödeme ekranı
  if (status === "success") {
    return (
      <div style={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: C.green + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ color: C.forest, marginTop: 0, marginBottom: 12 }}>Ödeme Başarılı!</h2>
        <p style={{ color: C.forest + "80", textAlign: "center", marginBottom: 8 }}>
          {merchant} ödemesi tamamlandı.
        </p>
        <p style={{ color: C.green, fontWeight: 600, fontSize: 18, marginBottom: 32 }}>
          {fmt(roundup)} ₺ kumbaranıza aktarıldı.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => handleReturnToStore(true)} style={{
            padding: "14px 20px", backgroundColor: "transparent", color: C.forest,
            border: `1.5px solid ${C.forest}40`, borderRadius: 12, fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Mağazaya Geri Dön
          </button>
          <button onClick={() => navigate("/")} style={{
            padding: "14px 24px", backgroundColor: C.forest, color: "#fff",
            border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(1,38,25,0.15)",
          }}>
            İşlemlerime Git
          </button>
        </div>
      </div>
    );
  }

  // Reddedildi / süre doldu ekranı
  if (status === "rejected") {
    return (
      <div style={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 style={{ color: C.forest, marginTop: 0, marginBottom: 12 }}>Ödeme Reddedildi</h2>
        <p style={{ color: C.forest + "70", textAlign: "center", marginBottom: 32 }}>
          {countdown === 0 ? "İşlem süresi doldu." : "Ödeme işlemi iptal edildi."}
        </p>
        <button onClick={() => handleReturnToStore(false)} style={{
          padding: "14px 30px", backgroundColor: C.forest, color: "#fff",
          border: "none", borderRadius: 12, fontWeight: 600, fontSize: 15,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Mağazaya Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh", padding: "2rem 1rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="/logo.png" alt="ParaÜstü" style={{ width: 48, height: 48, objectFit: "contain", marginBottom: 8 }} />
          <p style={{ fontSize: 20, fontWeight: 800, color: C.forest, margin: "0 0 4px" }}>ParaÜstü</p>
          <p style={{ fontSize: 12, color: C.green, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>Güvenli Ödeme Geçidi</p>
        </div>

        <div style={{
          textAlign: "center", marginBottom: "1rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `3px solid ${countdown <= 10 ? "#DC2626" : C.sage}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700,
            color: countdown <= 10 ? "#DC2626" : C.forest,
          }}>
            {countdown}
          </div>
          <span style={{ fontSize: 13, color: C.forest + "70" }}>saniye içinde yanıt ver</span>
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

          <div style={{ height: 1, backgroundColor: C.sage + "40", margin: "0 0 20px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>Toplam Çekilecek</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: C.forest }}>{fmt(total)} ₺</span>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: 12, color: C.forest + "60", margin: "0 0 8px" }}>Ödeme Yöntemi</p>
            <div style={{ padding: "12px", borderRadius: 12, border: `1px solid ${C.sage}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 26, backgroundColor: C.forest, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="3" stroke={C.sage} strokeWidth="1.6" />
                  <path d="M2 10h20" stroke={C.sage} strokeWidth="1.6" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: C.forest }}>{activeCard.bankName}</p>
                <p style={{ fontSize: 12, color: C.forest + "60", margin: 0 }}>{activeCard.maskedNumber}</p>
              </div>
            </div>
          </div>

          {/* PIN Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "60", display: "block", marginBottom: 5 }}>PIN (6 Haneli Şifre)</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder="••••••"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "0.75rem",
                border: `1.5px solid ${pinError ? "#DC2626" : C.sage}`,
                borderRadius: 12, fontSize: 18, color: C.forest,
                outline: "none", fontFamily: "inherit",
                backgroundColor: "#fff",
                letterSpacing: "0.4em",
                textAlign: "center"
              }}
            />
            {pinError && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 4 }}>{pinError}</p>}
          </div>

          {/* CVV Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "60", display: "block", marginBottom: 5 }}>Güvenlik Kodu (CVV)</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder="•••"
              maxLength={4}
              value={cvv}
              onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "0.75rem",
                border: `1.5px solid ${cvvError ? "#DC2626" : C.sage}`,
                borderRadius: 12, fontSize: 18, color: C.forest,
                outline: "none", fontFamily: "inherit",
                backgroundColor: "#fff",
                letterSpacing: "0.4em",
                textAlign: "center"
              }}
            />
            {cvvError && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 4 }}>{cvvError}</p>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleReject}
              disabled={status === "processing"}
              style={{
                flex: 1, padding: "14px",
                backgroundColor: "transparent",
                color: "#DC2626",
                border: "1.5px solid #DC262640",
                borderRadius: 16, fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              İptal
            </button>
            <button
              onClick={handlePay}
              disabled={status === "processing"}
              style={{
                flex: 2, padding: "14px",
                backgroundColor: status === "processing" ? C.sage : C.green,
                color: "#fff", border: "none",
                borderRadius: 16, fontSize: 15, fontWeight: 700,
                cursor: status === "processing" ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 12px rgba(78,166,100,0.2)",
              }}
            >
              {status === "processing" ? "Onaylanıyor..." : "Ödemeyi Onayla"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.forest + "40", marginTop: 14, marginBottom: 0 }}>
            İşlem ParaÜstü güvencesiyle 256-bit SSL ile korunmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}