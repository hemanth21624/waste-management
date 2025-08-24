// src/pages/Home.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Card from "../components/Card";
import { useLang } from "../contexts/LanguageContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { t } = useLang();
  const [counts, setCounts] = useState({ reports: 0, resolved: 0, volunteers: 0 });
  const [latest, setLatest] = useState([]);

  function animateTo(target, setter, key, startValue = 0) {
    const start = startValue;
    const duration = 800;
    const startTime = performance.now();
    const step = (tme) => {
      const p = Math.min((tme - startTime) / duration, 1);
      setter((prev) => ({ ...prev, [key]: Math.round(start + (target - start) * p) }));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("wm_reports") || "[]");
    const totalReports = reports.length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const volunteers = 1050;

    animateTo(totalReports, setCounts, "reports", counts.reports || 0);
    animateTo(resolved, setCounts, "resolved", counts.resolved || 0);
    animateTo(volunteers, setCounts, "volunteers", counts.volunteers || 0);

    setLatest(reports.slice(0, 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="page container home-page">
      <div className="hero-advanced card" style={{ display: "flex", gap: 18, padding: 24, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{t("home_greeting")}{user ? ` — ${user.name}` : ""}</h1>
          <p className="muted">{t("home_lead")}</p>

          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <a className="btn btn-primary" href="/report">{t("home_reportNow")}</a>
            <a className="btn btn-ghost" href="/community">{t("home_findCommunity")}</a>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <Card className="stat" style={{ minWidth: 140 }}>
              <div className="stat-num" style={{ fontSize: 20 }}>{counts.reports}</div>
              <div className="stat-label">{t("home_reports")}</div>
            </Card>
            <Card className="stat" style={{ minWidth: 140 }}>
              <div className="stat-num" style={{ fontSize: 20 }}>{counts.resolved}</div>
              <div className="stat-label">{t("home_resolved")}</div>
            </Card>
            <Card className="stat" style={{ minWidth: 140 }}>
              <div className="stat-num" style={{ fontSize: 20 }}>{counts.volunteers}</div>
              <div className="stat-label">{t("home_volunteers")}</div>
            </Card>
          </div>
        </div>

        <div style={{ width: 360 }}>
          <div style={{ borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: 14, background: "linear-gradient(135deg,#42d392,#3aa3ff)", color: "#041424", fontWeight: 700 }}>
              {t("home_liveActivity")}
            </div>
            <div style={{ padding: 12, background: "linear-gradient(180deg,#fff,#f8fbff)" }}>
              {latest.length === 0 && <div className="muted">{t("home_noReports")}</div>}
              {latest.map((r, i) => (
                <div key={r.id || i} style={{ display: "flex", gap: 10, padding: "8px 0", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 56, height: 40, background: "#e6f7ef", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {r.video ? "🎥" : "📸"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{r.area || "Unknown area"}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        <Card className="card">
          <h3>{t("home_upcomingEvents")}</h3>
          <p className="muted">Mocked events list — build an events backend to drive real RSVPs</p>
          <ul>
            <li>Sun, Sep 14 — Lake Shore Cleanup • 9:00 AM</li>
            <li>Sat, Sep 20 — Market Area Sweep • 7:30 AM</li>
            <li>Sun, Oct 5 — Awareness Drive • 10:00 AM</li>
          </ul>
        </Card>

        <Card className="card">
          <h3>{t("home_yourImpact")}</h3>
          <p className="muted">Track points and badges earned through reports.</p>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="muted">{t("home_ecoPoints")}</div>
              <div style={{ fontWeight: 700 }}>{(user && user.points) || 0}</div>
            </div>
            <div style={{ height: 10, background: "#eef2f6", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(((user && user.points) || 0), 500) / 5}%`, background: "linear-gradient(90deg,#42d392,#3aa3ff)", height: "100%" }} />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
