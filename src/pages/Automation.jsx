import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const MOCK_STOCKS = [
  { symbol: "THYAO.IS", name: "Türk Hava Yolları", price: 318.40, sector: "Ulaşım" },
  { symbol: "BIMAS.IS", name: "BİM Birleşik Mağazalar", price: 398.20, sector: "Perakende" },
  { symbol: "AKBNK.IS", name: "Akbank", price: 61.30, sector: "Bankacılık" },
  { symbol: "GARAN.IS", name: "Garanti Bankası", price: 112.80, sector: "Bankacılık" },
  { symbol: "EREGL.IS", name: "Ereğli Demir Çelik", price: 54.60, sector: "Sanayi" },
  { symbol: "KCHOL.IS", name: "Koç Holding", price: 187.30, sector: "Holding" },
  { symbol: "SAHOL.IS", name: "Sabancı Holding", price: 98.50, sector: "Holding" },
  { symbol: "SISE.IS", name: "Şişecam", price: 43.20, sector: "Sanayi" },
  { symbol: "TCELL.IS", name: "Turkcell", price: 89.40, sector: "Teknoloji" },
  { symbol: "TOASO.IS", name: "Tofaş Otomobil", price: 234.60, sector: "Otomotiv" },
  { symbol: "FROTO.IS", name: "Ford Otosan", price: 1240.00, sector: "Otomotiv" },
  { symbol: "ASELS.IS", name: "Aselsan", price: 76.10, sector: "Savunma" },
  { symbol: "PGSUS.IS", name: "Pegasus Hava Taşımacılığı", price: 892.50, sector: "Ulaşım" },
  { symbol: "KOZAL.IS", name: "Koza Altın İşletmeleri", price: 543.20, sector: "Maden" },
  { symbol: "EKGYO.IS", name: "Emlak Konut GYO", price: 18.90, sector: "GYO" },
];

