// src/pages/Scoreboard.js
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useLang } from "../contexts/LanguageContext";

export default function Scoreboard() {
  const { t } = useLang();
  const [board, setBoard] = useState([]);

  useEffect(()=> {
    const profile = JSON.parse(localStorage.getItem("wm_profile")||'{}');
    const storedBoard = JSON.parse(localStorage.getItem("wm_board")||'null');
    if (storedBoard) { setBoard(storedBoard); return; }
    const mock = [
      {name: "Aarav", points: 420},
      {name: "Priya", points: 390},
      {name: profile.name || "You", points: profile.points || 10},
      {name: "Rohan", points: 240},
    ];
    setBoard(mock);
  }, []);

  return (
    <section className="page container scoreboard-page">
      <header className="page-head">
        <h2>{t("scoreboard_title")}</h2>
        <p className="muted">{t("scoreboard_lead")}</p>
      </header>

      <div className="leaderboard">
        {board.map((u, i) => (
          <Card className={`leader ${i===0 ? 'top': ''}`} key={u.name}>
            <div className="leader-left">
              <div className="rank">#{i+1}</div>
              <div className="meta">
                <div className="name">{u.name}</div>
                <div className="sub muted">{t("scoreboard_contributor")}</div>
              </div>
            </div>
            <div className="score">{u.points} pts</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
