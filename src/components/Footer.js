// src/components/Footer.js
import React from "react";
import { useLang } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>{t("footer_copy")}</div>
        <div className="footer-links">
          <a href="/about">{t("footer_about")}</a>
          <a href="/report">{t("footer_report")}</a>
          <a href="/scoreboard">{t("footer_leaderboard")}</a>
        </div>
      </div>
    </footer>
  );
}
