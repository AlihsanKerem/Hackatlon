import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const BANKS = ["A Bankası", "B Bankası"];

const INITIAL_CARDS = [
  { id: 1, bank: "A Bankası", last4: "1234", expiry: "08/27", active: true },
  { id: 2, bank: "B Bankası", last4: "5678", expiry: "11/26", active: false },
];

const bankColor = (bank) => {
  const name = (bank || "").toLowerCase();
  if (name.includes("akbank")) return { bg: "#FEF2F2", text: "#991B1B", accent: "#DC2626" };
  if (name.includes("garanti")) return { bg: "#F0FDF4", text: "#166534", accent: "#22C55E" };
  if (name.includes("is") || name.includes("iş")) return { bg: "#EFF6FF", text: "#1E40AF", accent: "#3B82F6" };
  return { bg: "#F9FAFB", text: "#374151", accent: "#6B7280" };
};

function BankIcon({ bank, size = 36 }) {
  const bc = bankColor(bank || "Banka");
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      backgroundColor: bc.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      fontSize: 11, fontWeight: 700, color: bc.text,
      letterSpacing: "0.02em",
    }}>
      {(bank || "B").split(" ")[0][0]}B
    </div>
  );
}

function CardChip() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <rect x="0.5" y="0.5" width="27" height="21" rx="3.5" fill="#D4AF37" stroke="#B8962E" strokeWidth="0.5"/>
      <rect x="9" y="0.5" width="10" height="21" fill="#C9A227" opacity="0.6"/>
      <rect x="0.5" y="7" width="27" height="8" fill="#C9A227" opacity="0.6"/>
      <rect x="9" y="7" width="10" height="8" fill="#B8962E" opacity="0.5"/>
    </svg>
  );
}

function CardVisual({ card }) {
  const bc = bankColor(card.bankName || card.bank);
  const last4 = card.last4 || (card.cardNumber ? card.cardNumber.slice(-4) : "••••");
  
  return (
    <div style={{
      width: "100%", aspectRatio: "1.6",
      borderRadius: 14,
      background: `linear-gradient(135deg, ${bc.accent}22 0%, ${bc.bg} 100%)`,
      border: `1.5px solid ${bc.accent}40`,
      padding: "1rem",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
      boxSizing: "border-box",
    }}>
      <div style={{
        position: "absolute", right: -20, top: -20,
        width: 100, height: 100, borderRadius: "50%",
        backgroundColor: bc.accent + "15",
      }} />
      <div style={{
        position: "absolute", right: 20, bottom: -30,
        width: 120, height: 120, borderRadius: "50%",
        backgroundColor: bc.accent + "10",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: bc.text }}>{card.bankName || card.bank}</span>
        <CardChip />
      </div>
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.forest, letterSpacing: "0.12em", margin: "0 0 6px" }}>
          •••• •••• •••• {last4}
        </p>
        <p style={{ fontSize: 11, color: C.forest + "60", margin: 0, letterSpacing: "0.04em" }}>
          SON KULLANMA  {card.expiryDate || card.expiry}
        </p>
      </div>
    </div>
  );
}

