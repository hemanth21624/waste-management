import React, { useRef, useState, useEffect } from "react";
import { useLang } from "../contexts/LanguageContext";
import Modal from "../components/Modal";

export default function Report() {
  const { t } = useLang();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [geoStatus, setGeoStatus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // New states
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [stream, videoPreviewUrl]);

  async function startCamera() {
    setStatusMsg("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error(e);
      setStatusMsg(t("recordingUnsupported"));
    }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoPreview(data);
    canvasRef.current = canvas;
  }

  function startRecording() {
    if (!stream) return setStatusMsg(t("recordingUnsupported"));
    setRecordedChunks([]);
    try {
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8,opus" });
      mr.ondataavailable = (e) => e.data && e.data.size > 0 && setRecordedChunks((prev) => prev.concat(e.data));
      mr.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);
        window._lastVideoBlob = blob;
        setStatusMsg(t("recordingSaved"));
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch (err) {
      console.error(err);
      setStatusMsg(t("recordingUnsupported"));
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    setRecording(false);
    setMediaRecorder(null);
  }

  async function blobToDataURL(blob) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });
  }

  // Get location when clicking 📍 map
  function fetchLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setCoords(c);
          window.open(`https://www.google.com/maps?q=${c.lat},${c.lon}`, "_blank");
        },
        () => setGeoStatus(t("geoUnavailable")),
        { enableHighAccuracy: true }
      );
    } else {
      setGeoStatus(t("geoUnavailable"));
    }
  }

  async function submitReport(e) {
    e?.preventDefault();
    setSubmitting(true);

    const payload = {
      id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
      createdAt: Date.now(),
      area: "demo area",
      status: "pending",
      photo: photoPreview || null,
      video: null,
      description: description.trim() || null, // store description
      location: coords,
    };

    if (window._lastVideoBlob) {
      try {
        payload.video = await blobToDataURL(window._lastVideoBlob);
      } catch (err) {
        console.error("Failed to convert video:", err);
      }
    }

    const reports = JSON.parse(localStorage.getItem("wm_reports") || "[]");
    reports.unshift(payload);
    localStorage.setItem("wm_reports", JSON.stringify(reports));

    const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
    profile.points = (profile.points || 0) + 10;
    localStorage.setItem("wm_profile", JSON.stringify(profile));

    setSubmitting(false);
    setStatusMsg(t("submitSuccess"));
    setModalOpen(true);
    setPhotoPreview(null);
    setDescription("");
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    window._lastVideoBlob = null;
  }

  return (
    <section className="page container report-page">
      <h2>{t("reportTitle")}</h2>
      <p className="muted">{t("reportSubtitle")}</p>

      <div className="report-grid">
        {/* Camera Section */}
        <div className="camera-card card">
          <div className="camera-stage" style={{ position: "relative", height: 340 }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {!stream && <div className="camera-placeholder">{t("startCamera")}</div>}
          </div>

          <div className="controls" style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={startCamera}>{t("startCamera")}</button>
            <button className="btn btn-ghost" onClick={capturePhoto} disabled={!stream}>{t("capturePhoto")}</button>
            {!recording ? (
              <button className="btn btn-primary" onClick={startRecording} disabled={!stream}>{t("startRecording")}</button>
            ) : (
              <button className="btn btn-danger" onClick={stopRecording}>{t("stopRecording")}</button>
            )}
          </div>
          {statusMsg && <div className="muted">{statusMsg}</div>}
        </div>

        {/* Preview + Description */}
        <div className="preview-card card">
          <h3>{t("preview")}</h3>

          {/* Description input */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description of violation..."
            style={{ width: "100%", minHeight: 70, marginBottom: 10, padding: 8, borderRadius: 6 }}
          />

          {/* Show current time */}
          <p className="muted">🕒 Time: {new Date().toLocaleString()}</p>

          {/* Map Button */}
          <button className="btn btn-ghost" onClick={fetchLocation}>📍 Show Location</button>

          {photoPreview && <img src={photoPreview} alt="preview" style={{ width: "100%", borderRadius: 10, marginTop: 12 }} />}
          {videoPreviewUrl && (
            <video ref={previewVideoRef} src={videoPreviewUrl} controls style={{ width: "100%", marginTop: 12, borderRadius: 10 }} />
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={submitReport} disabled={submitting || (!photoPreview && !window._lastVideoBlob)}>{t("submitReport")}</button>
            <button className="btn btn-ghost" onClick={() => { setPhotoPreview(null); setVideoPreviewUrl(null); window._lastVideoBlob = null; setDescription(""); }}>Clear</button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t("submitReport")}>
        <p>{t("submitSuccess")}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <a className="btn btn-primary" href="/violations">View Violations</a>
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Close</button>
        </div>
      </Modal>
    </section>
  );
}