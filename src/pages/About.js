
import React from "react";
import Card from "../components/Card";
import { useLang } from "../contexts/LanguageContext";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function About() {
  const { t } = useLang();

  return (
    <section className="page container about-page">
      <header className="page-head">
        <h2>{t("about_title")}</h2>
        <p className="muted">{t("about_lead")}</p>
      </header>

      {}
      <div className="about-grid">
        <Card className="about-card">
          <h3>{t("about_mission")}</h3>
          <p>
            Empower citizens to actively participate in keeping their communities clean
            and help authorities act faster with reliable reports.
          </p>
        </Card>

        <Card className="about-card">
          <h3>{t("about_how")}</h3>
          <ol style={{ paddingLeft: "1.2rem" }}>
            <li>📸 Capture or upload evidence</li>
            <li>📊 Reports reach municipal dashboards (demo integration)</li>
            <li>🌱 Community verifies & earns EcoPoints</li>
          </ol>
        </Card>

        <Card className="about-card">
          <h3>{t("about_team")}</h3>
          <p>
            Our initiative is powered by community volunteers, municipal partners,
            and NGOs, working together for sustainable change. (Demo Project)
          </p>
        </Card>
      </div>

      {}
      <div className="contact-section" style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>📬 {t("about_contact") || "Contact Us"}</h3>

        <div className="contact-grid" style={{ display: "grid", gap: "1rem" }}>
          <Card className="contact-card" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Mail size={20} /> 
            <span>support@ecoreport.org</span>
          </Card>

          <Card className="contact-card" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Phone size={20} /> 
            <span>+91 98765 43210</span>
          </Card>

          <Card className="contact-card" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MapPin size={20} /> 
            <span>Hyderabad, Telangana, India</span>
          </Card>

          <Card className="contact-card" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Globe size={20} /> 
            <a href="https://ecoreport.org" target="_blank" rel="noopener noreferrer">
              www.ecoreport.org
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}
