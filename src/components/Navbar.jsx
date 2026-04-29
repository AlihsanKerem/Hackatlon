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
        <img src="/logo.png" alt="ParaÜstü" style={{ width: 28, height: 28, objectFit: "contain" }} />
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