function DeleteModal({ card, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(1,38,25,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, padding: "1rem",
    }} onClick={onCancel}>
      <div
        style={{
          backgroundColor: "#fff", borderRadius: 16,
          padding: "1.5rem", width: "100%", maxWidth: 340,
          fontFamily: "inherit",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          backgroundColor: "#FEF2F2",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v5M14 11v5" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, textAlign: "center", margin: "0 0 6px" }}>
          Kartı sil
        </h3>
        <p style={{ fontSize: 13, color: C.forest + "70", textAlign: "center", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
          {card.bank} •••• {card.last4} kartını silmek istediğinden emin misin?
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "0.65rem",
              borderRadius: 9, border: `1.5px solid ${C.sage}`,
              backgroundColor: "transparent",
              color: C.forest + "80", fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "0.65rem",
              borderRadius: 9, border: "none",
              backgroundColor: "#DC2626",
              color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Evet, sil
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { bank: "", number: "", expiry: "" };

function AddCardModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const formatNumber = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    return d.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length > 2) return d.slice(0, 2) + "/" + d.slice(2);
    return d;
  };

  const rawNumber = form.number.replace(/\s/g, "");

  const handleAdd = () => {
    if (!form.bank.trim()) { setError("Banka adı zorunludur."); return; }
    if (rawNumber.length !== 16) { setError("Kart numarası 16 haneli olmalıdır."); return; }
    if (form.expiry.length !== 5) { setError("Geçerli bir son kullanma tarihi girin."); return; }
    setError("");
    onAdd({
      bank: form.bank,
      last4: rawNumber.slice(-4),
      expiry: form.expiry,
    });
  };

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box",
    padding: "0.6rem 0.85rem",
    border: `1.5px solid ${focused === field ? C.green : C.sage}`,
    borderRadius: 8, fontSize: 14, color: C.forest,
    outline: "none", fontFamily: "inherit",
    backgroundColor: "#fff",
    transition: "border-color 0.15s",
  });

  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(1,38,25,0.45)",
      display: "flex", alignItems: "flex-end",
      zIndex: 200,
    }} onClick={onClose}>
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
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.forest, margin: 0 }}>Yeni Kart Ekle</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.forest + "60", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {error && (
            <div style={{
              backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 8, padding: "0.65rem 0.9rem", color: "#991B1B", fontSize: 13,
            }}>{error}</div>
          )}

          {/* Banka */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Banka Adı</label>
            <input
              type="text"
              placeholder="Akbank, Garanti, İş Bankası..."
              value={form.bank}
              onChange={e => set("bank", e.target.value)}
              onFocus={() => setFocused("bank")}
              onBlur={() => setFocused(null)}
              style={inputStyle("bank")}
            />
          </div>

          {/* Kart Numarası */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Kart Numarası</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={form.number}
              onChange={e => set("number", formatNumber(e.target.value))}
              onFocus={() => setFocused("number")}
              onBlur={() => setFocused(null)}
              style={{ ...inputStyle("number"), letterSpacing: "0.06em" }}
            />
          </div>

          {/* Expiry + CVV */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.forest + "80", display: "block", marginBottom: 5 }}>Son Kullanma</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={e => set("expiry", formatExpiry(e.target.value))}
                onFocus={() => setFocused("expiry")}
                onBlur={() => setFocused(null)}
                style={{ ...inputStyle("expiry"), letterSpacing: "0.08em" }}
              />
            </div>
          </div>


          <button
            onClick={handleAdd}
            style={{
              width: "100%", padding: "0.75rem",
              backgroundColor: C.green, color: "#fff",
              border: "none", borderRadius: 9,
              fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              marginTop: 4,
            }}
          >
            Kartı Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCards = async () => {
    const userId = localStorage.getItem("userId") || localStorage.getItem("token");
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/cards?userId=${userId}`);
      setCards(res.data);
    } catch (err) {
      console.error("Fetch cards error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const activeCard = cards.find(c => c.isActive || c.active);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const setActive = async (id) => {
    const userId = localStorage.getItem("userId");
    try {
      await axiosInstance.post(`/cards/${id}/activate?userId=${userId}`);
      setCards(cs => cs.map(c => ({ ...c, isActive: (c.cardId === id || c.id === id) })));
      showToast("Aktif kart güncellendi");
    } catch (err) {
      console.error("Set active card error:", err);
    }
  };

  const confirmDelete = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axiosInstance.delete(`/cards/${deleteTarget.id}?userId=${userId}`);
      const wasActive = deleteTarget.isActive;
      const remaining = cards.filter(c => c.id !== deleteTarget.id);
      if (wasActive && remaining.length > 0) {
        remaining[0].isActive = true;
      }
      setCards(remaining);
      setDeleteTarget(null);
      showToast("Kart silindi");
    } catch (err) {
      console.error("Delete card error:", err);
    }
  };

  const addCard = async ({ bank, last4, expiry }) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axiosInstance.post(`/cards?userId=${userId}`, {
        bankName: bank,
        cardNumber: "444455556666" + last4, // Mock full number
        expiryDate: expiry,
        maskedNumber: "**** " + last4,
        isActive: cards.length === 0
      });
      setCards(cs => [...cs, res.data]);
      setShowAdd(false);
      showToast("Kart eklendi");
    } catch (err) {
      console.error("Add card error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar title="Kartlarım" />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Başlık */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>Kartlarım</h1>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: 0 }}>
            Aktif kart ParaÜstü ödemelerinde kullanılır
          </p>
        </div>

        {/* Aktif kart önizleme */}
        {activeCard && (
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: 12, color: C.forest + "55", margin: "0 0 8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Aktif Kart</p>
            <CardVisual card={activeCard} />
          </div>
        )}

        {/* Kart listesi */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          border: `1px solid ${C.sage}`,
          overflow: "hidden",
          marginBottom: "1rem",
        }}>
          <div style={{
            padding: "0.85rem 1rem",
            borderBottom: `1px solid ${C.sage}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>
              Tüm Kartlar ({cards.length})
            </span>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px",
                backgroundColor: C.green, color: "#fff",
                border: "none", borderRadius: 8,
                fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              Kart Ekle
            </button>
          </div>

          {cards.length === 0 ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 10, opacity: 0.3 }}>
                <rect x="2" y="5" width="20" height="14" rx="3" stroke={C.forest} strokeWidth="1.6"/>
                <path d="M2 10h20" stroke={C.forest} strokeWidth="1.6"/>
              </svg>
              <p style={{ color: C.forest + "50", fontSize: 14, margin: 0 }}>Henüz kart eklenmedi</p>
            </div>
          ) : (
            cards.map((card, i) => (
              <div
                key={card.id}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "0.85rem 1rem",
                  borderBottom: i < cards.length - 1 ? `1px solid ${C.sage}40` : "none",
                  backgroundColor: card.active ? C.green + "06" : "transparent",
                  transition: "background-color 0.2s",
                }}
              >
                <BankIcon bank={card.bankName || card.bank} />
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, margin: 0 }}>{card.bankName || card.bank}</p>
                    {(card.isActive || card.active) && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        backgroundColor: C.green + "20",
                        color: C.green,
                        padding: "2px 7px", borderRadius: 99,
                        letterSpacing: "0.04em",
                      }}>AKTİF</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: C.forest + "55", margin: "2px 0 0", letterSpacing: "0.04em" }}>
                    •••• {card.last4 || (card.cardNumber ? card.cardNumber.slice(-4) : "••••")} · {card.expiryDate || card.expiry}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  {!(card.isActive || card.active) && (
                    <button
                      onClick={() => setActive(card.cardId || card.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "transparent",
                        border: `1.5px solid ${C.green}`,
                        borderRadius: 7,
                        fontSize: 12, color: C.green, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >
                      Aktif Yap
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(card)}
                    style={{
                      padding: "5px 8px",
                      backgroundColor: "transparent",
                      border: `1px solid ${C.sage}`,
                      borderRadius: 7,
                      cursor: "pointer", fontFamily: "inherit",
                      flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bilgi notu */}
        <div style={{
          padding: "0.75rem 1rem",
          backgroundColor: C.mint + "25",
          border: `1px solid ${C.mint}`,
          borderRadius: 10,
          fontSize: 12, color: C.forest + "70", lineHeight: 1.6,
        }}>
          Sadece bir kart aynı anda aktif olabilir. Aktif kart değiştirildiğinde yeni ödemeler yeni karttan alınır.
        </div>
      </main>

      {/* Modals */}
      {deleteTarget && (
        <DeleteModal
          card={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAdd && (
        <AddCardModal onAdd={addCard} onClose={() => setShowAdd(false)} />
      )}

      {/* Toast */}
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
