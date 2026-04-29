import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const realLogin = async (tcKimlik, pin) => {
  const res = await axiosInstance.post("/auth/login", { tcKimlik, pin });
  return res.data;
};

const C = { forest:"#012619", green:"#4EA664", mint:"#78BF9E", sage:"#A9D9C2", cream:"#E8E5DE" };

const inputStyle = (focused) => ({
  width:"100%", boxSizing:"border-box", padding:"0.65rem 0.9rem",
  borderRadius:8, border:`1.5px solid ${focused ? C.green : C.sage}`,
  fontSize:14, color:C.forest, outline:"none", backgroundColor:"#fff",
  transition:"border-color 0.15s", fontFamily:"inherit",
});

function PinDisplay({ pin }) {
  const digits = pin.split("").concat(Array(6).fill("")).slice(0, 6);
  return (
    <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
      {digits.map((d, i) => (
        <div key={i} style={{
          width:44, height:52, borderRadius:9,
          border:`1.5px solid ${d ? C.green : C.sage}`,
          backgroundColor: d ? C.green + "10" : "#fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: d ? 22 : 14, color: d ? C.green : C.sage,
          transition:"all 0.15s",
        }}>
          {d ? "●" : ""}
        </div>
      ))}
    </div>
  );
}

function NumPad({ value, onChange }) {
  const keys = [1,2,3,4,5,6,7,8,9,"",0,"⌫"];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
      {keys.map((k, i) => (
        <button key={i}
          onClick={() => {
            if (k === "") return;
            if (k === "⌫") { onChange(value.slice(0, -1)); return; }
            if (value.length < 6) onChange(value + String(k));
          }}
          style={{
            height:52, borderRadius:10,
            border: k === "" ? "none" : `1px solid ${C.sage}`,
            backgroundColor: k === "" ? "transparent" : "#fff",
            color: k === "⌫" ? "#DC2626" : C.forest,
            fontSize: k === "⌫" ? 18 : 20, fontWeight:500,
            cursor: k === "" ? "default" : "pointer",
            fontFamily:"inherit", transition:"background 0.1s",
          }}
        >{k}</button>
      ))}
    </div>
  );
}

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tcKimlik, setTcKimlik] = useState("");
  const [pin, setPin]           = useState("");
  const [step, setStep]         = useState("tc"); // tc | pin
  const [focused, setFocused]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleTcNext = () => {
    setError("");
    const raw = tcKimlik.replace(/\D/g, "");
    if (raw.length !== 11) { setError("TC Kimlik numarası 11 haneli olmalıdır."); return; }
    setStep("pin");
  };

  const handleLogin = async () => {
    setError("");
    if (pin.length < 6) { setError("6 haneli PIN'inizi girin."); return; }
    setLoading(true);
    try {
      const res = await realLogin(tcKimlik.replace(/\D/g, ""), pin);
      localStorage.setItem("userId", res.id);
      login(res.token);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("TC Kimlik veya PIN hatalı.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", backgroundColor:C.cream,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"1rem", fontFamily:"system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width:"100%", maxWidth:400 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <img src="/logo.png" alt="ParaÜstü" style={{ width:72, height:72, objectFit:"contain", marginBottom:"0.75rem" }} />
          <h1 style={{ color:C.forest, fontSize:26, fontWeight:700, margin:"0 0 4px" }}>ParaÜstü</h1>
          <p style={{ color:C.forest+"80", fontSize:13, margin:0 }}>Para üstünü yatırıma dönüştür</p>
        </div>

        <div style={{ backgroundColor:"#fff", borderRadius:16, border:`1px solid ${C.sage}`, padding:"2rem" }}>

          {step === "tc" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <h2 style={{ color:C.forest, fontSize:18, fontWeight:600, margin:"0 0 0.25rem" }}>Giriş Yap</h2>

              {error && (
                <div style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"0.75rem 1rem", color:"#991B1B", fontSize:13 }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:C.forest, marginBottom:6 }}>TC Kimlik Numarası</label>
                <input
                  type="text" inputMode="numeric" maxLength={11}
                  value={tcKimlik}
                  onChange={e => setTcKimlik(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  onKeyDown={e => e.key === "Enter" && handleTcNext()}
                  placeholder="00000000000"
                  style={{ ...inputStyle(focused), letterSpacing:"0.12em", fontSize:16 }}
                />
              </div>

              <button onClick={handleTcNext} style={{
                width:"100%", padding:"0.75rem", marginTop:"0.25rem",
                borderRadius:8, border:"none", backgroundColor:C.green,
                color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer",
                fontFamily:"inherit",
              }}>
                Devam Et
              </button>
            </div>

          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button
                  onClick={() => { setStep("tc"); setPin(""); setError(""); }}
                  style={{ background:"none", border:"none", cursor:"pointer", color:C.forest+"60", padding:0, display:"flex" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h2 style={{ color:C.forest, fontSize:17, fontWeight:600, margin:0 }}>PIN Girin</h2>
              </div>

              <p style={{ fontSize:13, color:C.forest+"60", margin:0 }}>
                TC: <strong style={{ color:C.forest }}>{tcKimlik.slice(0,3)}****{tcKimlik.slice(-4)}</strong>
              </p>

              {error && (
                <div style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"0.65rem 0.9rem", color:"#991B1B", fontSize:13 }}>
                  {error}
                </div>
              )}

              <PinDisplay pin={pin} />
              <NumPad value={pin} onChange={setPin} />

              <button
                onClick={handleLogin}
                disabled={loading || pin.length < 6}
                style={{
                  width:"100%", padding:"0.75rem",
                  borderRadius:8, border:"none",
                  backgroundColor: loading || pin.length < 6 ? C.sage : C.green,
                  color:"#fff", fontSize:15, fontWeight:600,
                  cursor: loading || pin.length < 6 ? "not-allowed" : "pointer",
                  fontFamily:"inherit",
                }}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign:"center", fontSize:14, color:C.forest+"80", marginTop:"1.25rem" }}>
          Hesabın yok mu?{" "}
          <span style={{ color:C.green, fontWeight:600, cursor:"pointer" }} onClick={() => navigate("/register")}>
            Kayıt ol
          </span>
        </p>

        <div style={{
          marginTop:"1.5rem", padding:"0.65rem 0.9rem", borderRadius:8,
          backgroundColor:C.mint+"25", border:`1px dashed ${C.mint}`,
          fontSize:12, color:C.forest+"70", textAlign:"center", lineHeight:1.6,
        }}>
          Mock mod · Herhangi TC (11 hane) + PIN → giriş
        </div>
      </div>
    </div>
  );
}
