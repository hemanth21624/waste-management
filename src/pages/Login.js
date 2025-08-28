
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";



function readUsers() {
  try {
    return JSON.parse(localStorage.getItem("wm_users") || "[]");
  } catch {
    return [];
  }
}
function writeUsers(arr) {
  localStorage.setItem("wm_users", JSON.stringify(arr));
}
function findUserByEmail(email) {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}
function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || { pathname: "/" };

  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  
  function validEmail(e) {
    return /\S+@\S+\.\S+/.test(e || "");
  }

  
  async function onSignIn(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !password) {
      setError("Please provide email and password.");
      return;
    }
    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      setError("Invalid credentials. Try again or sign up.");
      setLoading(false);
      return;
    }

    
    await login({ username: user.name || user.email.split("@")[0], remember });
    setLoading(false);
    navigate(from, { replace: true });
  }

  
  async function onSignUp(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!suName.trim()) {
      setError("Please enter your display name.");
      return;
    }
    if (!validEmail(suEmail)) {
      setError("Please enter a valid email for sign up.");
      return;
    }
    if (suPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (suPassword !== suConfirm) {
      setError("Passwords do not match.");
      return;
    }

    const existing = findUserByEmail(suEmail);
    if (existing) {
      setError("An account with this email already exists. Please sign in.");
      return;
    }

    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const users = readUsers();
    const newUser = { id: makeId(), email: suEmail.toLowerCase(), password: suPassword, name: suName.trim() };
    users.push(newUser);
    writeUsers(users);

    
    const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
    profile.name = newUser.name;
    profile.points = profile.points || 0;
    localStorage.setItem("wm_profile", JSON.stringify(profile));

    
    await login({ username: newUser.name, remember });
    setLoading(false);
    navigate("/", { replace: true });
  }

  
  async function onGoogleSignIn() {
    setError("");
    setInfo("");
    setLoading(true);
    
    await new Promise((r) => setTimeout(r, 800));
    
    const fakeEmail = `user${Math.floor(Math.random() * 1000)}@gmail.com`;
    const fakeName = fakeEmail.split("@")[0].replace(/\d+/, "");
    
    let users = readUsers();
    let user = findUserByEmail(fakeEmail);
    if (!user) {
      user = { id: makeId(), email: fakeEmail, password: "", name: fakeName };
      users.push(user);
      writeUsers(users);
    }
    
    const profile = JSON.parse(localStorage.getItem("wm_profile") || "{}");
    profile.name = user.name;
    profile.points = profile.points || 0;
    localStorage.setItem("wm_profile", JSON.stringify(profile));

    
    await login({ username: user.name, remember: true });
    setLoading(false);
    navigate(from, { replace: true });
  }

  
  function onForgotPassword(e) {
    e.preventDefault();
    setForgotMsg("");
    if (!validEmail(forgotEmail)) {
      setForgotMsg("Enter a valid email to receive a reset link (demo).");
      return;
    }
    const user = findUserByEmail(forgotEmail);
    if (!user) {
      setForgotMsg("No account found for that email.");
      return;
    }
    
    const token = makeId() + "-" + Date.now().toString(36);
    const tokens = JSON.parse(localStorage.getItem("wm_reset_tokens") || "{}");
    tokens[forgotEmail.toLowerCase()] = token;
    localStorage.setItem("wm_reset_tokens", JSON.stringify(tokens));
    setForgotMsg(`Password reset link (demo) created. Token: ${token}`);
  }

  return (
    <section className="page container auth-page">
      <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18 }}>
        <div className="auth-card card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0 }}>{mode === "signin" ? "Welcome back" : "Create an account"}</h2>
              <div className="muted" style={{ marginTop: 6 }}>
                {mode === "signin"
                  ? "Sign in to manage reports, chat with community, and earn EcoPoints."
                  : "Sign up to start reporting and earn recognition."}
              </div>
            </div>

            <div>
              <button
                className="btn-ghost"
                onClick={() => {
                  setMode((m) => (m === "signin" ? "signup" : "signin"));
                  setError("");
                  setInfo("");
                }}
                title="Switch mode"
              >
                {mode === "signin" ? "Create account" : "Have an account? Sign in"}
              </button>
            </div>
          </div>

          {}
          {mode === "signin" && (
            <form onSubmit={onSignIn} className="auth-form" aria-describedby="err" style={{ marginTop: 14 }}>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

              <label style={{ marginTop: 8 }}>
                Password
                <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted)" }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ padding: "4px 8px", marginLeft: 6 }}
                    onClick={() => setShowPwd((s) => !s)}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password"
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <label className="checkbox-inline" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
                <a
                  href="#forgot"
                  onClick={(ev) => {
                    ev.preventDefault();
                    const emailPrompt = window.prompt("Enter your account email for reset (demo):");
                    if (emailPrompt) {
                      setForgotEmail(emailPrompt);
                      onForgotPassword(ev);
                      setInfo("If the email exists, a reset token was generated (demo).");
                    }
                  }}
                >
                  Forgot password?
                </a>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      
                      setLoading(true);
                      setTimeout(async () => {
                        await login({ username: "Guest", remember: false });
                        setLoading(false);
                        navigate(from, { replace: true });
                      }, 500);
                    }}
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <hr style={{ flex: 1 }} />
                  <small className="muted">or</small>
                  <hr style={{ flex: 1 }} />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button type="button" className="btn" onClick={onGoogleSignIn} disabled={loading}>
                    <img alt="Google" src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 533.5 544.3'><path fill='%23EA4335' d='M533.5 278.4c0-18.6-1.6-37.8-4.9-55.9H272v105.9h147.1c-6.4 34.4-25.3 63.6-54 82.9v68.7h87.2c51-47 80.2-116.2 80.2-201.6z'/><path fill='%234285F4' d='M272 544.3c73.5 0 135.3-24.3 180.4-66.2l-87.2-68.7c-24.2 16.2-55 25.8-93.2 25.8-71.7 0-132.6-48.4-154.5-113.6H30.3v71.3C75.6 487.6 167.5 544.3 272 544.3z'/><path fill='%23FBBC05' d='M117.5 328.7c-10.7-31.6-10.7-65.7 0-97.3V160.1H30.3c-34.6 69.7-34.6 151.5 0 221.2l87.2-52.6z'/><path fill='%2327AE60' d='M272 107.7c39.9 0 75.7 13.7 103.9 40.6l77.9-77.9C407.2 24.3 345.4 0 272 0 167.5 0 75.6 56.7 30.3 160.1l87.2 71.3C139.4 156 200.3 107.7 272 107.7z'/></svg>` } style={{ width: 18, marginRight: 8 }} />
                    Sign in with Google (demo)
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      
                      setInfo("Magic link: (demo) posted to console. Open console to see the link.");
                      console.info("Magic link (demo): http://localhost:3000/magic?token=demo-" + makeId());
                    }}
                  >
                    Email magic link
                  </button>
                </div>
              </div>

              {error && <div id="err" role="alert" className="error" style={{ marginTop: 12 }}>{error}</div>}
              {info && <div className="info" style={{ marginTop: 10 }}>{info}</div>}
            </form>
          )}

          {}
          {mode === "signup" && (
            <form onSubmit={onSignUp} className="auth-form" aria-describedby="err" style={{ marginTop: 14 }}>
              <label>Display name</label>
              <input value={suName} onChange={(e) => setSuName(e.target.value)} placeholder="Your name" />

              <label style={{ marginTop: 8 }}>Email address</label>
              <input value={suEmail} onChange={(e) => setSuEmail(e.target.value)} placeholder="you@example.com" />

              <label style={{ marginTop: 8 }}>Password</label>
              <input type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} placeholder="Choose a password" />

              <label style={{ marginTop: 8 }}>Confirm password</label>
              <input type="password" value={suConfirm} onChange={(e) => setSuConfirm(e.target.value)} placeholder="Repeat your password" />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontSize: 13 }} className="muted">By signing up you agree to the demo terms.</div>
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
              </div>

              {error && <div id="err" role="alert" className="error" style={{ marginTop: 12 }}>{error}</div>}
              {info && <div className="info" style={{ marginTop: 10 }}>{info}</div>}
            </form>
          )}
        </div>

        {}
        <div className="auth-visual card" style={{ padding: 20 }}>
          <h3>Why sign in?</h3>
          <ul style={{ marginTop: 8 }}>
            <li>Save reports & track status</li>
            <li>Earn EcoPoints and climb the leaderboard</li>
            <li>Chat with your neighborhood</li>
          </ul>

          <div style={{ marginTop: 14 }}>
            <h4 style={{ marginBottom: 8 }}>Forgot password (demo)</h4>
            <form onSubmit={onForgotPassword}>
              <input placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-ghost" type="submit">Create reset token</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setForgotEmail(""); setForgotMsg(""); }}>Clear</button>
              </div>
            </form>
            {forgotMsg && <div className="muted" style={{ marginTop: 8 }}>{forgotMsg}</div>}
          </div>

          <div style={{ marginTop: 20 }} className="muted">This demo stores users in your browser's localStorage. In production, replace with a secure backend and OAuth flows.</div>
        </div>
      </div>
    </section>
  );
}
