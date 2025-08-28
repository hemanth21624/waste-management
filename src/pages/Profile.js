
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Card from "../components/Card";
import Modal from "../components/Modal";

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [reports, setReports] = useState([]);


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("wm_reports") || "[]");
    setReports(r);
  }, []);

  function saveName() {
    const trimmed = name.trim() || "Anonymous";
    const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
    profile.name = trimmed;
    localStorage.setItem("wm_profile", JSON.stringify(profile));

    
    if (user) {
      const newUser = { ...user, name: trimmed };
      setUser(newUser);
      localStorage.setItem("wm_user", JSON.stringify(newUser));
    }
    alert("Name saved");
  }

  function markResolved(id) {
    const updated = reports.map((r) => (r.id === id ? { ...r, status: "resolved" } : r));
    setReports(updated);
    localStorage.setItem("wm_reports", JSON.stringify(updated));
  }

  function requestDelete(id) {
    setReportToDelete(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    const id = reportToDelete;
    if (!id) {
      setConfirmOpen(false);
      return;
    }
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("wm_reports", JSON.stringify(updated));
    setReportToDelete(null);
    setConfirmOpen(false);
  }

  function cancelDelete() {
    setReportToDelete(null);
    setConfirmOpen(false);
  }

  function downloadImage(r) {
    if (!r.photo) return alert("No image attached.");
    const a = document.createElement("a");
    a.href = r.photo;
    const time = new Date(r.createdAt).toISOString().replace(/[:.]/g, "-");
    a.download = `wastewise-report-${time}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="page container profile-page">
      <div className="page-head">
        <h2>My Profile</h2>
        <p className="muted">Manage your display name, view submitted reports, and track impact.</p>
      </div>

      <div className="profile-grid">
        <Card className="profile-card">
          <div style={{display:"flex", gap:12, alignItems:"center"}}>
            <div className="avatar" aria-hidden>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="profile-meta" style={{flex:1}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div className="profile-name">{user?.name || "Anonymous"}</div>
                  <div className="muted">EcoPoints: <strong>{(user && user.points) || 0}</strong></div>
                </div>
              </div>

              <div style={{marginTop:12}}>
                <label style={{display:"block", marginBottom:6}}>Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <div style={{marginTop:10, display:"flex", gap:8}}>
                  <button className="btn btn-primary" onClick={saveName}>Save</button>
                  <button className="btn btn-ghost" onClick={() => { logout(); }}>Sign out</button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="reports-card">
          <h3>Your Reports</h3>
          {reports.length === 0 && <div className="empty">You haven't submitted any reports yet.</div>}
          <div className="reports-list" style={{marginTop:12}}>
            {reports.map((r) => (
              <div key={r.id} className={`report-row card ${r.status === "resolved" ? "resolved" : ""}`}>
                <div className="thumb">
                  {r.photo ? (
                    <img src={r.photo} alt="report thumb" />
                  ) : (
                    <div className="empty small">No image</div>
                  )}
                </div>

                <div className="report-info">
                  <div className="report-meta">
                    <div className="area">{r.area || "Unknown area"}</div>
                    <div className="muted">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="report-actions" style={{marginTop:8}}>
                    <button className="btn btn-ghost" onClick={() => downloadImage(r)}>Download</button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => markResolved(r.id)}
                      disabled={r.status === "resolved"}
                    >
                      {r.status === "resolved" ? "Resolved" : "Mark resolved"}
                    </button>
                    <button className="btn btn-danger" onClick={() => requestDelete(r.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={confirmOpen} onClose={cancelDelete} title="Confirm delete">
        <p>Are you sure you want to permanently delete this report? This action cannot be undone.</p>
        <div style={{display:"flex", gap:10, marginTop:12}}>
          <button className="btn btn-danger" onClick={confirmDelete}>Yes, delete</button>
          <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
        </div>
      </Modal>
    </section>
  );
}
