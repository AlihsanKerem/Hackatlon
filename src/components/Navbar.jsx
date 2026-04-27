import React from "react";
import { useNavigate } from "react-router-dom";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

export default function Navbar({ title, showBack = false }) {
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: C.forest,
      padding: "0 1rem",
      display: "flex", alignItems: "center",
      height: 52, flexShrink: 0, gap: 12,
      position: "sticky", top: 0, zIndex: 50
    }}>
      {showBack && (
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          color: C.sage, padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke={C.sage} strokeWidth="1.2"/>
          <path d="M9.5 9.5C9.5 8.67 10.17 8 11 8h2c.83 0 1.5.67 1.5 1.5S13.83 11 13 11h-2c-.83 0-1.5.67-1.5 1.5S10.17 14 11 14h2c.83 0 1.5-.67 1.5-1.5" stroke={C.green} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M12 6v2M12 16v2" stroke={C.mint} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span style={{ color: C.cream, fontWeight: 600, fontSize: 15 }}>ParaÜstü</span>
      </div>
      {title && (
        <>
          <span style={{ color: C.cream, fontSize: 14, marginLeft: 4, opacity: 0.5 }}>/</span>
          <span style={{ color: C.cream, fontSize: 14, fontWeight: 500 }}>{title}</span>
        </>
      )}
      
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          backgroundColor: C.green + "30",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 600, color: C.green,
        }}>
          AK
        </div>
      </div>
    </nav>
  );
}
