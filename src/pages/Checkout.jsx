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

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

// iyzico benzeri ödeme geçidi teması
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const merchant = searchParams.get("merchant") || "Bilinmeyen Mağaza";
  const amount = parseFloat(searchParams.get("amount")) || 0;
  const cardId = searchParams.get("cardId");
  const callbackUrl = searchParams.get("callback") || "http://localhost:5173/pay?status=cancelled";

  const roundedAmount = Math.ceil(amount / 10) * 10;
  const roundup = roundedAmount - amount;

  useEffect(() => {
    const processPayment = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await axiosInstance.post("/transactions/simulate", {
          userId: userId,
          cardId: cardId,
          merchant: merchant,
          amount: amount
        });

        if (response.data && response.data.id) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage("Ödeme işlemi başarısız oldu.");
        }
      } catch (err) {
        console.error("Payment error:", err);
        setStatus("error");
        setErrorMessage(err.response?.data?.message || "Ödeme sırasında bir hata oluştu.");
      }
    };

    // 2 saniye simulate et (iyzico ekranı gibi)
    const timer = setTimeout(() => {
      processPayment();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    window.location.href = callbackUrl + "&status=cancelled";
  };

  // Yükleniyor ekranı
  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: C.forest,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }}>
        {/* iyzico benzeri animasyon */}
        <div style={{
          width: 80,
          height: 80,
          border: "4px solid " + C.mint,
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 24
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Ödeme İşleniyor</h2>
        <p style={{ color: C.mint, fontSize: 14 }}>Güvenli ödeme ağ geçidinde işleminiz işleniyor...</p>
        <p style={{ color: C.sage, fontSize: 12, marginTop: 8 }}>Lütfen bekleyin</p>
      </div>
    );
  }

  // Başarı ekranı
  if (status === "success") {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: C.forest,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        padding: 20
      }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          backgroundColor: C.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 48
        }}>
          ✓
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Ödeme Başarılı!</h2>
        <p style={{ color: C.mint, fontSize: 15, textAlign: "center", marginBottom: 24 }}>
          {merchant} için {fmt(amount)} ₺ ödemeniz alındı.
        </p>

        {/* İşlem özeti */}
        <div style={{
          backgroundColor: C.green + "20",
          border: "1px solid " + C.green + "40",
          borderRadius: 12,
          padding: "16px 24px",
          marginBottom: 24,
          width: "100%",
          maxWidth: 320
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: C.mint, fontSize: 13 }}>Harcama</span>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{fmt(amount)} ₺</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: C.mint, fontSize: 13 }}>ParaÜstü</span>
            <span style={{ color: C.green, fontSize: 14, fontWeight: 600 }}>+{fmt(roundup)} ₺</span>
          </div>
          <div style={{ borderTop: "1px solid " + C.green + "30", paddingTop: 8, marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.sage, fontSize: 12 }}>Kartınızdan Çekilen</span>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{fmt(roundedAmount)} ₺</span>
            </div>
          </div>
        </div>

        <p style={{ color: C.sage, fontSize: 12 }}>3 saniye içinde e-ticaret sitesine yönlendirileceksiniz...</p>

        {/* E-ticarete yönlendirme */}
        <script>{`
          setTimeout(() => {
            window.location.href = "${callbackUrl}&status=success";
          }, 3000);
        `}</script>
      </div>
    );
  }

  // Hata ekranı
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: C.forest,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      padding: 20
    }}>
      <div style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        backgroundColor: "#DC2626",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        fontSize: 48
      }}>
        ✕
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Ödeme Başarısız</h2>
      <p style={{ color: C.mint, fontSize: 14, textAlign: "center", marginBottom: 16 }}>
        {errorMessage || "Kart bilgileriniz doğrulanamadı."}
      </p>
      <p style={{ color: C.sage, fontSize: 13, textAlign: "center", marginBottom: 32 }}>
        Lütfen tekrar deneyin veya farklı bir kart kullanın.
      </p>

      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: C.green,
          color: "#fff",
          border: "none",
          padding: "14px 32px",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Geri Dön
      </button>
    </div>
  );
}
