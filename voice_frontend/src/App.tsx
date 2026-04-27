import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getLiveGenerativeModel,
  ResponseModality,
  startAudioConversation,
} from "firebase/ai";
import { signInAnonymously } from "firebase/auth";
import {
  DEFAULT_STATE_CODE,
  getStateProfile,
  INDIA_STATE_PROFILES,
  LANGUAGE_BY_CODE,
  LANGUAGE_OPTIONS,
} from "./data/indiaStateProfiles";
import {
  buildLanguageSwitchTurn,
  buildOpeningTurn,
  buildSystemInstruction,
  DEMO_PROMPTS,
} from "./lib/healthGuardrails";
import {
  GEMINI_LIVE_MODEL,
  getFirebaseServices,
  hasFirebaseConfig,
} from "./lib/firebase";
import { inferNearestState, requestCurrentPosition } from "./lib/location";
import type {
  CallState,
  LanguageCode,
} from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App() {
  // --- STATE ---
  const [selectedStateCode, setSelectedStateCode] = useState(DEFAULT_STATE_CODE);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<LanguageCode>("hi-IN");
  const [callState, setCallState] = useState<CallState>("idle");
  const [callTimer, setCallTimer] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<"Listening..." | "Thinking..." | "Speaking...">("Listening...");
  const [activeNav, setActiveNav] = useState("Home");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sessionRef = useRef<any>(null);
  const controllerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const selectedState = getStateProfile(selectedStateCode);
  const selectedLanguage = LANGUAGE_BY_CODE[selectedLanguageCode];

  // --- LOGIC ---
  useEffect(() => { handleUseLocation(); }, []);

  async function handleUseLocation() {
    try {
      const coordinates = await requestCurrentPosition();
      setCoords({ lat: coordinates.latitude, lng: coordinates.longitude });
      const nearestState = inferNearestState(coordinates);
      if (nearestState) {
        setSelectedStateCode(nearestState.code);
        setSelectedLanguageCode(nearestState.liveLanguage);
      }
    } catch (e) { console.error(e); }
  }

  async function startCall(promptText?: string) {
    if (!hasFirebaseConfig) return;
    setCallState("connecting");
    setAiStatus("Thinking...");
    const services = getFirebaseServices();
    if (!services) return;
    try {
      if (!services.auth.currentUser) await signInAnonymously(services.auth);
      const liveModel = getLiveGenerativeModel(services.ai, {
        model: GEMINI_LIVE_MODEL,
        systemInstruction: buildSystemInstruction(selectedState, selectedLanguageCode, coords),
        generationConfig: { responseModalities: [ResponseModality.AUDIO] },
      });
      const session = await liveModel.connect();
      const controller = await startAudioConversation(session);
      sessionRef.current = session;
      controllerRef.current = controller;
      setCallState("live");
      setAiStatus("Listening...");
      timerRef.current = window.setInterval(() => setCallTimer(prev => prev + 1), 1000);
      await session.send(promptText || buildOpeningTurn(selectedState, selectedLanguageCode), true);
    } catch (error) {
      console.error(error);
      setCallState("idle");
    }
  }

  async function endCall() {
    if (controllerRef.current) await controllerRef.current.stop();
    if (sessionRef.current) await sessionRef.current.close();
    setCallState("idle");
    setCallTimer(0);
    setIsEmergency(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Home":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--glass)', border: '0.5px solid var(--glass-b)', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', color: 'var(--t2)', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }} /> Welcome Back 👋
              </div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: '42px', fontWeight: 800, color: 'var(--t1)', marginBottom: '12px' }}>I'm JeevanRekha</h1>
              <p style={{ fontSize: '16px', color: 'var(--t2)' }}>How can I help you with your health today?</p>
            </div>
            <div className="orb-container" onClick={() => startCall()} style={{ margin: '0 auto' }}>
              <div className="orb-body" />
            </div>
            <div style={{ marginTop: '48px' }}>
              <button className="btn-aura" onClick={() => startCall()}>🎙 Start Voice Call</button>
              <p style={{ fontSize: '13px', color: 'var(--t2)', marginTop: '16px' }}>Tap to start a real-time voice conversation</p>
            </div>
          </motion.div>
        );
      case "Examples":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '24px', fontFamily: 'var(--fd)' }}>Demo Scenarios</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {DEMO_PROMPTS.map((p, i) => (
                <div key={i} className="aura-card" style={{ cursor: 'pointer' }} onClick={() => startCall(p)}>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>💡</div>
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Health Query {i+1}</p>
                  <p style={{ fontSize: '12.5px', color: 'var(--t2)', lineHeight: 1.5 }}>"{p}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case "History":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>🕐</div>
            <h2 style={{ fontFamily: 'var(--fd)', marginBottom: '12px' }}>Call History</h2>
            <p style={{ color: 'var(--t3)' }}>No recent voice sessions found. Start a call to see logs here.</p>
          </motion.div>
        );
      case "Health Guide":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '24px', fontFamily: 'var(--fd)' }}>Smart Health Guide</h1>
            <div className="aura-card" style={{ background: 'var(--accent-s)', border: '1px solid var(--orb-b)' }}>
               <h3 style={{ marginBottom: '12px' }}>Ayushman Bharat (PM-JAY)</h3>
               <p style={{ fontSize: '14px', lineHeight: 1.6 }}>Learn how to check your eligibility and find empanelled hospitals in {selectedState.name}.</p>
               <button className="btn-aura" style={{ marginTop: '16px', padding: '10px 24px', fontSize: '12px' }}>Read More</button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      
      {/* 1. SIDEBAR */}
      <aside className="sidebar-aura">
        <div className="sidebar-logo">
          <div className="logo-icon">❤</div>
          <div>
            <div className="logo-text">JeevanRekha</div>
            <div style={{ fontSize: '10px', color: 'var(--t3)', marginTop: '1px' }}>AI Voice Health Assistant</div>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { label: "Home", icon: "🏠" },
            { label: "Voice Call", icon: "📞", action: () => startCall() },
            { label: "Examples", icon: "✨" },
            { label: "Health Guide", icon: "📖" },
            { label: "History", icon: "🕐" },
            { label: "Settings", icon: "⚙️", action: () => setIsSettingsOpen(true) }
          ].map(item => (
            <div 
              key={item.label}
              className={`nav-item-aura ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => {
                if (item.label !== "Settings" && item.label !== "Voice Call") setActiveNav(item.label);
                if (item.action) item.action();
              }}
            >
              <div className="nav-glow" />
              <span style={{ fontSize: '17px', position: 'relative', zIndex: 2 }}>{item.icon}</span> 
              <span style={{ position: 'relative', zIndex: 2 }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px 8px', borderTop: '0.5px solid var(--glass-b)' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--glass)', border: '0.5px solid var(--glass-b)', borderRadius: '10px', padding: '12px' }}>
            <span style={{ fontSize: '14px' }}>🔒</span>
            <div>
              <div style={{ color: 'var(--t2)', fontWeight: 500, fontSize: '11px' }}>Safe & Confidential</div>
              <div style={{ fontSize: '11px', color: 'var(--t3)', lineHeight: 1.5 }}>Private & Encrypted.</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN */}
      <main className="main-aura">
        <AnimatePresence mode="wait">
          {callState === "idle" ? renderContent() : (
            <motion.div key="call" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'var(--night)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '24px', left: '32px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(45,206,168,0.12)', border: '0.5px solid rgba(45,206,168,0.25)', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', color: 'var(--success)' }}>
                Live · {formatTime(callTimer)}
              </div>
              <div style={{ position: 'absolute', top: '24px', right: '32px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass)', border: '0.5px solid var(--glass-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={endCall}>✕</div>
              <h1 style={{ fontFamily: 'var(--fd)', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{aiStatus}</h1>
              <p style={{ color: 'var(--t2)', marginBottom: '60px' }}>How can I help you today?</p>
              <div className="orb-container"><div className={`orb-body ${aiStatus === "Listening..." ? "listening" : aiStatus === "Thinking..." ? "thinking" : "speaking"}`} style={{ width: '240px', height: '240px' }} /></div>
              <div style={{ position: 'absolute', bottom: '60px' }}><button className="btn-aura" style={{ background: 'var(--danger)', padding: '18px 48px' }} onClick={endCall}>📞 End Call</button></div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. RIGHT PANEL */}
      <aside className="right-panel-aura" style={{ width: 'var(--right-w)', background: 'var(--deep)', borderLeft: '0.5px solid var(--glass-b)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', position: 'relative' }}>
          <div style={{ fontSize: '11px', color: 'var(--success)', background: 'rgba(45,206,168,0.1)', padding: '4px 10px', borderRadius: '100px', cursor: 'pointer' }} onClick={() => alert("Latency: 120ms\nModel: Gemini 2.5 Flash\nStatus: Healthy")}>Live · 00:32</div>
          <div 
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--orb-b), var(--orb-c))', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: '2px solid var(--glass-b)' }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >A</div>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="aura-card" style={{ position: 'absolute', top: '45px', right: 0, width: '180px', zIndex: 100, padding: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>Guest Account</p>
                <div style={{ fontSize: '12px', color: 'var(--t2)', cursor: 'pointer', marginBottom: '8px' }}>👤 Profile Settings</div>
                <div style={{ fontSize: '12px', color: 'var(--t2)', cursor: 'pointer', marginBottom: '8px' }}>☁️ Cloud Sync</div>
                <div style={{ fontSize: '12px', color: 'var(--danger)', cursor: 'pointer' }}>🚪 Sign Out</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="aura-card">
          <p style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Your Location</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>📍</span>
            <div><p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedState.name}</p><p style={{ fontSize: '11px', color: 'var(--t2)' }}>GPS Connected</p></div>
          </div>
        </div>

        <div className="aura-card" onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Language</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>🗣️</span>
            <div><p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedLanguage.nativeLabel}</p><p style={{ fontSize: '11px', color: 'var(--t2)' }}>Change Preferences →</p></div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(139,111,255,0.1), rgba(94,196,255,0.06))', border: '0.5px solid rgba(139,111,255,0.2)', borderRadius: 'var(--r-m)', padding: '14px 16px', marginTop: 'auto' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>💡 Health Tip</p>
          <p style={{ fontSize: '11.5px', color: 'var(--t2)', lineHeight: 1.6 }}>Stay hydrated and rest well.</p>
        </div>
      </aside>

      {/* SETTINGS DRAWER */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="aura-card" 
              style={{ width: '400px', height: '100vh', borderRadius: '40px 0 0 40px', padding: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--fd)', fontSize: '28px' }}>Preferences</h2>
                  <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'var(--glass)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '99px' }}>Close</button>
               </div>
               
               <div>
                  <p style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Region & Context</p>
                  <select value={selectedStateCode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStateCode(e.target.value)} className="btn-aura" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                    {INDIA_STATE_PROFILES.map(p => <option key={p.code} value={p.code} style={{ color: 'black' }}>{p.name}</option>)}
                  </select>
               </div>

               <div>
                  <p style={{ fontSize: '12px', color: 'var(--t3)', textTransform: 'uppercase', marginBottom: '16px' }}>Voice Language</p>
                  <select value={selectedLanguageCode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLanguageCode(e.target.value as LanguageCode)} className="btn-aura" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                    {LANGUAGE_OPTIONS.map(l => <option key={l.code} value={l.code} style={{ color: 'black' }}>{l.label} ({l.nativeLabel})</option>)}
                  </select>
               </div>

               <div style={{ marginTop: 'auto' }}>
                  <button className="btn-aura" style={{ width: '100%' }} onClick={() => setIsSettingsOpen(false)}>Save & Apply</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMERGENCY OVERLAY */}
      <AnimatePresence>
        {isEmergency && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="emergency-overlay-aura">
             <div className="aura-card" style={{ maxWidth: '360px', textAlign: 'center', padding: '40px 32px' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
                <h2 style={{ fontFamily: 'var(--fd)', color: 'var(--danger)', marginBottom: '12px' }}>Emergency Detected</h2>
                <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '32px' }}>Please act now.</p>
                <button className="btn-aura" style={{ width: '100%', background: '#fff', color: 'var(--danger)', marginBottom: '12px' }}>📞 Call 108 Now</button>
                <button className="btn-aura" style={{ width: '100%', background: 'var(--glass)', border: '0.5px solid var(--glass-b)', marginBottom: '12px' }}>🏥 Find Nearest Hospital</button>
                <div style={{ color: 'var(--t3)', fontSize: '12px', cursor: 'pointer', marginTop: '12px' }} onClick={() => setIsEmergency(false)}>← Back to assistant</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
