import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const mockRegister = async (data) => {
  await new Promise(r => setTimeout(r, 1000));
  if (data.email === "var@test.com") throw new Error("Bu e-posta adresi zaten kullanımda.");
  return { token: "mock-jwt-token-xyz" };
};

const mockVerifyOtp = async (otp) => {
  await new Promise(r => setTimeout(r, 800));
  if (otp === "000000") throw new Error("Geçersiz kod. Tekrar deneyin.");
  return true;
};

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const inputStyle = (focused) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "0.65rem 0.9rem",
  borderRadius: 8,
  border: `1.5px solid ${focused ? C.green : C.sage}`,
  fontSize: 14,
  color: C.forest,
  outline: "none",
  backgroundColor: "#fff",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
});

// 6 haneli PIN input
function PinInput({ value, onChange, focused, onFocus, onBlur }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d, idx) => idx === i ? v : d);
    onChange(arr.join(""));
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      const arr = digits.map((d, idx) => idx === i - 1 ? "" : d);
      onChange(arr.join(""));
    }
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            width: "100%",
            aspectRatio: "1",
            maxWidth: 52,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            borderRadius: 8,
            border: `1.5px solid ${focused ? C.green : C.sage}`,
            color: C.forest,
            outline: "none",
            backgroundColor: "#fff",
            transition: "border-color 0.15s",
            fontFamily: "inherit",
            letterSpacing: d ? "0.1em" : 0,
          }}
        />
      ))}
    </div>
  );
}

