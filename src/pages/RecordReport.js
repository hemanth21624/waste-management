
import React, { useRef, useState } from "react";

export default function RecordReport() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const chunksRef = useRef([]);
  const [mimeType, setMimeType] = useState("video/webm");

  
  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera: " + err.message);
    }
  }

  
  function startRecording() {
    if (!stream) return;

    
    let options = { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm;codecs=vp8,opus" };
    }

    setMimeType(options.mimeType);
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: options.mimeType });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      
      const reports = JSON.parse(localStorage.getItem("wm_reports") || "[]");
      const newReport = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        video: url, 
        mimeType: options.mimeType,
        status: "Submitted",
      };
      reports.push(newReport);
      localStorage.setItem("wm_reports", JSON.stringify(reports));
    };

    recorder.start();
    setRecording(true);
  }

  
  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  return (
    <section className="page container">
      <h2>Record Violation Report</h2>

      {!stream ? (
        <button onClick={startCamera} className="btn">
          Start Camera
        </button>
      ) : (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", maxHeight: 300, borderRadius: 8 }}
          />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {!recording ? (
          <button onClick={startRecording} disabled={!stream} className="btn btn-primary">
            🎥 Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="btn btn-danger">
            ⏹ Stop Recording
          </button>
        )}
      </div>

      {videoURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview</h3>
          <video
            src={videoURL}
            controls
            playsInline
            style={{ width: "100%", maxHeight: 360, borderRadius: 8 }}
          />
          <p className="muted">Saved as {mimeType}</p>
        </div>
      )}
    </section>
  );
}