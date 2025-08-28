
import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useLang } from "../contexts/LanguageContext";

export default function Violations() {
  const { t } = useLang();
  const [reports, setReports] = useState([]);
  const [blur, setBlur] = useState(true);
  const [modal, setModal] = useState({ open: false, idx: 0 });
  const [videoUrls, setVideoUrls] = useState({});
  const [errorMap, setErrorMap] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wm_reports") || "[]");
    setReports(Array.isArray(stored) ? stored : []);
  }, []);

  
  function dataURLtoBlob(dataURL) {
    try {
      const [meta, base64] = dataURL.split(",");
      const mime = meta.match(/:(.*?);/)[1] || "video/mp4";
      const binary = atob(base64);
      const len = binary.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
      return new Blob([u8], { type: mime });
    } catch (e) {
      console.error("dataURLtoBlob failed", e);
      return null;
    }
  }

  
  useEffect(() => {
    const newMap = {};
    const newErr = {};

    reports.forEach((r, idx) => {
      if (!r.video) return;
      const id = r.id || idx;
      const v = r.video;

      if (typeof v === "string") {
        if (v.startsWith("blob:") || v.startsWith("http")) {
          newMap[id] = v;
        } else if (v.startsWith("data:")) {
          const blob = dataURLtoBlob(v);
          if (blob) {
            newMap[id] = URL.createObjectURL(blob);
          } else {
            newErr[id] = "Invalid video data.";
          }
        }
      }
    });

    setVideoUrls(newMap);
    setErrorMap(newErr);

    return () => {
      Object.values(newMap).forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [reports]);


  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    const newReports = reports.filter((r, idx) => (r.id || idx) !== id);
    setReports(newReports);
    localStorage.setItem("wm_reports", JSON.stringify(newReports));

    
    setVideoUrls((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setErrorMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  return (
    <section className="page container violations-page">
      <header className="page-head">
        <h2>{t("violations_title")}</h2>
        <p className="muted">{t("violations_lead")}</p>
      </header>

      {/* Blur toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label className="switch">
          <input
            type="checkbox"
            checked={blur}
            onChange={() => setBlur((v) => !v)}
          />
          <span className="slider" />
        </label>
        <div className="muted">{t("violations_blur")}</div>
      </div>

      {/* Cards grid */}
      <div className="violations-grid">
        {reports.length === 0 && (
          <div className="muted">{t("violations_noMedia")}</div>
        )}

        {reports.map((r, i) => {
          const id = r.id || i;
          const vidUrl = videoUrls[id];
          return (
            <div key={id} className="violation-card card">
              <div
                className="media"
                style={{
                  filter: blur ? "blur(6px)" : "none",
                  minHeight: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {r.video ? (
                  vidUrl ? (
                    <video
                      src={vidUrl}
                      controls
                      playsInline
                      style={{ width: "100%", maxHeight: 360 }}
                      onError={() =>
                        setErrorMap((prev) => ({
                          ...prev,
                          [id]:
                            "Video format not supported in this browser. Try MP4.",
                        }))
                      }
                    />
                  ) : (
                    <div className="muted">Preparing video...</div>
                  )
                ) : r.photo ? (
                  <img
                    src={r.photo}
                    alt="violation"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="empty">No media</div>
                )}
              </div>

              <div className="meta">
                <div className="time">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="status">{r.status}</div>
                <div className="actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setModal({ open: true, idx: i })}
                  >
                    {t("violations_view")}
                  </button>

                  {/* ✅ Delete button */}
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </div>
                {errorMap[id] && (
                  <div className="muted" style={{ color: "#c0392b" }}>
                    {errorMap[id]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, idx: 0 })}
        title={t("violations_title")}
      >
        {reports[modal.idx] ? (
          <div>
            {videoUrls[reports[modal.idx].id || modal.idx] ? (
              <video
                src={videoUrls[reports[modal.idx].id || modal.idx]}
                controls
                playsInline
                style={{ maxWidth: "100%", borderRadius: 10 }}
              />
            ) : reports[modal.idx].photo ? (
              <img
                src={reports[modal.idx].photo}
                alt="full"
                style={{ maxWidth: "100%", borderRadius: 10 }}
              />
            ) : (
              <div className="muted">{t("violations_noMedia")}</div>
            )}
            <p className="muted" style={{ marginTop: 8 }}>
              Area: {reports[modal.idx].area || "Unknown"} • Submitted:{" "}
              {new Date(reports[modal.idx].createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="muted">{t("violations_noMedia")}</div>
        )}
      </Modal>
    </section>
  );
}
