import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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

function calcPortfolio(stocks) {
  let totalValue = 0, totalCost = 0;
  stocks.forEach(s => {
    // Note: price is mocked for now as we don't have price service integrated
    const currentPrice = s.price || s.averageCost * 1.1; 
    totalValue += s.quantity * currentPrice;
    totalCost  += s.quantity * s.averageCost;
  });
  const pnl    = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  return { totalValue, pnl, pnlPct };
}

// ── Components ──────────────────────────────────────────────


function KumbaramTab({ pool, transactions }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bakiye kartı */}
      <div style={{
        backgroundColor: C.forest,
        borderRadius: 16,
        padding: "1.5rem",
        textAlign: "center",
      }}>
        <p style={{ color: C.mint, fontSize: 13, margin: "0 0 6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Biriken Para Üstü
        </p>
        <p style={{ color: "#fff", fontSize: 40, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          {fmt(pool?.balance)} ₺
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginTop: 12,
          backgroundColor: C.green + "20",
          border: `1px solid ${C.green}40`,
          borderRadius: 99,
          padding: "4px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.green }} />
          <span style={{ color: C.green, fontSize: 12, fontWeight: 500 }}>
            Otomasyon Aktif: THYAO.IS
          </span>
        </div>
      </div>

      {/* Son işlemler */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.sage}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "0.85rem 1rem",
          borderBottom: `1px solid ${C.sage}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>Son İşlemler</span>
          <span style={{ fontSize: 12, color: C.green, fontWeight: 500, cursor: "pointer" }}>Tümünü gör →</span>
        </div>

        {transactions.length === 0 && <p style={{ padding: 20, textAlign: "center", color: "#888" }}>Henüz işlem yok.</p>}

        {transactions.map((tx, i) => (
          <div
            key={tx.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              borderBottom: i < transactions.length - 1 ? `1px solid ${C.sage}40` : "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: C.cream,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: 12, flexShrink: 0,
              fontSize: 12, fontWeight: 700, color: C.forest + "80",
            }}>
              {tx.merchantName?.slice(0, 2).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>{tx.merchantName}</p>
              <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>
                {new Date(tx.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, color: C.forest, margin: "0 0 2px" }}>{fmt(tx.amountSpent)} ₺</p>
              <p style={{ fontSize: 12, color: C.green, fontWeight: 600, margin: 0 }}>+{fmt(tx.roundupAmount)} ₺</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HisselerimTab({ portfolio }) {
  const { totalValue, pnl, pnlPct } = calcPortfolio(portfolio);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Portföy özeti */}
      <div style={{
        backgroundColor: C.forest,
        borderRadius: 16,
        padding: "1.5rem",
      }}>
        <p style={{ color: C.mint, fontSize: 13, margin: "0 0 6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Toplam Portföy
        </p>
        <p style={{ color: "#fff", fontSize: 36, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          {fmt(totalValue)} ₺
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            backgroundColor: pnl >= 0 ? C.green + "25" : "#DC262625",
            color: pnl >= 0 ? C.green : "#DC2626",
            fontSize: 13, fontWeight: 600,
            padding: "3px 10px", borderRadius: 99,
          }}>
            {pnl >= 0 ? "+" : ""}{fmt(pnl)} ₺
          </span>
          <span style={{
            color: pnl >= 0 ? C.green : "#DC2626",
            fontSize: 13, fontWeight: 500,
          }}>
            ({pnl >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Hisse listesi */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.sage}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "0.85rem 1rem",
          borderBottom: `1px solid ${C.sage}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>Hisselerim</span>
        </div>

        {portfolio.length === 0 && <p style={{ padding: 20, textAlign: "center", color: "#888" }}>Henüz hisse yok.</p>}

        {portfolio.map((s, i) => {
          const currentPrice = s.price || s.averageCost * 1.1;
          const pnl = (currentPrice - s.averageCost) * s.quantity;
          const pct = ((currentPrice - s.averageCost) / s.averageCost) * 100;
          const pos = pnl >= 0;
          return (
            <div key={s.id} style={{
              display: "flex", alignItems: "center",
              padding: "0.85rem 1rem",
              borderBottom: i < portfolio.length - 1 ? `1px solid ${C.sage}40` : "none",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: C.forest,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: 12, flexShrink: 0,
                fontSize: 10, fontWeight: 700, color: C.mint,
                letterSpacing: "0.02em",
              }}>
                {s.stockSymbol?.split(".")[0].slice(0, 4)}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>{s.stockSymbol}</p>
                <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{s.quantity} adet · Ort. {fmt(s.averageCost)} ₺</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>{fmt(currentPrice)} ₺</p>
                <p style={{ fontSize: 12, color: pos ? C.green : "#DC2626", fontWeight: 600, margin: 0 }}>
                  {pos ? "+" : ""}{fmt(pnl)} ₺ ({pos ? "+" : ""}{pct.toFixed(1)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("kumbaras");
  const navigate = useNavigate();
  const [data, setData] = useState({
    pool: null,
    transactions: [],
    portfolio: [],
    cards: [],
    loading: true
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      console.warn("User ID not found, redirecting to login...");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [poolRes, txRes, portfolioRes, cardsRes] = await Promise.all([
          axiosInstance.get(`/roundup/balance?userId=${userId}`),
          axiosInstance.get(`/transactions?userId=${userId}`),
          axiosInstance.get(`/portfolio?userId=${userId}`),
          axiosInstance.get(`/cards?userId=${userId}`)
        ]);

        setData({
          pool: poolRes.data,
          transactions: txRes.data,
          portfolio: portfolioRes.data,
          cards: cardsRes.data,
          loading: false
        });
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setData(d => ({ ...d, loading: false }));
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return <div style={{ backgroundColor: C.cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Selamlama */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>
            Merhaba 👋
          </h1>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: 0 }}>
            {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>


        {/* Tab Switcher */}
        <div style={{
          display: "flex", gap: 6, marginBottom: "1.25rem",
          backgroundColor: C.forest, padding: 4, borderRadius: 10
        }}>
          <button
            onClick={() => setActiveTab("kumbaras")}
            style={{
              flex: 1, padding: "8px", borderRadius: 7, border: "none",
              backgroundColor: activeTab === "kumbaras" ? C.green : "transparent",
              color: activeTab === "kumbaras" ? "#fff" : C.mint,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Kumbaram
          </button>
          <button
            onClick={() => setActiveTab("hisselerim")}
            style={{
              flex: 1, padding: "8px", borderRadius: 7, border: "none",
              backgroundColor: activeTab === "hisselerim" ? C.green : "transparent",
              color: activeTab === "hisselerim" ? "#fff" : C.mint,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            Hisselerim
          </button>
        </div>

        {activeTab === "kumbaras" ? (
          <KumbaramTab pool={data.pool} transactions={data.transactions} />
        ) : (
          <HisselerimTab portfolio={data.portfolio} />
        )}
      </main>
    </div>
  );
}
