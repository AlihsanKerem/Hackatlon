import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const MOCK_USER = { fullName: "Ayşe Kaya", email: "ayse@example.com", phone: "+90 532 123 45 67" };

const MOCK_ROUNDING = {
  under10:    "5",
  under100:   "10",
  under1000:  "50",
  under10000: "100",
};

const MOCK_RULE = { symbol: "THYAO.IS", threshold: 100, isActive: true };

const STOCKS = [
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

const fmtPrice = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const ROUNDING_LABELS = {
  under10:    "10 TL altı işlemlerde geçerli",
  under100:   "10–100 TL arası işlemlerde geçerli",
  under1000:  "100–1.000 TL arası işlemlerde geçerli",
  under10000: "1.000 TL ve üzeri işlemlerde geçerli",
};

const TIERS = [
  {
    id: "under10",
    label: "10 TL altı işlemlerde geçerli",
    options: [
      { key: "1",  label: "1 TL",  ex: "3,40 → 4 TL",   roundup: "0,60 TL" },
      { key: "5",  label: "5 TL",  ex: "3,40 → 5 TL",   roundup: "1,60 TL" },
      { key: "10", label: "10 TL", ex: "3,40 → 10 TL",  roundup: "6,60 TL" },
    ],
  },
  {
    id: "under100",
    label: "10–100 TL arası işlemlerde geçerli",
    options: [
      { key: "1",   label: "1 TL",   ex: "43,20 → 44 TL",  roundup: "0,80 TL" },
      { key: "5",   label: "5 TL",   ex: "43,20 → 45 TL",  roundup: "1,80 TL" },
      { key: "10",  label: "10 TL",  ex: "43,20 → 50 TL",  roundup: "6,80 TL" },
      { key: "50",  label: "50 TL",  ex: "43,20 → 50 TL",  roundup: "6,80 TL" },
      { key: "100", label: "100 TL", ex: "43,20 → 100 TL", roundup: "56,80 TL" },
    ],
  },
  {
    id: "under1000",
    label: "100–1.000 TL arası işlemlerde geçerli",
    options: [
      { key: "1",    label: "1 TL",     ex: "320 → 321 TL",   roundup: "1 TL" },
      { key: "10",   label: "10 TL",    ex: "320 → 330 TL",   roundup: "10 TL" },
      { key: "50",   label: "50 TL",    ex: "320 → 350 TL",   roundup: "30 TL" },
      { key: "100",  label: "100 TL",   ex: "320 → 400 TL",   roundup: "80 TL" },
      { key: "1000", label: "1.000 TL", ex: "320 → 1.000 TL", roundup: "680 TL" },
    ],
  },
  {
    id: "under10000",
    label: "1.000 TL ve üzeri işlemlerde geçerli",
    options: [
      { key: "1",     label: "1 TL",      ex: "1.240 → 1.241 TL",  roundup: "1 TL" },
      { key: "10",    label: "10 TL",     ex: "1.240 → 1.250 TL",  roundup: "10 TL" },
      { key: "100",   label: "100 TL",    ex: "1.240 → 1.300 TL",  roundup: "60 TL" },
      { key: "1000",  label: "1.000 TL",  ex: "1.240 → 2.000 TL",  roundup: "760 TL" },
      { key: "10000", label: "10.000 TL", ex: "1.240 → 10.000 TL", roundup: "8.760 TL" },
    ],
  },
];

function SectionCard({ children, style }) {
  return (
    <div style={{
      backgroundColor: "#fff", borderRadius: 14,
      border: `1px solid ${C.sage}`, overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{
      padding: "0.85rem 1rem",
      borderBottom: `1px solid ${C.sage}`,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        backgroundColor: C.forest,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>{title}</span>
    </div>
  );
}

function Row({ label, value, onClick, danger, last }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center",
        padding: "0.8rem 1rem",
        borderBottom: last ? "none" : `1px solid ${C.sage}40`,
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.15s",
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.backgroundColor = C.cream; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, color: danger ? "#DC2626" : C.forest, margin: 0, fontWeight: danger ? 600 : 400 }}>{label}</p>
        {value && <p style={{ fontSize: 12, color: C.forest + "55", margin: "2px 0 0" }}>{value}</p>}
      </div>
      {onClick && !danger && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function RoundingModal({ prefs, onSave, onClose }) {
  const [selections, setSelections] = useState({ ...prefs });
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);

  const select = (tierId, key) => {
    setSelections(s => ({ ...s, [tierId]: key }));
    setExpanded(null);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    onSave(selections);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(1,38,25,0.5)", zIndex: 200 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", borderRadius: "16px 16px 0 0",
        padding: "1.5rem", zIndex: 201, fontFamily: "inherit",
        maxWidth: 480, margin: "0 auto", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, backgroundColor: C.sage, borderRadius: 99, margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: 0 }}>Yuvarlama Tercihlerini Düzenle</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
          {TIERS.map(tier => {
            const chosen = selections[tier.id];
            const isOpen = expanded === tier.id;
            return (
              <div key={tier.id} style={{
                border: `1.5px solid ${isOpen ? C.green : chosen ? C.mint : C.sage}`,
                borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s",
              }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : tier.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 10, padding: "0.75rem 1rem",
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    backgroundColor: chosen ? C.green : C.sage + "50",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {chosen
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <span style={{ fontSize: 10, color: C.forest + "50" }}>—</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.forest, margin: 0 }}>{tier.label}</p>
                    {chosen && <p style={{ fontSize: 11, color: C.green, margin: "1px 0 0" }}>En yakın {chosen} TL</p>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6" stroke={C.forest + "60"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 0.75rem 0.75rem", display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {tier.options.map(opt => {
                      const sel = chosen === opt.key;
                      return (
                        <button key={opt.key} onClick={() => select(tier.id, opt.key)} style={{
                          flex: "1 1 calc(33% - 7px)", minWidth: 80,
                          padding: "0.55rem 0.4rem", borderRadius: 9,
                          border: `1.5px solid ${sel ? C.green : C.sage}`,
                          backgroundColor: sel ? C.green + "12" : "transparent",
                          cursor: "pointer", textAlign: "center", fontFamily: "inherit",
                          transition: "all 0.15s",
                        }}>
                          <p style={{ color: sel ? C.green : C.forest, fontWeight: 700, fontSize: 13, margin: "0 0 1px" }}>{opt.label}</p>
                          <p style={{ color: C.forest + "55", fontSize: 10, margin: "0 0 1px" }}>{opt.ex}</p>
                          <p style={{ color: sel ? C.green : C.mint, fontSize: 10, fontWeight: 600, margin: 0 }}>+{opt.roundup}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: "100%", padding: "0.75rem", borderRadius: 9, border: "none",
          backgroundColor: saving ? C.sage : C.green, color: "#fff",
          fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </>
  );
}

function PinModal({ onClose }) {
  const [step, setStep] = useState("current");
  const [pins, setPins] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setPin = (k, v) => setPins(p => ({ ...p, [k]: v }));

  const handleNext = async () => {
    setError("");
    if (step === "current") {
      if (pins.current.length < 6) { setError("6 haneli PIN girin."); return; }
      if (pins.current === "000000") { setError("Mevcut PIN hatalı."); return; }
      setStep("new");
    } else if (step === "new") {
      if (pins.next.length < 6) { setError("6 haneli PIN girin."); return; }
      setStep("confirm");
    } else if (step === "confirm") {
      if (pins.confirm !== pins.next) { setError("PIN kodları eşleşmiyor."); return; }
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      setLoading(false);
      setStep("done");
    }
  };

  if (step === "done") {
    return (
      <>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(1,38,25,0.5)", zIndex: 200 }} />
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          backgroundColor: "#fff", borderRadius: "16px 16px 0 0",
          padding: "2rem 1.5rem", zIndex: 201, textAlign: "center",
          maxWidth: 480, margin: "0 auto", fontFamily: "inherit",
        }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: C.green + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: "0 0 6px" }}>PIN güncellendi</p>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: "0 0 1.5rem" }}>Yeni PIN kodunla giriş yapabilirsin.</p>
          <button onClick={onClose} style={{ width: "100%", padding: "0.75rem", borderRadius: 9, border: "none", backgroundColor: C.green, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Tamam</button>
        </div>
      </>
    );
  }

  const key = step === "current" ? "current" : step === "new" ? "next" : "confirm";
  const digits = (pins[key] || "").split("").concat(Array(6).fill("")).slice(0, 6);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(1,38,25,0.5)", zIndex: 200 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", borderRadius: "16px 16px 0 0",
        padding: "1.5rem", zIndex: 201, fontFamily: "inherit",
        maxWidth: 480, margin: "0 auto",
      }}>
        <div style={{ width: 36, height: 4, backgroundColor: C.sage, borderRadius: 99, margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>PIN Değiştir</h3>
            <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{step === "current" ? "Mevcut PIN" : step === "new" ? "Yeni PIN" : "PIN Tekrar"}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20 }}>✕</button>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.65rem 0.9rem", color: "#991B1B", fontSize: 13, marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: "1.5rem" }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 44, height: 52, borderRadius: 9,
              border: `1.5px solid ${d ? C.green : C.sage}`,
              backgroundColor: d ? C.green + "10" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: d ? 22 : 14, color: d ? C.green : C.sage,
              transition: "all 0.15s",
            }}>
              {d ? "●" : ""}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1rem" }}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
            <button key={i}
              onClick={() => {
                if (k === "") return;
                const cur = pins[key] || "";
                if (k === "⌫") { setPin(key, cur.slice(0, -1)); return; }
                if (cur.length < 6) setPin(key, cur + String(k));
              }}
              style={{
                height: 52, borderRadius: 10,
                border: k === "" ? "none" : `1px solid ${C.sage}`,
                backgroundColor: k === "" ? "transparent" : "#fff",
                color: k === "⌫" ? "#DC2626" : C.forest,
                fontSize: k === "⌫" ? 18 : 20,
                fontWeight: 500, cursor: k === "" ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {k}
            </button>
          ))}
        </div>

        <button onClick={handleNext} disabled={loading || (pins[key] || "").length < 6} style={{
          width: "100%", padding: "0.75rem", borderRadius: 9, border: "none",
          backgroundColor: (pins[key] || "").length < 6 ? C.sage : C.green,
          color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: (pins[key] || "").length < 6 ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          {loading ? "İşleniyor..." : step === "confirm" ? "Kaydet" : "Devam"}
        </button>
      </div>
    </>
  );
}

function AutomationModal({ currentRule, onSave, onDelete, onClose }) {
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = query.trim()
    ? STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.sector.toLowerCase().includes(query.toLowerCase())
      )
    : STOCKS;

  const handleSelect = async (stock) => {
    setSaving(true);
    const userId = localStorage.getItem("userId");
    try {
      await axiosInstance.post(`/automation/save?userId=${userId}`, {
        active: true,
        symbol: stock.symbol,
        threshold: stock.price
      });
    } catch (err) {
      console.error("Save automation error:", err);
    }
    setSaving(false);
    onSave({ symbol: stock.symbol, threshold: stock.price, isActive: true });
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axiosInstance.delete(`/automation?userId=${userId}`);
    } catch (err) {
      console.error("Delete automation error:", err);
    }
    onDelete();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(1,38,25,0.5)", zIndex: 200 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", borderRadius: "16px 16px 0 0",
        padding: "1.5rem", zIndex: 201, fontFamily: "inherit",
        maxWidth: 480, margin: "0 auto", maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, backgroundColor: C.sage, borderRadius: 99, margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: 0 }}>Otomasyon Kuralı</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20 }}>✕</button>
        </div>

        {/* Aktif kural varsa göster */}
        {currentRule && (
          <div style={{
            backgroundColor: C.forest, borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, backgroundColor: C.green + "25",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: C.green,
              }}>
                {currentRule.symbol.split(".")[0].slice(0, 4)}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 1px" }}>{currentRule.symbol}</p>
                <p style={{ fontSize: 11, color: C.mint, margin: 0 }}>Aktif kural</p>
              </div>
            </div>
            <button onClick={handleDelete} style={{
              padding: "5px 10px", borderRadius: 7, border: "1px solid #DC262640",
              backgroundColor: "transparent", color: "#DC2626", fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Sil</button>
          </div>
        )}

        {/* Arama */}
        <input
          type="text" placeholder="Hisse ara (sembol, şirket adı)..."
          value={query} onChange={e => setQuery(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box", padding: "0.6rem 0.85rem",
            border: `1.5px solid ${C.sage}`, borderRadius: 8, fontSize: 14,
            color: C.forest, outline: "none", fontFamily: "inherit",
            backgroundColor: "#fff", marginBottom: "0.75rem",
          }}
        />

        {/* Hisse listesi */}
        <div style={{ maxHeight: 280, overflowY: "auto", borderRadius: 10, border: `1px solid ${C.sage}` }}>
          {filtered.map((stock, i) => {
            const isActive = currentRule?.symbol === stock.symbol;
            return (
              <div key={stock.symbol} onClick={() => !saving && handleSelect(stock)} style={{
                display: "flex", alignItems: "center", padding: "0.7rem 0.85rem",
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.sage}40` : "none",
                backgroundColor: isActive ? C.green + "08" : "transparent",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background-color 0.15s",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  backgroundColor: isActive ? C.forest : C.cream,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginRight: 10, flexShrink: 0,
                  fontSize: 9, fontWeight: 700, color: isActive ? C.mint : C.forest + "60",
                }}>
                  {stock.symbol.split(".")[0].slice(0, 4)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.forest, margin: 0 }}>{stock.symbol}</p>
                    {isActive && <span style={{ fontSize: 9, fontWeight: 700, backgroundColor: C.green + "20", color: C.green, padding: "2px 6px", borderRadius: 99 }}>AKTİF</span>}
                  </div>
                  <p style={{ fontSize: 11, color: C.forest + "55", margin: "1px 0 0" }}>{stock.name}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: C.forest, margin: 0 }}>{fmtPrice(stock.price)} ₺</p>
                  <p style={{ fontSize: 10, color: C.forest + "40", margin: 0 }}>{stock.sector}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 11, color: C.forest + "45", textAlign: "center", marginTop: "0.75rem" }}>
          Hisse seçtiğinde para üstün fiyata ulaşınca otomatik alınır.
        </p>
      </div>
    </>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [roundingPrefs, setRoundingPrefs] = useState(MOCK_ROUNDING);
  const [rule, setRule] = useState(null);
  const [showRounding, setShowRounding] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || localStorage.getItem("token");
    if (!userId) { navigate("/login"); return; }

    const fetchData = async () => {
      try {
        const [userRes, autoRes] = await Promise.all([
          axiosInstance.get(`/users/me?userId=${userId}`),
          axiosInstance.get(`/automation?userId=${userId}`)
        ]);
        
        setUser(userRes.data);
        if (userRes.data.preferences) {
          // Backend preferences format might differ, mapping if needed
          // setRoundingPrefs(userRes.data.preferences);
        }
        
        if (autoRes.data && autoRes.data.symbol) {
          setRule({
            symbol: autoRes.data.symbol,
            threshold: autoRes.data.threshold,
            isActive: autoRes.data.active
          });
        }
      } catch (err) {
        console.error("Fetch settings error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleSaveRounding = async (prefs) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId") || token;
    try {
      await axiosInstance.post(`/users/preferences?userId=${userId}`, prefs);
      setRoundingPrefs(prefs);
      setShowRounding(false);
      showToast("Yuvarlama tercihleri güncellendi");
    } catch (err) {
      console.error("Save rounding prefs error:", err);
      showToast("Hata oluştu");
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await axiosInstance.post("/test/seed");
      showToast(res.data.message || "Demo veriler eklendi");
      // Veriler eklendikten sonra ana sayfaya yönlendir ki hemen görebilsin
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showToast("Veri eklenemedi");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar title="Ayarlar" />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>Ayarlar</h1>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: 0 }}>Hesap ve uygulama tercihlerini yönet</p>
        </div>

        <div style={{
          backgroundColor: C.forest, borderRadius: 14,
          padding: "1.25rem 1rem", marginBottom: "1rem",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            backgroundColor: C.green + "30",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 600, color: C.green, flexShrink: 0,
          }}>
            {user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "PK"}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>{user?.fullName || "Kullanıcı"}</p>
            <p style={{ fontSize: 12, color: C.mint, margin: "0 0 1px" }}>{user?.email || "email@example.com"}</p>
            <p style={{ fontSize: 12, color: C.sage, margin: 0 }}>{user?.phoneNumber || "+90 5xx xxx xx xx"}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <SectionCard>
            <SectionHeader
              title="Yuvarlama Tercihleri"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke={C.mint} strokeWidth="1.4"/>
                  <path d="M9.5 9.5C9.5 8.67 10.17 8 11 8h2c.83 0 1.5.67 1.5 1.5S13.83 11 13 11h-2c-.83 0-1.5.67-1.5 1.5S10.17 14 11 14h2c.83 0 1.5-.67 1.5-1.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 6v2M12 16v2" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            {Object.entries(ROUNDING_LABELS).map(([key, label], i, arr) => (
              <div key={key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.7rem 1rem",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.sage}40` : "none",
              }}>
                <p style={{ fontSize: 13, color: C.forest + "70", margin: 0 }}>{label}</p>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  backgroundColor: C.green + "15", color: C.green,
                  padding: "3px 9px", borderRadius: 99,
                }}>
                  En yakın {roundingPrefs[key]} TL
                </span>
              </div>
            ))}
            <div style={{ padding: "0.75rem 1rem", borderTop: `1px solid ${C.sage}40` }}>
              <button
                onClick={() => setShowRounding(true)}
                style={{
                  width: "100%", padding: "0.6rem",
                  borderRadius: 8, border: `1.5px solid ${C.green}`,
                  backgroundColor: "transparent", color: C.green,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Düzenle
              </button>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Otomasyon"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,17 8,12 12,15 16,9 21,7" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 7h4v4" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            <div style={{ padding: "0.85rem 1rem" }}>
              {rule ? (
                <>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8, backgroundColor: C.forest,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, color: C.mint,
                      }}>
                        {rule.symbol.split(".")[0].slice(0, 4)}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: C.forest, margin: "0 0 1px" }}>{rule.symbol}</p>
                        <p style={{ fontSize: 11, color: C.forest + "55", margin: 0 }}>Hisse fiyatına ulaşınca</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, backgroundColor: rule.isActive ? C.green + "15" : C.sage + "15", borderRadius: 99, padding: "3px 10px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: rule.isActive ? C.green : C.sage }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: rule.isActive ? C.green : C.forest + "40" }}>{rule.isActive ? "Aktif" : "Pasif"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 13, color: C.forest + "50", textAlign: "center", marginBottom: "0.75rem" }}>Aktif otomasyon kuralı yok.</p>
              )}
              <button
                onClick={() => setShowAutomation(true)}
                style={{
                  width: "100%", padding: "0.6rem",
                  borderRadius: 8, border: `1.5px solid ${C.green}`,
                  backgroundColor: "transparent", color: C.green,
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Otomasyonu Düzenle
              </button>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Demo"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            <Row label="Demo Veri Ekle" value="Test için örnek işlemler oluştur" onClick={handleSeedData} last />
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Hesap"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="3.5" stroke={C.mint} strokeWidth="1.5"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            <Row label="PIN Değiştir" value="Giriş PIN kodunu güncelle" onClick={() => setShowPin(true)} />
            <Row label="Çıkış Yap" danger onClick={() => setShowLogout(true)} last />
          </SectionCard>

          <p style={{ textAlign: "center", fontSize: 11, color: C.forest + "35", margin: "0.5rem 0 1rem" }}>
            ParaÜstü v1.0.0 · Mock mod
          </p>
        </div>
      </main>

      {showRounding && <RoundingModal prefs={roundingPrefs} onSave={handleSaveRounding} onClose={() => setShowRounding(false)} />}
      {showAutomation && <AutomationModal
        currentRule={rule}
        onSave={(newRule) => { setRule(newRule); setShowAutomation(false); showToast("Otomasyon kuralı kaydedildi"); }}
        onDelete={() => { setRule(null); setShowAutomation(false); showToast("Kural silindi"); }}
        onClose={() => setShowAutomation(false)}
      />}
      {showPin      && <PinModal onClose={() => setShowPin(false)} />}
      {showLogout   && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(1,38,25,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowLogout(false)}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 320 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, textAlign: "center", margin: "0 0 6px" }}>Çıkış yap</h3>
            <p style={{ fontSize: 13, color: C.forest + "70", textAlign: "center", margin: "0 0 1.5rem", lineHeight: 1.5 }}>Hesabından çıkış yapmak istediğinden emin misin?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: "0.65rem", borderRadius: 9, border: `1.5px solid ${C.sage}`, backgroundColor: "transparent", color: C.forest + "80", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>İptal</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: "0.65rem", borderRadius: 9, border: "none", backgroundColor: "#DC2626", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Çıkış Yap</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          backgroundColor: C.forest, color: "#fff", fontSize: 13, fontWeight: 500,
          padding: "0.6rem 1.2rem", borderRadius: 99, zIndex: 300,
          whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(1,38,25,0.25)",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
