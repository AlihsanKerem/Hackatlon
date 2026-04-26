import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CreditCard, Zap, Settings } from "lucide-react";

const C = {
  forest: "#012619",
  green:  "#4EA664",
  mint:   "#78BF9E",
  sage:   "#A9D9C2",
  cream:  "#E8E5DE",
};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Ana Sayfa", path: "/dashboard", icon: LayoutDashboard },
    { id: "cards", label: "Kartlar", path: "/cards", icon: CreditCard },
    { id: "automation", label: "Otomasyon", path: "/automation", icon: Zap },
    { id: "settings", label: "Ayarlar", path: "/settings", icon: Settings },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      backgroundColor: "#fff",
      borderTop: `1px solid ${C.sage}`,
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 env(safe-area-inset-bottom)",
      zIndex: 100,
    }}>
      {navItems.map(item => {
        const active = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", padding: "4px 8px",
              cursor: "pointer",
              color: active ? C.green : C.forest + "60",
              transition: "all 0.2s",
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
