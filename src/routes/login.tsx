import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LoginEarthScene } from "@/components/dashboard/LoginEarthScene";
import { Eye, EyeOff, Mail, Lock, Globe, ChevronDown, ArrowRight, Shield, Brain, Zap, Rocket, Loader as Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — OPOAD" },
      {
        name: "description",
        content: "Sign in to OPOAD — The World's Most Advanced AI Operating System.",
      },
    ],
  }),
  component: LoginPage,
});

const STATS = [
  { icon: Globe, value: "195+", label: "Countries" },
  { icon: null, value: "1.2M+", label: "News / Day" },
  { icon: null, value: "3.8M+", label: "Videos Processed" },
  { icon: null, value: "8.9M+", label: "Active Users" },
  { icon: Shield, value: "99.99%", label: "System Uptime" },
];

const FEATURES = [
  { icon: Brain, label: "AI POWERED", sub: "Multi-Agent\nIntelligence", color: "text-sky-400" },
  { icon: Zap, label: "REAL-TIME", sub: "Infinite News\nStreams", color: "text-amber-400" },
  { icon: Shield, label: "SECURE", sub: "Enterprise Grade\nEncryption", color: "text-violet-400" },
  { icon: Rocket, label: "AUTONOMOUS", sub: "End-to-End\nAutomation", color: "text-sky-300" },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function OPOADCubeIcon() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <div
        className="absolute inset-0 rounded-xl border border-amber-400/60 rotate-45"
        style={{ boxShadow: "0 0 16px rgba(251,191,36,0.4), inset 0 0 16px rgba(251,191,36,0.1)" }}
      />
      <div className="absolute inset-2 rounded-lg border border-amber-300/40 rotate-45" />
      <div
        className="relative z-10 h-4 w-4 rounded-sm bg-amber-400/20 border border-amber-400/80 rotate-45"
        style={{ boxShadow: "0 0 8px rgba(251,191,36,0.8)" }}
      />
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setAuthError(null);
    setAuthSuccess(null);
    setSubmitting(true);

    if (isSignUp) {
      const { error, needsConfirmation } = await signUp(email.trim(), password);
      setSubmitting(false);
      if (error) {
        setAuthError(error);
      } else if (needsConfirmation) {
        // Email confirmation required — tell user to check inbox
        setAuthSuccess(
          `✅ Account bana diya! ${email.trim()} pe confirmation email bheja gaya hai. Email open karein aur link pe click karein, phir Sign In karein.`
        );
        setIsSignUp(false); // Switch to sign-in mode
      } else {
        // Auto-confirmed (rare) — go to dashboard
        navigate({ to: "/" });
      }
    } else {
      const { error } = await signIn(email.trim(), password);
      setSubmitting(false);
      if (error) {
        setAuthError(error);
      } else {
        navigate({ to: "/" });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05070A] flex flex-col">
      {/* Starfield */}
      <div className="pointer-events-none absolute inset-0">
        <div className="starfield" />
        <div className="grid-overlay" />
      </div>

      {/* Top-right language */}
      <div className="relative z-20 flex justify-end px-6 pt-4">
        <button className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono tracking-widest text-foreground/80 hover:text-primary transition-colors">
          <Globe size={13} />
          English
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        {/* ── LEFT PANEL ── */}
        <div className="flex flex-1 flex-col items-center justify-between px-8 py-6 lg:items-start lg:px-16">
          {/* Hero illustration — circle then logo then welcome, clean stack */}
          <div className="w-full max-w-lg">
            {/* glowing-circle wrapper — margin-bottom: 24px after circle */}
            <div className="relative mx-auto lg:mx-0 w-72 md:w-80 lg:w-[380px]" style={{ marginBottom: "24px" }}>

              {/* ── Circle section ── */}
              <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                {/* Wide ambient glow behind everything */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-40px",
                    background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />

                {/* Illusion ring 4 — outermost, slow amber */}
                <div
                  className="absolute rounded-full animate-spin pointer-events-none"
                  style={{
                    inset: "-48px",
                    animationDuration: "60s",
                    animationDirection: "reverse",
                    border: "1px dashed rgba(251,191,36,0.18)",
                    boxShadow: "0 0 20px rgba(251,191,36,0.12)",
                  }}
                />

                {/* Illusion ring 3 — large blue pulse ring */}
                <div
                  className="absolute rounded-full animate-spin pointer-events-none"
                  style={{
                    inset: "-32px",
                    animationDuration: "40s",
                    background: "transparent",
                    border: "1px solid transparent",
                    boxShadow: "0 0 0 1px rgba(56,189,248,0.22), 0 0 24px rgba(56,189,248,0.18)",
                  }}
                />

                {/* Illusion ring 2 — close amber reverse */}
                <div
                  className="absolute rounded-full animate-spin pointer-events-none"
                  style={{
                    inset: "-18px",
                    animationDuration: "28s",
                    animationDirection: "reverse",
                    border: "1.5px solid rgba(251,191,36,0.5)",
                    boxShadow: "0 0 18px rgba(251,191,36,0.55), inset 0 0 18px rgba(251,191,36,0.1)",
                  }}
                />

                {/* Illusion ring 1 — tight bright blue */}
                <div
                  className="absolute rounded-full animate-spin pointer-events-none"
                  style={{
                    inset: "-8px",
                    animationDuration: "16s",
                    border: "2px solid rgba(56,189,248,0.8)",
                    boxShadow: "0 0 20px rgba(56,189,248,0.9), 0 0 40px rgba(56,189,248,0.45), inset 0 0 20px rgba(56,189,248,0.15)",
                  }}
                />

                {/* Main circle — Earth scene, dark-blue inner glow (not pitch black) */}
                <div
                  className="relative z-10 h-full w-full rounded-full overflow-hidden"
                  style={{
                    background: "radial-gradient(circle at 40% 40%, #0a1e3a 0%, #050d1a 55%, #000 100%)",
                    boxShadow:
                      "0 0 0 2px rgba(56,189,248,0.95), 0 0 40px rgba(56,189,248,0.7), 0 0 100px rgba(56,189,248,0.35)",
                    border: "2px solid rgba(56,189,248,1)",
                  }}
                >
                  <LoginEarthScene />
                </div>
              </div>

            </div>

            {/* opoad-logo — height:32px, separate from circle, margin-bottom:16px before welcome */}
            <div className="flex justify-center lg:justify-start" style={{ marginBottom: "16px" }}>
              <img
                src="/opoad-logo-transparent.png"
                alt="OPOAD"
                className="w-auto object-contain"
                style={{
                  height: "32px",
                  filter:
                    "brightness(2.0) contrast(1.1) drop-shadow(0 0 16px rgba(56,189,248,0.95)) drop-shadow(0 0 32px rgba(56,189,248,0.55)) drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                }}
              />
            </div>

            {/* Welcome text */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-white">
                Welcome to{" "}
                <span
                  className="text-amber-400"
                  style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}
                >
                  OPOAD
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                The World's Most Advanced AI Video & News Ecosystem.
                <br />
                Research. Automate. Create. Inspire.
              </p>
            </div>

            {/* Feature cards */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="glass flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center"
                >
                  <f.icon size={20} className={f.color} />
                  <p className={`font-mono text-[8px] font-bold tracking-widest ${f.color}`}>
                    {f.label}
                  </p>
                  <p className="text-[8px] text-white/50 leading-tight whitespace-pre-line">
                    {f.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Earth image */}
          <div
            className="mt-6 w-full max-w-lg overflow-hidden rounded-2xl"
            style={{ height: "120px" }}
          >
            <img
              src="/src/assets/earth.jpg"
              alt="Earth"
              className="w-full object-cover object-center opacity-60"
              style={{
                height: "200px",
                marginTop: "-40px",
                filter: "saturate(1.4) hue-rotate(10deg)",
              }}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex w-full flex-col items-center justify-center px-6 py-8 lg:w-[480px] lg:px-10 lg:py-10">
          <div
            className="glass w-full max-w-md rounded-3xl p-8"
            style={{
              borderColor: "rgba(56,189,248,0.25)",
              boxShadow:
                "0 0 60px rgba(56,189,248,0.08), 0 0 0 1px rgba(56,189,248,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* System status */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] text-emerald-400 tracking-wide">
                  System Status: All Systems Operational
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-white leading-tight">
                Sign In to Your{" "}
                <span
                  className="text-amber-400"
                  style={{ textShadow: "0 0 20px rgba(251,191,36,0.5)" }}
                >
                  Universe
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-white/50">Access the infinite power of OPOAD</p>
            </div>

            {/* OPOAD cube icon */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
              <OPOADCubeIcon />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>

            {/* Social buttons */}
            <div className="space-y-3 mb-5">
              {[
                { icon: <GoogleIcon />, label: "Continue with Google" },
                { icon: <MicrosoftIcon />, label: "Continue with Microsoft" },
                { icon: <GitHubIcon />, label: "Continue with GitHub" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/80 transition-all hover:border-sky-400/40 hover:bg-white/8 hover:text-white"
                >
                  {btn.icon}
                  <span className="font-medium">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] text-white/30 tracking-widest">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email */}
            <div className="relative mb-3">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-sky-400/50 focus:bg-white/8 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-sky-400/50 focus:bg-white/8 focus:ring-1 focus:ring-sky-400/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember(!remember)}
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${remember ? "border-amber-400 bg-amber-400/20" : "border-white/20 bg-white/5"}`}
                >
                  {remember && <div className="h-2 w-2 rounded-sm bg-amber-400" />}
                </div>
                <span className="text-xs text-white/60">Remember me</span>
              </label>
              <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Success message (e.g. email confirmation sent) */}
            {authSuccess && (
              <div className="mb-3 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-xs text-green-400 leading-relaxed">
                {authSuccess}
              </div>
            )}

            {/* Error message */}
            {authError && (
              <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 leading-relaxed">
                {authError}
              </div>
            )}

            {/* Sign In / Sign Up button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 0 24px rgba(245,158,11,0.4), 0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Create account */}
            <p className="mt-4 text-center text-xs text-white/40">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>

            {/* Security badge */}
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/5 pt-4">
              <Shield size={14} className="text-white/30" />
              <div className="text-center">
                <p className="text-[10px] text-white/40">Secured by Quantum Encryption</p>
                <p className="text-[9px] text-white/25">256-bit End-to-End Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-4 px-6 py-4">
          {[
            { value: "195+", label: "Countries" },
            { value: "1.2M+", label: "News / Day" },
            { value: "3.8M+", label: "Videos Processed" },
            { value: "8.9M+", label: "Active Users" },
            { value: "99.99%", label: "System Uptime" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-sky-400 text-glow">{s.value}</p>
                <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 bg-black/40">
        <div className="flex flex-wrap items-center justify-center gap-4 px-6 py-3 text-[10px] text-white/25">
          <span>© 2025 OPOAD Technologies. All Rights Reserved.</span>
          <span className="hidden sm:inline">|</span>
          <button className="hover:text-white/50 transition-colors">Privacy Policy</button>
          <button className="hover:text-white/50 transition-colors">Terms of Service</button>
          <button className="hover:text-white/50 transition-colors">Contact Us</button>
        </div>
      </div>
    </div>
  );
}
