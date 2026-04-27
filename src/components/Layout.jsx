import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 70 }}>
      <Outlet />
      <BottomNav />
    </div>
  );
}
