// src/App.js
import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./styles/global.css";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Report = lazy(() => import("./pages/Report"));
const Scoreboard = lazy(() => import("./pages/Scoreboard"));
const Community = lazy(() => import("./pages/Community"));
const Violations = lazy(() => import("./pages/Violations"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));

/**
 * ScrollToTop - small helper to scroll to top on route change.
 * Must be placed inside Router.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

/** Simple NotFound fallback page */
function NotFound() {
  return (
    <div className="container" style={{ padding: 48 }}>
      <div className="card" style={{ textAlign: "center" }}>
        <h2>404 — Page not found</h2>
        <p className="muted">We couldn't find the page you were looking for.</p>
        <div style={{ marginTop: 16 }}>
          <a className="btn btn-primary" href="/">Go to Home</a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [prefersDark, setPrefersDark] = useState(() => {
    const v = localStorage.getItem("theme");
    if (v) return v === "dark";
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  }, [prefersDark]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Navbar onToggleTheme={() => setPrefersDark(p => !p)} isDark={prefersDark} />

          <main className="app-container" role="main">
            <Suspense fallback={<div className="loading">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <Report />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Public routes */}
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/violations" element={<Violations />} />
                <Route path="/about" element={<About />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
