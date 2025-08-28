
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useLang } from "../contexts/LanguageContext";

export default function Navbar({ onToggleTheme, isDark }) {
  const { user, logout } = React.useContext(AuthContext);
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner container">
        <div className="brand">
          <div className="logo" aria-hidden>♻</div>
          <div>
            <div className="brand-title">WasteWatch</div>
            <div className="brand-sub">{t("home_lead")}</div>
          </div>
        </div>

        <nav aria-label="Primary">
          <ul className="nav-list">
            <li><NavLink to="/" end className={({isActive}) => isActive ? "active":""}>{t("nav_home")}</NavLink></li>
            <li><NavLink to="/report" className={({isActive}) => isActive ? "active":""}>{t("nav_report")}</NavLink></li>
            <li><NavLink to="/scoreboard" className={({isActive}) => isActive ? "active":""}>{t("nav_scoreboard")}</NavLink></li>
            <li><NavLink to="/community" className={({isActive}) => isActive ? "active":""}>{t("nav_community")}</NavLink></li>
            <li><NavLink to="/violations" className={({isActive}) => isActive ? "active":""}>{t("nav_violations")}</NavLink></li>
            <li><NavLink to="/about" className={({isActive}) => isActive ? "active":""}>{t("nav_about")}</NavLink></li>
          </ul>
        </nav>

        <div className="nav-actions" style={{display:"flex", gap:10, alignItems:"center"}}>
          <select
            aria-label="Select language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{padding:8, borderRadius:8, border:"1px solid rgba(0,0,0,0.06)"}}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>

          <button className="icon-btn" onClick={onToggleTheme} title={t("nav_theme")}>{isDark ? "🌙": "☀️"}</button>

          {user ? (
            <div className="profile-inline">
              <NavLink to="/profile" className="profile-link" title={t("nav_profile")}>
                <div className="avatar-small" aria-hidden>{(user.name||"U").charAt(0).toUpperCase()}</div>
                <span className="profile-name">{user.name}</span>
              </NavLink>
              <button className="btn btn-ghost" onClick={doLogout}>{t("nav_logout")}</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate("/login")}>{t("nav_signin")}</button>
          )}
        </div>
      </div>
    </header>
  );
}