// MOCK_ACTIVE_RULE silindi, backend'den gelecek

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function ActiveRuleCard({ rule, stocks, onToggle, onDelete }) {
  const stock = stocks.find(s => s.symbol === rule.symbol);
  return (
    <div style={{
      backgroundColor: rule.isActive ? C.forest : "#fff",
      borderRadius: 14,
      border: `1.5px solid ${rule.isActive ? C.green + "60" : C.sage}`,
      padding: "1rem",
      marginBottom: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 11, color: rule.isActive ? C.mint : C.forest + "55", margin: "0 0 4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Aktif Kural
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              backgroundColor: rule.isActive ? C.green + "25" : C.forest + "10",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700,
              color: rule.isActive ? C.green : C.forest + "70",
            }}>
              {rule.symbol.split(".")[0].slice(0, 4)}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: rule.isActive ? "#fff" : C.forest, margin: 0 }}>
                {rule.symbol}
              </p>
              <p style={{ fontSize: 12, color: rule.isActive ? C.mint : C.forest + "55", margin: 0 }}>
                {stock?.name}
              </p>
            </div>
          </div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          backgroundColor: rule.isActive ? C.green + "20" : C.sage + "40",
          border: `1px solid ${rule.isActive ? C.green + "50" : C.sage}`,
          borderRadius: 99, padding: "4px 10px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: rule.isActive ? C.green : C.sage }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: rule.isActive ? C.green : C.forest + "60" }}>
            {rule.isActive ? "Aktif" : "Pasif"}
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: rule.isActive ? C.green + "15" : C.cream,
        borderRadius: 8, padding: "0.6rem 0.8rem", marginBottom: "0.75rem",
      }}>
        <p style={{ fontSize: 13, color: rule.isActive ? C.mint : C.forest + "70", margin: 0 }}>
          Biriken para üstü <strong style={{ color: rule.isActive ? "#fff" : C.forest }}>{rule.threshold} TL</strong>'ye ulaşınca otomatik satın al
        </p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onToggle} style={{
          flex: 1, padding: "0.55rem",
          borderRadius: 8, border: `1.5px solid ${rule.isActive ? C.sage + "60" : C.green}`,
          backgroundColor: "transparent",
          color: rule.isActive ? C.sage : C.green,
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>
          {rule.isActive ? "Duraklat" : "Aktif Et"}
        </button>
        <button onClick={onDelete} style={{
          padding: "0.55rem 0.75rem",
          borderRadius: 8, border: `1px solid #DC262630`,
          backgroundColor: "transparent",
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function BottomSheet({ stock, existingRule, onSave, onClose }) {
  const [threshold, setThreshold] = useState(existingRule ? String(existingRule.threshold) : "100");
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (existingRule && existingRule.symbol !== stock.symbol) {
      setShowConfirm(true);
      return;
    }
    doSave();
  };

  const doSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    onSave({ symbol: stock.symbol, threshold: Number(threshold) });
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(1,38,25,0.5)",
          zIndex: 100,
        }}
      />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderRadius: "16px 16px 0 0",
        padding: "1.5rem",
        zIndex: 101,
        fontFamily: "inherit",
        maxWidth: 480, margin: "0 auto",
      }}>
        <div style={{ width: 36, height: 4, backgroundColor: C.sage, borderRadius: 99, margin: "0 auto 1.25rem" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            backgroundColor: C.forest,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: C.mint, flexShrink: 0,
          }}>
            {stock.symbol.split(".")[0].slice(0, 4)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>{stock.symbol}</p>
            <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{stock.name}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>{fmt(stock.price)} ₺</p>
            <p style={{ fontSize: 11, color: C.forest + "45", margin: 0 }}>{stock.sector}</p>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 6 }}>
            Eşik tutarı (TL)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              min="1"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "0.65rem 2.5rem 0.65rem 0.9rem",
                border: `1.5px solid ${C.sage}`,
                borderRadius: 8, fontSize: 15, fontWeight: 600,
                color: C.forest, outline: "none", fontFamily: "inherit",
                backgroundColor: "#fff",
              }}
            />
            <span style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13, color: C.forest + "50", fontWeight: 500,
            }}>₺</span>
          </div>
          <p style={{ fontSize: 12, color: C.forest + "55", margin: "6px 0 0", lineHeight: 1.5 }}>
            Biriken para üstü bu tutara ulaştığında 1 adet {stock.symbol} otomatik alınır.
          </p>
        </div>

        {showConfirm ? (
          <div style={{
            backgroundColor: "#FEF9EC",
            border: "1px solid #F59E0B",
            borderRadius: 10, padding: "0.85rem", marginBottom: "1rem",
          }}>
            <p style={{ fontSize: 13, color: "#92400E", fontWeight: 600, margin: "0 0 4px" }}>
              Mevcut kural silinecek
            </p>
            <p style={{ fontSize: 12, color: "#92400E", margin: "0 0 10px", lineHeight: 1.5 }}>
              <strong>{existingRule.symbol}</strong> için olan otomasyon kuralı silinecek ve yerine <strong>{stock.symbol}</strong> kuralı oluşturulacak. Devam et?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: "0.55rem", borderRadius: 8,
                border: `1px solid #F59E0B`, backgroundColor: "transparent",
                color: "#92400E", fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}>İptal</button>
              <button onClick={doSave} style={{
                flex: 1, padding: "0.55rem", borderRadius: 8,
                border: "none", backgroundColor: "#D97706",
                color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Evet, devam et</button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving || !threshold || Number(threshold) <= 0}
            style={{
              width: "100%", padding: "0.75rem",
              backgroundColor: saving || !threshold ? C.sage : C.green,
              color: "#fff", border: "none", borderRadius: 9,
              fontSize: 15, fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {saving ? "Kaydediliyor..." : "Otomasyonu Kaydet"}
          </button>
        )}
      </div>
    </>
  );
}

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Automation() {
  const { token, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [activeRule, setActiveRule] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) { logout(); throw new Error("Oturum hatası"); }
        return res.json();
      })
      .then(data => {
        if (data.automation) {
          setActiveRule({
            symbol: data.automation.symbol,
            threshold: data.automation.threshold,
            isActive: data.automation.active
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, logout]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return MOCK_STOCKS;
    const q = query.toLowerCase();
    return MOCK_STOCKS.filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSave = ({ symbol, threshold }) => {
    setActiveRule({ symbol, threshold, isActive: true });
    setSelectedStock(null);
    showToast("Otomasyon kuralı kaydedildi");
  };

  const handleToggle = () => {
    setActiveRule(r => ({ ...r, isActive: !r.isActive }));
    showToast(activeRule.isActive ? "Otomasyon duraklatıldı" : "Otomasyon aktif edildi");
  };

  const handleDelete = () => {
    setActiveRule(null);
    showToast("Kural silindi");
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: C.cream, color: C.forest }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar title="Otomasyon" />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box", flex: 1 }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>Otomasyon</h1>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: 0 }}>
            Biriken para üstün eşiğe ulaşınca otomatik hisse al
          </p>
        </div>

        {activeRule && (
          <ActiveRuleCard
            rule={activeRule}
            stocks={MOCK_STOCKS}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          border: `1px solid ${C.sage}`,
          overflow: "hidden",
        }}>
          <div style={{ padding: "0.85rem 1rem", borderBottom: `1px solid ${C.sage}` }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, margin: "0 0 10px" }}>
              {activeRule ? "Kuralı değiştir" : "Hisse seç"}
            </p>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Sembol veya şirket adı ara..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "0.6rem 0.85rem",
                  border: `1.5px solid ${C.sage}`,
                  borderRadius: 8, fontSize: 14, color: C.forest,
                  outline: "none", fontFamily: "inherit", backgroundColor: "#fff",
                }}
              />
            </div>
          </div>

          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
                <p style={{ color: C.forest + "50", fontSize: 14, margin: 0 }}>Hisse bulunamadı</p>
              </div>
            ) : (
              filtered.map((stock, i) => {
                const isActive = activeRule?.symbol === stock.symbol;
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "0.75rem 1rem",
                      borderBottom: i < filtered.length - 1 ? `1px solid ${C.sage}40` : "none",
                      backgroundColor: isActive ? C.green + "06" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 9,
                      backgroundColor: isActive ? C.forest : C.cream,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginRight: 12, flexShrink: 0,
                      fontSize: 9, fontWeight: 700,
                      color: isActive ? C.mint : C.forest + "60",
                      letterSpacing: "0.02em",
                    }}>
                      {stock.symbol.split(".")[0].slice(0, 4)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.forest, margin: 0 }}>{stock.symbol}</p>
                        {isActive && (
                          <span style={{
                            fontSize: 9, fontWeight: 700,
                            backgroundColor: C.green + "20", color: C.green,
                            padding: "2px 6px", borderRadius: 99, letterSpacing: "0.04em",
                          }}>AKTİF</span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: C.forest + "55", margin: "2px 0 0" }}>{stock.name}</p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>
                        {fmt(stock.price)} ₺
                      </p>
                      <p style={{ fontSize: 11, color: C.forest + "45", margin: 0 }}>{stock.sector}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {selectedStock && (
        <BottomSheet
          stock={selectedStock}
          existingRule={activeRule}
          onSave={handleSave}
          onClose={() => setSelectedStock(null)}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: C.forest,
          color: "#fff", fontSize: 13, fontWeight: 500,
          padding: "0.6rem 1.2rem", borderRadius: 99,
          zIndex: 300, whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(1,38,25,0.25)",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
