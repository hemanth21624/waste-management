
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";

export default function Community() {
  const { t, lang, setLang } = useLang();

  
  const [room, setRoom] = useState(() => localStorage.getItem("wm_room") || "560001");
  const [name, setName] = useState(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
      return profile.name || "";
    } catch {
      return "";
    }
  });

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const boxRef = useRef(null);

  const storageKey = useCallback((r) => `wm_chat_${r}`, []);

  
  const load = useCallback(() => {
    setLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem(storageKey(room)) || "[]");
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
      }, 80);
    }
  }, [room, storageKey]);

  
  useEffect(() => {
    load();
  }, [load]);

  
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(room), JSON.stringify(messages));
    } catch {
    
    }
  }, [messages, room, storageKey]);

  
  useEffect(() => {
    localStorage.setItem("wm_room", room);
  }, [room]);

  
  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
      profile.name = name;
      localStorage.setItem("wm_profile", JSON.stringify(profile));
    } catch {
      
    }
  }, [name]);

  function sendMessage(e) {
    e && e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const newMsg = { id: Date.now(), author: name || "Anonymous", text: trimmed, ts: Date.now() };
    setMessages((prev) => [newMsg, ...prev]);
    setText("");
    
    setTimeout(() => {
      if (boxRef.current) boxRef.current.scrollTop = 0;
    }, 50);
  }

  function clearRoomMessages() {
    if (!window.confirm) {
      
    }
    if (window.confirm("Clear all messages for this room?")) {
      setMessages([]);
      localStorage.removeItem(storageKey(room));
    }
  }

  return (
    <section className="page container community-page">
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2>{t("community_title")}</h2>
          <p className="muted">{t("community_lead")}</p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <small className="muted">Language</small>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </label>
        </div>
      </div>

      <div className="community-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <aside className="panel card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>Area / Pincode</label>
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="560001" />
          <label>Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => { localStorage.setItem("wm_room", room); load(); }}>Switch</button>
            <button className="btn btn-ghost" onClick={() => { setName(""); localStorage.removeItem("wm_profile"); }}>Clear Name</button>
          </div>

          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => load()}>Reload</button>
            <button className="btn btn-danger" onClick={clearRoomMessages}>Clear Room</button>
          </div>
        </aside>

        <main className="panel card" style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
          <div ref={boxRef} className="chat-area" style={{ overflow: "auto", padding: 12, display: "flex", flexDirection: "column-reverse", gap: 10 }}>
            {loading ? (
              <div className="muted">{t("loading") || "Loading..."}</div>
            ) : messages.length === 0 ? (
              <div className="muted">{t("community_noMessages")}</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`chat-line card ${m.author === name ? "me" : "other"}`} style={{ padding: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong>{m.author}</strong>
                    <small className="muted">{new Date(m.ts).toLocaleString()}</small>
                  </div>
                  <div style={{ marginTop: 6 }}>{m.text}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("community_placeholder")}
              style={{ flex: 1, padding: 10, borderRadius: 8 }}
            />
            <button className="btn btn-primary" type="submit">{t("community_send")}</button>
          </form>
        </main>
      </div>
    </section>
  );
}