// OTP ekranı
function OtpScreen({ phone, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (otp.length < 6) { setError("6 haneli kodu girin."); return; }
    setError(""); setLoading(true);
    try {
      await mockVerifyOtp(otp);
      onSuccess();
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          backgroundColor: C.green + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 0.75rem",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke={C.green} strokeWidth="1.8"/>
            <path d="M12 18h.01" stroke={C.green} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ color: C.forest, fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>Telefonu doğrula</p>
        <p style={{ color: C.forest + "70", fontSize: 13, margin: 0 }}>
          <span style={{ color: C.forest }}>{phone}</span> numarasına gönderilen 6 haneli kodu gir
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: 8, padding: "0.65rem 0.9rem", color: "#991B1B", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <PinInput
        value={otp}
        onChange={setOtp}
        focused={focused}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        style={{
          width: "100%", padding: "0.75rem", marginTop: "0.25rem",
          borderRadius: 8, border: "none",
          backgroundColor: loading ? C.sage : C.green,
          color: "#fff", fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.15s", fontFamily: "inherit",
        }}
      >
        {loading ? "Doğrulanıyor..." : "Doğrula"}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: C.forest + "60", margin: 0 }}>
        Kod gelmedi mi?{" "}
        <span style={{ color: C.green, fontWeight: 600, cursor: "pointer" }}
          onClick={() => console.log("Kod tekrar gönderildi (mock)")}>
          Tekrar gönder
        </span>
      </p>

      <div style={{
        padding: "0.65rem 0.9rem", borderRadius: 8,
        backgroundColor: C.mint + "25", border: `1px dashed ${C.mint}`,
        fontSize: 12, color: C.forest + "70", textAlign: "center", lineHeight: 1.6,
      }}>
        Mock mod · Herhangi kod → doğrula · Hata testi: 000000
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState("form"); // form | otp | success
  const [form, setForm] = useState({ tcKimlik: "", fullName: "", email: "", phone: "", pin: "", pinConfirm: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    let out = digits;
    if (digits.length > 3) out = digits.slice(0,3) + " " + digits.slice(3);
    if (digits.length > 6) out = digits.slice(0,3) + " " + digits.slice(3,6) + " " + digits.slice(6);
    if (digits.length > 8) out = digits.slice(0,3) + " " + digits.slice(3,6) + " " + digits.slice(6,8) + " " + digits.slice(8);
    return out;
  };

  const rawPhone = form.phone.replace(/\D/g, "");

  const validate = () => {
    if (form.tcKimlik.replace(/\D/g, "").length !== 11) return "TC Kimlik numarası 11 haneli olmalıdır.";
    if (!form.fullName.trim()) return "Ad soyad zorunludur.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return "Geçerli bir e-posta girin.";
    if (rawPhone.length !== 10) return "Geçerli bir telefon numarası girin.";
    if (form.pin.length !== 6) return "PIN 6 haneli olmalıdır.";
    if (form.pin !== form.pinConfirm) return "PIN kodları eşleşmiyor.";
    return null;
  };

  const handleRegister = async () => {
    setError("");
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await mockRegister(form);
      setStep("otp");
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fullPhone = `+90 ${form.phone}`;

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        login("mock-token-from-register");
        navigate("/dashboard", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, login]);

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem 1rem",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <img src="/logo.png" alt="ParaÜstü" style={{ width: 64, height: 64, objectFit: "contain", marginBottom: "0.65rem" }} />
          <h1 style={{ color: C.forest, fontSize: 24, fontWeight: 700, margin: "0 0 3px" }}>ParaÜstü</h1>
          <p style={{ color: C.forest + "80", fontSize: 13, margin: 0 }}>
            {step === "otp" ? "Telefon doğrulama" : "Hesap oluştur"}
          </p>
        </div>

        <div style={{
          backgroundColor: "#fff", borderRadius: 16,
          border: `1px solid ${C.sage}`, padding: "1.75rem",
        }}>

          {step === "success" ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                backgroundColor: C.green + "20",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ color: C.forest, fontWeight: 600, fontSize: 16, margin: "0 0 6px" }}>Hesabın oluşturuldu!</p>
              <p style={{ color: C.forest + "70", fontSize: 13, margin: 0 }}>Ana ekrana yönlendiriliyorsunuz...</p>
            </div>

          ) : step === "otp" ? (
            <OtpScreen phone={fullPhone} onSuccess={() => setStep("success")} />

          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ color: C.forest, fontSize: 17, fontWeight: 600, margin: "0 0 0.25rem" }}>Kayıt Ol</h2>

              {error && (
                <div style={{
                  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: 8, padding: "0.65rem 0.9rem", color: "#991B1B", fontSize: 13,
                }}>
                  {error}
                </div>
              )}

              {/* TC Kimlik */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>TC Kimlik Numarası</label>
                <input
                  type="text" inputMode="numeric" maxLength={11}
                  value={form.tcKimlik}
                  onChange={e => set("tcKimlik", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  onFocus={() => setFocused("tcKimlik")} onBlur={() => setFocused(null)}
                  placeholder="00000000000"
                  style={{ ...inputStyle(focused === "tcKimlik"), letterSpacing:"0.12em", fontSize:16 }}
                />
              </div>

              {/* Ad Soyad */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>Ad Soyad</label>
                <input type="text" value={form.fullName}
                  onChange={e => set("fullName", e.target.value)}
                  onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)}
                  placeholder="Adın Soyadın" style={inputStyle(focused === "fullName")} />
              </div>

              {/* E-posta */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>E-posta</label>
                <input type="email" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  placeholder="ornek@email.com" style={inputStyle(focused === "email")} />
              </div>

              {/* Telefon */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>Telefon Numarası</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{
                    padding: "0.65rem 0.9rem", borderRadius: 8,
                    border: `1.5px solid ${C.sage}`,
                    backgroundColor: C.cream, fontSize: 14, color: C.forest,
                    fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
                  }}>+90</div>
                  <input
                    type="tel" value={form.phone}
                    onChange={e => set("phone", formatPhone(e.target.value))}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    placeholder="5xx xxx xx xx"
                    style={{ ...inputStyle(focused === "phone"), letterSpacing: "0.04em" }}
                  />
                </div>
              </div>

              {/* PIN */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>
                  PIN Kodu <span style={{ fontSize: 12, color: C.forest + "60", fontWeight: 400 }}>(6 haneli)</span>
                </label>
                <PinInput value={form.pin} onChange={v => set("pin", v)}
                  focused={focused === "pin"}
                  onFocus={() => setFocused("pin")} onBlur={() => setFocused(null)} />
              </div>

              {/* PIN Tekrar */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.forest, marginBottom: 5 }}>
                  PIN Tekrar
                </label>
                <PinInput value={form.pinConfirm} onChange={v => set("pinConfirm", v)}
                  focused={focused === "pinConfirm"}
                  onFocus={() => setFocused("pinConfirm")} onBlur={() => setFocused(null)} />
                {form.pinConfirm.length === 6 && (
                  <p style={{
                    fontSize: 12, marginTop: 6,
                    color: form.pin === form.pinConfirm ? C.green : "#DC2626",
                  }}>
                    {form.pin === form.pinConfirm ? "✓ PIN kodları eşleşiyor" : "✕ PIN kodları eşleşmiyor"}
                  </p>
                )}
              </div>

              {/* Buton */}
              <button onClick={handleRegister} disabled={loading} style={{
                width: "100%", padding: "0.75rem", marginTop: "0.25rem",
                borderRadius: 8, border: "none",
                backgroundColor: loading ? C.sage : C.green,
                color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.15s", fontFamily: "inherit",
              }}>
                {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
              </button>
            </div>
          )}
        </div>

        {step === "form" && (
          <p style={{ textAlign: "center", fontSize: 14, color: C.forest + "80", marginTop: "1.25rem" }}>
            Zaten hesabın var mı?{" "}
            <span style={{ color: C.green, fontWeight: 600, cursor: "pointer" }}
              onClick={() => navigate("/login")}>
              Giriş yap
            </span>
          </p>
        )}

        <div style={{
          marginTop: "1.25rem", padding: "0.65rem 0.9rem", borderRadius: 8,
          backgroundColor: C.mint + "25", border: `1px dashed ${C.mint}`,
          fontSize: 12, color: C.forest + "70", textAlign: "center", lineHeight: 1.6,
        }}>
          Mock mod · Hata testi: var@test.com · OTP hata: 000000
        </div>

      </div>
    </div>
  );
}
