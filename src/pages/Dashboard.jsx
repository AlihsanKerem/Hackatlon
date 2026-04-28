import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

// MOCK_USER kaldırıldı, artık backend'den gerçek kullanıcı verisi çekilecek

// Tüm MOCK verileri silindi, hepsi backend'den (DashboardData) gelecek

// ── Helpers ────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function calcPortfolio(stocks) {
  let totalValue = 0, totalCost = 0;
  stocks.forEach(s => {
    totalValue += s.qty * s.price;
    totalCost  += s.qty * s.avgCost;
  });
  const pnl    = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  return { totalValue, pnl, pnlPct };
}

// Kumbaram Tab
function KumbaramTab({ data }) {
  const { balance, automation, transactions } = data;
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
          {fmt(balance?.roundupBalance || 0)} ₺
        </p>
        {automation?.active && (
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
              {automation.threshold} TL → {automation.symbol}
            </span>
          </div>
        )}
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

        {transactions.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", color: C.forest + "70", fontSize: 13 }}>
            Henüz işleminiz bulunmamaktadır.
          </div>
        ) : transactions.map((tx, i) => (
          <div
            key={tx.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              borderBottom: i < transactions.length - 1 ? `1px solid ${C.sage}40` : "none",
            }}
          >
            {/* Merchant icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: C.cream,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: 12, flexShrink: 0,
              fontSize: 12, fontWeight: 700, color: C.forest + "80",
            }}>
              {tx.merchant.slice(0, 2).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>{tx.merchant}</p>
              <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{tx.date}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, color: C.forest, margin: "0 0 2px" }}>{fmt(tx.amount)} ₺</p>
              <p style={{ fontSize: 12, color: C.green, fontWeight: 600, margin: 0 }}>+{fmt(tx.roundup)} ₺</p>
            </div>
          </div>
        ))}
      </div>

      {/* Test Backend Connection Button */}
      <button
        onClick={async () => {
          try {
            const res = await fetch('/api/islem/yuvarla?harcama=42.30&tip=5');
            const data = await res.json();
            alert("Backend'den başarıyla yanıt geldi!\nHarcanan: " + data.harcamaTutari + "\nBiriken Para Üstü: " + data.birikenPara);
            console.log("Backend Yanıtı:", data);
          } catch (error) {
            alert("Backend bağlantı hatası! Lütfen konsolu kontrol edin.");
            console.error("Fetch hatası:", error);
          }
        }}
        style={{
          padding: "10px", backgroundColor: C.forest, color: C.cream, 
          border: "none", borderRadius: 8, cursor: "pointer", 
          fontWeight: "bold", marginTop: 10
        }}
      >
        Backend Bağlantısını Test Et (Örnek İstek)
      </button>

    </div>
  );
}

