// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import RoundingSplash from "./pages/RoundingSplash";
import Dashboard      from "./pages/Dashboard";
import Cards          from "./pages/Cards";
import Automation     from "./pages/Automation";
import Settings       from "./pages/Settings";
import Checkout       from "./pages/Checkout";
import Transactions   from "./pages/Transactions";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/cards"      element={<Cards />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/settings"   element={<Settings />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
            {/* Ödeme sayfaları — BottomNav olmadan */}
            <Route path="/checkout"   element={<Checkout />} />
            <Route path="/onboarding" element={<RoundingSplash />} />
          </Route>

          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
