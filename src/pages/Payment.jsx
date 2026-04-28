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

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const merchant = searchParams.get("merchant") || "Bilinmeyen Mağaza";
  const amount = parseFloat(searchParams.get("amount")) || 0;
  const callbackUrl = searchParams.get("callback") || decodeURIComponent(searchParams.get("callback") || "");

  // Roundup calculation (Nearest 10)
  const roundedAmount = Math.ceil(amount / 10) * 10;
  const roundup = roundedAmount - amount;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await axiosInstance.get(`/cards?userId=${userId}`);
        setCards(res.data);
        // Aktif kartı seçili yap
        const active = res.data.find(c => c.isActive) || res.data[0];
        if (active) setSelectedCard(active);
      } catch (err) {
        console.error("Card fetch error:", err);
      }
    };
    fetchCards();
  }, []);

  const handlePay = () => {
    if (!selectedCard) {
      alert("Lütfen bir kart seçin!");
      return;
    }

    // Checkout sayfasına yönlendir
    const params = new URLSearchParams({
      merchant,
      amount,
      cardId: selectedCard.id,
      callback: callbackUrl || window.location.href.split('?')[0]
    });

    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: C.forest, fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>ParaÜstü Ödeme</h1>
          <p style={{ color: C.forest + "80", fontSize: 13 }}>Kartınızı seçin ve ödemeyi onaylayın</p>
        </div>

        {/* Amount Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(1,38,25,0.08)",
          border: `1px solid ${C.sage}`,
          marginBottom: "1.5rem"
        }}>
          <div style={{ marginBottom: "1.5rem", borderBottom: `1px solid ${C.sage}40`, paddingBottom: "1.5rem" }}>
            <p style={{ fontSize: 13, color: C.forest + "60", marginBottom: 4 }}>Mağaza</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.forest }}>{merchant}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: C.forest + "70", fontSize: 15 }}>Harcama Tutarı</span>
            <span style={{ color: C.forest, fontWeight: 600, fontSize: 16 }}>{fmt(amount)} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.green, fontSize: 15, fontWeight: 600 }}>ParaÜstü (Yuvarlama)</span>
              <div style={{ backgroundColor: C.green + "15", color: C.green, fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>AKTİF</div>
            </div>
            <span style={{ color: C.green, fontWeight: 700, fontSize: 18 }}>+{fmt(roundup)} ₺</span>
          </div>

          <div style={{
            backgroundColor: C.forest,
            borderRadius: 12,
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ color: C.mint, fontSize: 14, fontWeight: 500 }}>Kartınızdan Çekilecek</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>{fmt(roundedAmount)} ₺</span>
          </div>
        </div>

        {/* Card Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, marginBottom: 12 }}>Ödeme Yöntemi</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                style={{
                  backgroundColor: selectedCard?.id === card.id ? C.forest : "#fff",
                  color: selectedCard?.id === card.id ? "#fff" : C.forest,
                  padding: "1rem",
                  borderRadius: 14,
                  border: `2px solid ${selectedCard?.id === card.id ? C.green : C.sage}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{card.bankName}</p>
                  <p style={{ fontSize: 11, opacity: 0.7, margin: 0 }}>{card.maskedNumber}</p>
                </div>
                {card.isActive && (
                  <div style={{
                    backgroundColor: C.green,
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 600
                  }}>
                    AKTİF
                  </div>
                )}
                {selectedCard?.id === card.id && (
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: C.green,
                    border: "2px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading || !selectedCard}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: selectedCard ? C.green : C.sage,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            cursor: selectedCard ? "pointer" : "not-allowed",
            boxShadow: selectedCard ? `0 4px 12px ${C.green}40` : "none",
            transition: "all 0.2s"
          }}
        >
          {loading ? "Yönlendiriliyor..." : "Ödemeyi Onayla"}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "transparent",
            color: C.forest + "60",
            border: "none",
            marginTop: 10,
            fontSize: 14,
            cursor: "pointer"
          }}
        >
          İptal Et
        </button>

      </div>
    </div>
  );
}