// Hisselerim Tab
function HisselerimTab({ data }) {
  const { portfolio } = data;
  const { totalValue, pnl, pnlPct } = calcPortfolio(portfolio);
  const [buyModal, setBuyModal]   = useState(false);
  const [sellModal, setSellModal] = useState(null);
  const [buyForm, setBuyForm]     = useState({ symbol: "", qty: "", source: "roundup" });

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
          <button
            onClick={() => setBuyModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px",
              backgroundColor: C.green,
              color: "#fff",
              border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            Al
          </button>
        </div>

        {portfolio.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", color: C.forest + "70", fontSize: 13 }}>
            Portföyünüz henüz boş. "Al" butonu ile hisse alabilirsiniz.
          </div>
        ) : portfolio.map((s, i) => {
          const pnl = (s.price - s.avgCost) * s.qty;
          const pct = ((s.price - s.avgCost) / s.avgCost) * 100;
          const pos = pnl >= 0;
          return (
            <div key={s.symbol} style={{
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
                {s.symbol.split(".")[0].slice(0, 4)}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>{s.symbol}</p>
                <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{s.qty} adet · Ort. {fmt(s.avgCost)} ₺</p>
              </div>

              <div style={{ textAlign: "right", marginRight: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>{fmt(s.price)} ₺</p>
                <p style={{ fontSize: 12, color: pos ? C.green : "#DC2626", fontWeight: 600, margin: 0 }}>
                  {pos ? "+" : ""}{fmt(pnl)} ₺ ({pos ? "+" : ""}{pct.toFixed(1)}%)
                </p>
              </div>

              <button
                onClick={() => setSellModal(s)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "transparent",
                  border: `1px solid ${C.sage}`,
                  borderRadius: 7,
                  fontSize: 12, color: C.forest + "80",
                  cursor: "pointer", fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                Sat
              </button>
            </div>
          );
        })}
      </div>

      {/* Al Modal */}
      {buyModal && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(1,38,25,0.5)",
          display: "flex", alignItems: "flex-end",
          zIndex: 100,
        }} onClick={() => setBuyModal(false)}>
          <div
            style={{
              width: "100%", backgroundColor: "#fff",
              borderRadius: "16px 16px 0 0",
              padding: "1.5rem",
              fontFamily: "inherit",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: 0 }}>Hisse Al</h3>
              <button onClick={() => setBuyModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Sembol</label>
                <input
                  type="text"
                  placeholder="THYAO.IS"
                  value={buyForm.symbol}
                  onChange={e => setBuyForm(f => ({ ...f, symbol: e.target.value }))}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "0.6rem 0.85rem",
                    border: `1.5px solid ${C.sage}`,
                    borderRadius: 8, fontSize: 14, color: C.forest,
                    outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Adet</label>
                <input
                  type="number"
                  placeholder="1"
                  value={buyForm.qty}
                  onChange={e => setBuyForm(f => ({ ...f, qty: e.target.value }))}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "0.6rem 0.85rem",
                    border: `1.5px solid ${C.sage}`,
                    borderRadius: 8, fontSize: 14, color: C.forest,
                    outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Kaynak</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { key: "roundup", label: "Roundup Bakiyem" },
                    { key: "direct",  label: "Direkt Öde" },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setBuyForm(f => ({ ...f, source: opt.key }))}
                      style={{
                        flex: 1, padding: "0.55rem",
                        borderRadius: 8,
                        border: `1.5px solid ${buyForm.source === opt.key ? C.green : C.sage}`,
                        backgroundColor: buyForm.source === opt.key ? C.green + "12" : "transparent",
                        color: buyForm.source === opt.key ? C.green : C.forest + "70",
                        fontSize: 12, fontWeight: buyForm.source === opt.key ? 600 : 400,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button style={{
                width: "100%", padding: "0.75rem",
                backgroundColor: C.green, color: "#fff",
                border: "none", borderRadius: 9,
                fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                marginTop: 4,
              }}>
                Al
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sat Modal */}
      {sellModal && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(1,38,25,0.5)",
          display: "flex", alignItems: "flex-end",
          zIndex: 100,
        }} onClick={() => setSellModal(null)}>
          <div
            style={{
              width: "100%", backgroundColor: "#fff",
              borderRadius: "16px 16px 0 0",
              padding: "1.5rem",
              fontFamily: "inherit",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>Hisse Sat</h3>
                <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{sellModal.symbol} · {sellModal.qty} adet mevcut</p>
              </div>
              <button onClick={() => setSellModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Satmak istediğin adet</label>
                <input
                  type="number"
                  placeholder={`Maks. ${sellModal.qty}`}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "0.6rem 0.85rem",
                    border: `1.5px solid ${C.sage}`,
                    borderRadius: 8, fontSize: 14, color: C.forest,
                    outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <button style={{
                width: "100%", padding: "0.75rem",
                backgroundColor: "#DC2626", color: "#fff",
                border: "none", borderRadius: 9,
                fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
                Sat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function Dashboard() {
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("kumbaras");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) { logout(); throw new Error("Oturum hatası"); }
        return res.json();
      })
      .then(data => setDashboardData(data))
      .catch(console.error);
    }
  }, [token, logout]);

  if (!dashboardData) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: C.cream, color: C.forest }}>Verileriniz yükleniyor...</div>;
  }

  const { user } = dashboardData;

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Selamlama */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>
            Merhaba, {user.fullName ? user.fullName.split(" ")[0] : "İsimsiz"} 👋
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

        {activeTab === "kumbaras" ? <KumbaramTab data={dashboardData} /> : <HisselerimTab data={dashboardData} />}
      </main>
    </div>
  );
}
