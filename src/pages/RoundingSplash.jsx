import { useState } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

const TIERS = [
  {
    id: "under10",
    label: "10 TL altı işlemlerde geçerli",
    example: "Kahve, su, ulaşım",
    options: [
      { key: "1",  label: "1 TL",  ex: "3,40 → 4 TL",   roundup: "0,60 TL" },
      { key: "5",  label: "5 TL",  ex: "3,40 → 5 TL",   roundup: "1,60 TL" },
      { key: "10", label: "10 TL", ex: "3,40 → 10 TL",  roundup: "6,60 TL" },
    ],
  },
  {
    id: "under100",
    label: "10–100 TL arası işlemlerde geçerli",
    example: "Market, yemek, kitap",
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
    example: "Fatura, giysi, restoran",
    options: [
      { key: "1",    label: "1 TL",    ex: "320 → 321 TL",    roundup: "1 TL" },
      { key: "10",   label: "10 TL",   ex: "320 → 330 TL",    roundup: "10 TL" },
      { key: "50",   label: "50 TL",   ex: "320 → 350 TL",    roundup: "30 TL" },
      { key: "100",  label: "100 TL",  ex: "320 → 400 TL",    roundup: "80 TL" },
      { key: "1000", label: "1.000 TL",ex: "320 → 1.000 TL",  roundup: "680 TL" },
    ],
  },
  {
    id: "under10000",
    label: "1.000 TL+ işlemlerde geçerli",
    example: "Elektronik, kira, tatil",
    options: [
      { key: "1",     label: "1 TL",      ex: "1.240 → 1.241 TL",  roundup: "1 TL" },
      { key: "10",    label: "10 TL",     ex: "1.240 → 1.250 TL",  roundup: "10 TL" },
      { key: "100",   label: "100 TL",    ex: "1.240 → 1.300 TL",  roundup: "60 TL" },
      { key: "1000",  label: "1.000 TL",  ex: "1.240 → 2.000 TL",  roundup: "760 TL" },
      { key: "10000", label: "10.000 TL", ex: "1.240 → 10.000 TL", roundup: "8.760 TL" },
    ],
  },
];

function CoinIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={C.sage} strokeWidth="1.2"/>
      <path d="M9.5 9.5C9.5 8.67 10.17 8 11 8h2c.83 0 1.5.67 1.5 1.5S13.83 11 13 11h-2c-.83 0-1.5.67-1.5 1.5S10.17 14 11 14h2c.83 0 1.5-.67 1.5-1.5"
        stroke={C.green} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 6v2M12 16v2" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export default function RoundingSplash() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState({ under10: null, under100: null, under1000: null, under10000: null });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [expandedTier, setExpandedTier] = useState("under10");

  const allSelected = Object.values(selections).every(v => v !== null);

  const select = (tierId, key) => {
    setSelections(s => ({ ...s, [tierId]: key }));
    const ids = TIERS.map(t => t.id);
    const nextIdx = ids.indexOf(tierId) + 1;
    if (nextIdx < ids.length) setExpandedTier(ids[nextIdx]);
  };

  const handleContinue = async () => {
    if (!allSelected) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
  };

  if (done) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: C.cream,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif", padding: "1rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", backgroundColor: C.green + "20",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ color: C.forest, fontWeight: 600, fontSize: 18, margin: "0 0 6px" }}>Tercihler kaydedildi!</p>
          <p style={{ color: C.forest + "50", fontSize: 13, margin: 0 }}>Dashboard'a yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  const completedCount = Object.values(selections).filter(v => v !== null).length;

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif", padding: "1.5rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "50%", backgroundColor: C.forest, marginBottom: "0.9rem",
          }}>
            <CoinIcon />
          </div>
          <h1 style={{ color: C.forest, fontSize: 21, fontWeight: 700, margin: "0 0 8px" }}>
            Yuvarlama tercihlerini belirle
          </h1>
          <p style={{ color: C.forest + "70", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Her harcama aralığı için ayrı ayrı seçebilirsin.
            Ayarlardan istediğin zaman değiştirebilirsin.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
          {TIERS.map((t, i) => (
            <div key={t.id} style={{
              flex: 1, height: 4, borderRadius: 99,
              backgroundColor: selections[t.id] ? C.green : C.sage,
              transition: "background-color 0.3s",
            }} />
          ))}
        </div>

        {/* Tiers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
          {TIERS.map((tier, ti) => {
            const isExpanded = expandedTier === tier.id;
            const chosen = selections[tier.id];
            const isDone = chosen !== null;

            return (
              <div key={tier.id} style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                border: `1.5px solid ${isExpanded ? C.green : isDone ? C.mint : C.sage}`,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                <button
                  onClick={() => setExpandedTier(isExpanded ? null : tier.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 12, padding: "0.85rem 1rem",
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    backgroundColor: isDone ? C.green : isExpanded ? C.green + "18" : C.sage + "50",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: isExpanded ? C.green : C.forest + "50" }}>
                        {ti + 1}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: C.forest, fontWeight: 600, fontSize: 13, margin: "0 0 1px" }}>
                      {tier.label}
                    </p>
                    <p style={{ color: C.forest + "55", fontSize: 12, margin: 0 }}>
                      {isDone
                        ? `Seçildi: En yakın ${chosen} TL`
                        : tier.example}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6" stroke={C.forest + "60"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isExpanded && (
                  <div style={{ padding: "0 0.75rem 0.75rem", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tier.options.map(opt => {
                      const isSel = chosen === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => select(tier.id, opt.key)}
                          style={{
                            flex: "1 1 calc(33% - 8px)",
                            minWidth: 90,
                            padding: "0.6rem 0.5rem",
                            borderRadius: 10,
                            border: `1.5px solid ${isSel ? C.green : C.sage}`,
                            backgroundColor: isSel ? C.green + "12" : "transparent",
                            cursor: "pointer",
                            textAlign: "center",
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                        >
                          <p style={{ color: isSel ? C.green : C.forest, fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>
                            {opt.label}
                          </p>
                          <p style={{ color: C.forest + "55", fontSize: 11, margin: "0 0 1px" }}>{opt.ex}</p>
                          <p style={{
                            color: isSel ? C.green : C.mint,
                            fontSize: 11, fontWeight: 600, margin: 0,
                          }}>{opt.roundup}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!allSelected || saving}
          style={{
            width: "100%", padding: "0.8rem",
            borderRadius: 10, border: "none",
            backgroundColor: allSelected && !saving ? C.green : C.sage,
            color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: allSelected && !saving ? "pointer" : "not-allowed",
            transition: "background-color 0.2s", fontFamily: "inherit",
          }}
        >
          {saving ? "Kaydediliyor..." : allSelected ? "Devam Et" : `${4 - completedCount} aralık daha kaldı`}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: C.forest + "45", marginTop: "0.9rem" }}>
          Ayarlar sayfasından istediğin zaman değiştirebilirsin.
        </p>
      </div>
    </div>
  );
}
