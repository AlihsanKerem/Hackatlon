// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// mockLogin kaldırıldı, API kullanılacak

const C = { forest: "#012619", green: "#4EA664", mint: "#78BF9E", sage: "#A9D9C2", cream: "#E8E5DE" };

const inputStyle = (focused) => ({
  width: "100%", boxSizing: "border-box", padding: "0.65rem 0.9rem",
  borderRadius: 8, border: `1.5px solid ${focused ? C.green : C.sage}`,
  fontSize: 14, color: C.forest, outline: "none", backgroundColor: "#fff",
  transition: "border-color 0.15s", fontFamily: "inherit",
});

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tcKimlik, setTcKimlik] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Zaten giriş yapmışsa dashboard'a gönder
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = async () => {
    setError("");
    if (!tcKimlik || !password) { setError("Lütfen tüm alanları doldurun."); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tcKimlik: tcKimlik.trim(), pin: password.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Giriş başarısız oldu.");
      }

      login(data.token, data.id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/logo.png" alt="ParaÜstü" style={{
            width: 72, height: 72, objectFit: "contain", marginBottom: "0.75rem",
          }} />
          <h1 style={{ color: C.forest, fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>ParaÜstü</h1>
          <p style={{ color: C.forest + "80", fontSize: 13, margin: 0 }}>Para üstünü yatırıma dönüştür</p>
        </div>


        {/* Kart */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: `1px solid ${C.sage}`, padding: "2rem" }}>
          <h2 style={{ color: C.forest, fontSize: 18, fontWeight: 600, margin: "0 0 1.5rem" }}>Giriş Yap</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.75rem 1rem", color: "#991B1B", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 6 }}>TC Kimlik Numarası</label>
              <input type="text" value={tcKimlik} onChange={e => setTcKimlik(e.target.value.replace(/\D/g, ""))}
                onFocus={() => setFocused("tcKimlik")} onBlur={() => setFocused(null)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                maxLength={11}
                placeholder="11 Haneli TC No" style={inputStyle(focused === "tcKimlik")} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 6 }}>Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••" style={inputStyle(focused === "password")} />
            </div>

            <button onClick={handleLogin} disabled={loading} style={{
              width: "100%", padding: "0.75rem", marginTop: "0.25rem",
              borderRadius: 8, border: "none",
              backgroundColor: loading ? C.sage : C.green,
              color: "#fff", fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.15s", fontFamily: "inherit",
            }}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: C.forest + "80", marginTop: "1.25rem" }}>
          Hesabın yok mu?{" "}
          <span style={{ color: C.green, fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/register")}>
            Kayıt ol
          </span>
        </p>
      </div>
    </div>
  );
}
