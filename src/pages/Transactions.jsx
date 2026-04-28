import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const fmt = (n) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function Transactions() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
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
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [token, logout]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: C.cream, color: C.forest }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ backgroundColor: C.cream, minHeight: "100vh" }}>
      <Navbar title="Tüm İşlemler" showBack={true} />

      <main style={{ padding: "1.25rem 1rem", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.forest, margin: "0 0 3px" }}>Geçmiş İşlemler</h1>
          <p style={{ fontSize: 13, color: C.forest + "60", margin: 0 }}>Yuvarlanan tüm harcamalarınızın listesi</p>
        </div>

        <div style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          border: `1px solid ${C.sage}`,
          overflow: "hidden",
        }}>
          {transactions.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: C.forest + "70", fontSize: 13 }}>
              Henüz bir işleminiz bulunmamaktadır.
            </div>
          ) : transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.85rem 1rem",
                borderBottom: i < transactions.length - 1 ? `1px solid ${C.sage}40` : "none",
              }}
            >
              {/* Merchant icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                backgroundColor: C.cream,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: 12, flexShrink: 0,
                fontSize: 13, fontWeight: 700, color: C.forest + "80",
              }}>
                {tx.merchant.slice(0, 2).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.forest, margin: "0 0 2px" }}>{tx.merchant}</p>
                <p style={{ fontSize: 12, color: C.forest + "55", margin: 0 }}>{tx.date}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: C.forest, margin: "0 0 2px" }}>{fmt(tx.amount)} ₺</p>
                <p style={{ fontSize: 12, color: C.green, fontWeight: 600, margin: 0 }}>+{fmt(tx.roundup)} ₺</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
