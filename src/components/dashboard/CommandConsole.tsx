import { useState, useEffect, useRef, useCallback } from "react";
import {
  Paperclip, Mic, Search, Brain, Bot, Globe, Github,
  FileText, ImageIcon, Video, AudioLines, Link, Clipboard, ArrowUp,
  Square, RotateCcw, Copy, ChevronRight, ChevronDown, Code2,
  BookOpen, X, Check, Sparkles, Zap, Eye, Database, Cpu,
} from "lucide-react";
import { processAiQuery } from "@/lib/ai.functions";

/* ─────────────────── Mini Markdown Renderer ─────────────────── */
function MiniMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <p key={i} className="text-xs font-bold text-cyan-300 mt-2">{line.slice(4)}</p>;
        if (line.startsWith("## ")) return <p key={i} className="text-sm font-bold text-cyan-200 mt-2">{line.slice(3)}</p>;
        if (line.startsWith("# ")) return <p key={i} className="text-base font-bold text-white mt-2">{line.slice(2)}</p>;
        if (line.startsWith("```")) return <div key={i} className="font-mono text-[11px] text-sky-300 bg-sky-900/20 rounded px-2 py-0.5">{line.slice(3)}</div>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <p key={i} className="text-xs text-white/80 pl-3">• {line.slice(2)}</p>;
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className="text-xs text-white/80 leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
              if (part.startsWith("`") && part.endsWith("`")) return <code key={j} className="font-mono text-[11px] text-sky-300 bg-sky-900/25 px-1 rounded">{part.slice(1, -1)}</code>;
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

/* ─────────────────── Constants ─────────────────── */
const THINKING_STATES = [
  "Thinking...", "Analyzing...", "Reasoning...", "Planning...",
  "Searching...", "Reading Memory...", "Connecting Knowledge...",
  "Deep Thinking...", "Building Response...", "Generating...",
  "Validating...", "Completed.",
];

const SUGGESTIONS = [
  { label: "Generate UI", icon: Sparkles },
  { label: "Deep Research", icon: Search },
  { label: "Write Code", icon: Code2 },
  { label: "Analyze Business", icon: Brain },
  { label: "Summarize PDF", icon: FileText },
  { label: "Investment Analysis", icon: Database },
  { label: "Explain Architecture", icon: Cpu },
  { label: "Marketing Plan", icon: Globe },
];

const PLACEHOLDER_CYCLE = [
  "Describe anything...",
  "Ask OPOAD...",
  "Generate Code...",
  "Research...",
  "Analyze...",
  "Create...",
  "Think...",
  "Build...",
];

const ATTACH_OPTIONS = [
  { id: "image", label: "Upload Image", icon: ImageIcon, accept: "image/*" },
  { id: "pdf", label: "PDF Document", icon: FileText, accept: ".pdf" },
  { id: "video", label: "Video File", icon: Video, accept: "video/*" },
  { id: "audio", label: "Audio File", icon: AudioLines, accept: "audio/*" },
  { id: "url", label: "URL / Link", icon: Link, accept: null },
  { id: "github", label: "GitHub Repo", icon: Github, accept: null },
  { id: "clipboard", label: "Clipboard", icon: Clipboard, accept: null },
];

type Mode = "webSearch" | "deepResearch" | "vision" | "reasoning" | "code" | "generate";

const MODES: { id: Mode; label: string; icon: React.ElementType }[] = [
  { id: "webSearch",    label: "SEARCH",   icon: Globe   },
  { id: "deepResearch", label: "DEEP",     icon: Search  },
  { id: "vision",       label: "VISION",   icon: Eye     },
  { id: "reasoning",    label: "REASON",   icon: Brain   },
  { id: "code",         label: "CODE",     icon: Code2   },
  { id: "generate",     label: "GENERATE", icon: Sparkles},
];

/* ─────────────────── Component ─────────────────── */
export function CommandConsole() {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [streamDone, setStreamDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [attachedItems, setAttachedItems] = useState<{ label: string; icon: React.ElementType }[]>([]);
  const [modes, setModes] = useState<Set<Mode>>(new Set());
  const [listening, setListening] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [thinkingStateIdx, setThinkingStateIdx] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; dur: number }[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Placeholder cycle ── */
  useEffect(() => {
    const t = setInterval(() => {
      if (!input && !focused) setPlaceholderIdx(p => (p + 1) % PLACEHOLDER_CYCLE.length);
    }, 2200);
    return () => clearInterval(t);
  }, [input, focused]);

  /* ── Floating particles on focus ── */
  useEffect(() => {
    if (focused || loading) {
      setParticles(Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.8,
        dur: 1.8 + Math.random() * 1.6,
      })));
    } else {
      setParticles([]);
    }
  }, [focused, loading]);

  /* ── Thinking state cycle ── */
  useEffect(() => {
    if (loading) {
      setThinkingStateIdx(0);
      thinkRef.current = setInterval(() => {
        setThinkingStateIdx(i => (i + 1) % (THINKING_STATES.length - 1));
      }, 900);
    } else {
      if (thinkRef.current) clearInterval(thinkRef.current);
    }
    return () => { if (thinkRef.current) clearInterval(thinkRef.current); };
  }, [loading]);

  /* ── Auto-grow textarea ── */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setShowSuggestions(val.length === 0);
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 1000);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  /* ── Toggle mode ── */
  const toggleMode = (m: Mode) => {
    setModes(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  /* ── Stream simulation ── */
  const streamText = useCallback((fullText: string) => {
    setStreamedText("");
    setStreamDone(false);
    let i = 0;
    const tick = () => {
      i += Math.floor(Math.random() * 5) + 2;
      setStreamedText(fullText.slice(0, i));
      if (i < fullText.length) {
        streamRef.current = setTimeout(tick, 14);
      } else {
        setStreamDone(true);
      }
    };
    tick();
  }, []);

  /* ── Send ── */
  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setStreamedText("");
    setStreamDone(false);
    setChatHistory(prev => [...prev, { role: "user", text: q }]);
    setInput("");
    setShowSuggestions(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await processAiQuery({
        data: {
          query: q,
          deepThink: modes.has("reasoning") || modes.has("deepResearch"),
          researchMode: modes.has("deepResearch") || modes.has("webSearch"),
        },
      });
      setResponse(res.response);
      streamText(res.response);
      setChatHistory(prev => [...prev, { role: "ai", text: res.response }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI processing failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Stop ── */
  const handleStop = () => {
    if (streamRef.current) clearTimeout(streamRef.current);
    setLoading(false);
    setStreamDone(true);
  };

  /* ── Copy ── */
  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── Regenerate ── */
  const handleRegenerate = () => {
    if (response) streamText(response);
  };

  /* ── Clear ── */
  const handleClear = () => {
    setStreamedText("");
    setResponse(null);
    setError(null);
    setStreamDone(false);
    setChatHistory([]);
    setShowSuggestions(true);
  };

  /* ── Voice ── */
  const handleVoice = () => {
    setListening(l => !l);
    if (!listening) setTimeout(() => setListening(false), 5000);
  };

  /* ── Clipboard ── */
  const handleClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(prev => prev + text);
      setAttachedItems(prev => [...prev, { label: "Clipboard", icon: Clipboard }]);
    } catch {}
    setShowAttach(false);
  };

  /* ── File attach ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, label: string, Icon: React.ElementType) => {
    if (e.target.files?.[0]) {
      setAttachedItems(prev => [...prev, { label: e.target.files![0].name || label, icon: Icon }]);
    }
    setShowAttach(false);
  };

  /* ── Drag & drop ── */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setAttachedItems(prev => [...prev, { label: file.name, icon: Paperclip }]);
  };

  /* ── Keyboard: Enter to send ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasContent = Boolean(streamedText || loading || error);

  return (
    <>
      {/* ── Scoped keyframe animations ── */}
      <style>{`
        @keyframes occ-scanline {
          0%   { left: -80px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: calc(100% + 80px); opacity: 0; }
        }
        @keyframes occ-beam {
          0%   { transform: translateX(-120%); opacity: 0.6; }
          100% { transform: translateX(120%);  opacity: 0.3; }
        }
        @keyframes occ-holo-scan {
          0%   { top: -2px; opacity: 0.8; }
          80%  { opacity: 0.5; }
          100% { top: calc(100% + 2px); opacity: 0; }
        }
        @keyframes occ-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes occ-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes occ-float  {
          0%,100% { transform:translate(0,0) scale(1);   opacity:0.5; }
          50%     { transform:translate(var(--fx),var(--fy)) scale(1.4); opacity:1; }
        }
        @keyframes occ-fadein  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes occ-pulse   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.9);opacity:0} }
        @keyframes occ-breathe { 0%,100%{opacity:.25} 50%{opacity:.55} }
        @keyframes occ-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .occ-scanline { animation: occ-scanline 2s linear infinite; }
        .occ-beam     { animation: occ-beam 1.6s ease-in-out infinite; }
        .occ-holo     { animation: occ-holo-scan 3s linear infinite; }
        .occ-blink    { animation: occ-blink 1s step-end infinite; }
        .occ-spin     { animation: occ-spin 1.1s linear infinite; }
        .occ-spin-rev { animation: occ-spin .7s linear infinite reverse; }
        .occ-fadein   { animation: occ-fadein .3s ease forwards; }
        .occ-breathe  { animation: occ-breathe 2.8s ease-in-out infinite; }
        .occ-shimmer  {
          background: linear-gradient(120deg, transparent 30%, rgba(56,189,248,.18) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: occ-shimmer 2.4s linear infinite;
        }
        .occ-no-scrollbar::-webkit-scrollbar { display: none; }
        .occ-no-scrollbar { scrollbar-width: none; }
        textarea.occ-input::placeholder { color: rgba(148,163,184,.28); }
      `}</style>

      <div
        className="pointer-events-auto w-full relative"
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* ── Floating particles ── */}
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full pointer-events-none z-0"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: "rgba(56,189,248,.65)",
              animation: `occ-float ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.id * .08}s`,
              "--fx": `${(Math.random() - .5) * 14}px`,
              "--fy": `${(Math.random() - .5) * 10}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* ── Drag overlay ── */}
        {dragOver && (
          <div className="absolute inset-0 z-50 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(56,189,248,.07)", border: "1.5px dashed rgba(56,189,248,.6)" }}>
            <p className="font-mono text-xs tracking-[.35em] text-sky-400">DROP TO ATTACH</p>
          </div>
        )}

        {/* ══════════════ MAIN GLASS SHELL ══════════════ */}
        <div className="relative overflow-hidden rounded-2xl transition-all duration-500"
          style={{
            background: focused || loading
              ? "rgba(4,14,30,.82)"
              : "rgba(4,14,30,.68)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: focused || loading
              ? "1px solid rgba(56,189,248,.65)"
              : "1px solid rgba(56,189,248,.18)",
            boxShadow: focused || loading
              ? "0 0 0 1px rgba(56,189,248,.22), 0 0 40px rgba(56,189,248,.18), 0 0 120px rgba(56,189,248,.06), inset 0 1px 0 rgba(255,255,255,.04)"
              : "0 0 0 1px rgba(56,189,248,.06), inset 0 1px 0 rgba(255,255,255,.02)",
          }}
        >
          {/* Holographic shimmer overlay */}
          <div className="occ-shimmer absolute inset-0 pointer-events-none z-0 rounded-2xl" />

          {/* Holographic scan line (top-to-bottom) when focused */}
          {(focused || loading) && (
            <div className="occ-holo absolute left-0 right-0 pointer-events-none z-10"
              style={{ height: "1.5px", background: "linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent)" }} />
          )}

          {/* Animated border breathing when idle */}
          {!focused && !loading && (
            <div className="occ-breathe absolute inset-0 pointer-events-none z-0 rounded-2xl"
              style={{ border: "1px solid rgba(56,189,248,.2)", borderRadius: "inherit" }} />
          )}

          {/* ─── Top label bar ─── */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-0">
            <div className="flex items-center gap-2">
              {/* Logo spinner or logo */}
              <div className="relative flex items-center justify-center" style={{ width: 20, height: 20 }}>
                {loading ? (
                  <>
                    <div className="absolute inset-0 rounded-full border border-sky-400/40 occ-spin" />
                    <div className="absolute inset-[2px] rounded-full border border-sky-300/25 occ-spin-rev" />
                    <img src="/opoad-logo-transparent.png" alt="" className="w-3.5 h-3.5 object-contain occ-spin"
                      style={{ filter: "brightness(2.5) drop-shadow(0 0 6px rgba(56,189,248,1))" }} />
                  </>
                ) : (
                  <img src="/opoad-logo-transparent.png" alt="" className="w-4 h-4 object-contain"
                    style={{ filter: "brightness(1.8) drop-shadow(0 0 8px rgba(56,189,248,.8))" }} />
                )}
              </div>
              <span className="font-mono text-[9px] tracking-[.4em] text-sky-400/60">
                {loading ? THINKING_STATES[thinkingStateIdx] : "OPOAD AI WORKSPACE"}
              </span>
            </div>
            <span className="font-mono text-[8px] tracking-[.3em] text-sky-400/25">CORE_ONLINE</span>
          </div>

          {/* ─── Chat history ─── */}
          {chatHistory.length > 0 && (
            <div className="relative z-10 mx-4 mt-2 max-h-40 overflow-y-auto space-y-2 occ-no-scrollbar occ-fadein">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`rounded-xl px-3 py-2 ${
                  msg.role === "user"
                    ? "ml-auto max-w-[75%] text-right"
                    : "mr-auto max-w-[90%]"
                }`}
                  style={{
                    background: msg.role === "user"
                      ? "rgba(56,189,248,.1)"
                      : "rgba(4,10,20,.6)",
                    border: `1px solid rgba(56,189,248,${msg.role === "user" ? ".25" : ".1"})`,
                  }}>
                  <p className="text-[11px] text-white/75 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* ─── Thinking state banner ─── */}
          {loading && (
            <div className="relative z-10 mx-4 mt-2 rounded-xl px-4 py-2.5 flex items-center gap-3 occ-fadein overflow-hidden"
              style={{ background: "rgba(56,189,248,.05)", border: "1px solid rgba(56,189,248,.2)" }}>
              {/* Beam sweep */}
              <div className="occ-beam absolute inset-y-0 w-28 pointer-events-none"
                style={{ background: "linear-gradient(90deg,transparent,rgba(56,189,248,.1),transparent)" }} />
              {/* Spinning logo */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full border border-sky-400/30"
                  style={{ animation: "occ-pulse 1.5s ease-out infinite" }} />
                <img src="/opoad-logo-transparent.png" alt="" className="w-5 h-5 object-contain occ-spin"
                  style={{ filter: "brightness(2.5) drop-shadow(0 0 10px rgba(56,189,248,1))" }} />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[.35em] text-sky-300">
                  {THINKING_STATES[thinkingStateIdx]}
                </p>
                <div className="flex gap-1 mt-0.5">
                  {[0, .25, .5].map((d, k) => (
                    <span key={k} className="w-1 h-1 rounded-full bg-sky-400/60 occ-blink"
                      style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
              {/* Neural wave bars */}
              <div className="ml-auto flex items-center gap-0.5">
                {Array.from({ length: 10 }).map((_, k) => (
                  <div key={k} className="w-px rounded-full bg-sky-400/40 occ-blink"
                    style={{ height: 6 + Math.random() * 16, animationDelay: `${k * .07}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* ─── Streaming response ─── */}
          {streamedText && (
            <div className="relative z-10 mx-4 mt-2 rounded-xl overflow-hidden occ-fadein"
              style={{ background: "rgba(2,8,18,.72)", border: "1px solid rgba(56,189,248,.14)" }}>
              <div className="max-h-52 overflow-y-auto px-4 py-3 occ-no-scrollbar">
                <MiniMarkdown text={streamedText} />
                {!streamDone && (
                  <span className="occ-blink inline-block w-0.5 h-3.5 bg-sky-400 ml-0.5 align-middle" />
                )}
              </div>
              {/* Action bar */}
              {streamDone && (
                <div className="flex items-center gap-3 px-4 py-2 border-t border-sky-400/10">
                  <button onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                  <button onClick={handleRegenerate}
                    className="flex items-center gap-1 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                    <RotateCcw size={10} />REGEN
                  </button>
                  <button onClick={() => setInput("Continue: ")}
                    className="flex items-center gap-1 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                    <ChevronRight size={10} />CONTINUE
                  </button>
                  <button onClick={() => setShowSources(s => !s)}
                    className="flex items-center gap-1 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                    <BookOpen size={10} />SOURCES
                    <ChevronDown size={8} style={{ transform: showSources ? "rotate(180deg)" : "", transition: "transform .2s" }} />
                  </button>
                  <button onClick={handleClear}
                    className="ml-auto flex items-center gap-1 text-[10px] font-mono text-sky-400/30 hover:text-sky-400 transition-colors">
                    <X size={10} />CLEAR
                  </button>
                </div>
              )}
              {showSources && streamDone && (
                <div className="px-4 pb-3 space-y-1 border-t border-sky-400/08">
                  <p className="font-mono text-[9px] tracking-[.35em] text-sky-400/30 mt-2 mb-1">CITATIONS</p>
                  {["OPOAD Intelligence Core v9.42", "Global AI Research Index", "Neural Knowledge Base"].map((s, k) => (
                    <div key={k} className="flex items-center gap-1.5 text-[10px] text-sky-400/50">
                      <div className="w-1 h-1 rounded-full bg-sky-400/50 shrink-0" />
                      [{k + 1}] {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Error ─── */}
          {error && (
            <div className="relative z-10 mx-4 mt-2 rounded-xl px-3 py-2 flex items-center gap-2 occ-fadein"
              style={{ background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.25)" }}>
              <X size={12} className="text-sky-400 shrink-0" />
              <p className="text-[11px] text-sky-300/80">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-sky-400/30 hover:text-sky-400">
                <X size={10} />
              </button>
            </div>
          )}

          {/* ─── Suggestion chips (fade out while typing) ─── */}
          {showSuggestions && !loading && !hasContent && (
            <div className="relative z-10 flex flex-wrap gap-1.5 px-5 mt-2.5 occ-fadein">
              {SUGGESTIONS.map(s => (
                <button key={s.label}
                  onClick={() => { setInput(s.label + ": "); textareaRef.current?.focus(); }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-mono tracking-wider text-sky-400/55 hover:text-sky-300 transition-all whitespace-nowrap"
                  style={{ background: "rgba(56,189,248,.04)", border: "1px solid rgba(56,189,248,.1)" }}>
                  <s.icon size={9} />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* ─── Input area ─── */}
          <div className="relative z-10 flex items-start gap-3 px-5 pt-3 pb-2">
            <div className="relative flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER_CYCLE[placeholderIdx]}
                disabled={loading}
                rows={1}
                className="occ-input w-full bg-transparent resize-none outline-none text-sm text-white/90 font-mono leading-relaxed"
                style={{ minHeight: 32, maxHeight: 140 }}
              />

              {/* Holographic cursor when empty + focused */}
              {focused && !input && !loading && (
                <span className="occ-blink absolute left-0 top-1 w-px h-4 bg-sky-400 rounded-full" />
              )}

              {/* Animated scanning line at bottom while typing */}
              {typing && (
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                  <div className="occ-scanline absolute h-full w-20 rounded-full"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(56,189,248,.9),transparent)" }} />
                </div>
              )}

              {/* Active line glow */}
              {focused && (
                <div className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(56,189,248,.35),transparent)" }} />
              )}
            </div>

            {/* Send / Stop */}
            <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
              {/* Voice */}
              <button onClick={handleVoice} title="Voice Input"
                className="relative flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                style={{
                  background: listening ? "rgba(56,189,248,.15)" : "rgba(56,189,248,.05)",
                  border: `1px solid rgba(56,189,248,${listening ? ".5" : ".15"})`,
                  boxShadow: listening ? "0 0 14px rgba(56,189,248,.3)" : "none",
                }}>
                <Mic size={12} className="text-sky-400" />
                {listening && (
                  <span className="absolute inset-0 rounded-lg border border-sky-400/40"
                    style={{ animation: "occ-pulse 1s ease-out infinite" }} />
                )}
              </button>

              {/* Attach */}
              <div className="relative">
                <button onClick={() => setShowAttach(v => !v)} title="Attach"
                  className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                  style={{
                    background: showAttach ? "rgba(56,189,248,.12)" : "rgba(56,189,248,.05)",
                    border: "1px solid rgba(56,189,248,.15)",
                  }}>
                  <Paperclip size={12} className="text-sky-400" />
                </button>
                {showAttach && (
                  <div className="absolute bottom-full mb-1.5 right-0 z-50 rounded-xl p-1.5 min-w-[168px] occ-fadein"
                    style={{ background: "rgba(4,14,30,.97)", border: "1px solid rgba(56,189,248,.3)", backdropFilter: "blur(24px)", boxShadow: "0 0 24px rgba(56,189,248,.15)" }}>
                    {ATTACH_OPTIONS.map(opt => (
                      <button key={opt.id}
                        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-[11px] text-sky-400/70 hover:text-sky-300 hover:bg-sky-400/10 transition-all text-left"
                        onClick={() => {
                          if (opt.id === "clipboard") { handleClipboard(); return; }
                          if (opt.id === "url") {
                            const u = prompt("Enter URL:");
                            if (u) setAttachedItems(p => [...p, { label: u, icon: Link }]);
                            setShowAttach(false); return;
                          }
                          if (opt.id === "github") {
                            const r = prompt("GitHub repo:");
                            if (r) setAttachedItems(p => [...p, { label: r, icon: Github }]);
                            setShowAttach(false); return;
                          }
                          const accept = opt.accept ?? "";
                          if (fileRef.current) {
                            fileRef.current.accept = accept;
                            const Icon = opt.icon;
                            fileRef.current.onchange = (e) =>
                              handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>, opt.label, Icon);
                            fileRef.current.click();
                          }
                          setShowAttach(false);
                        }}>
                        <opt.icon size={11} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send / Stop */}
              {loading ? (
                <button onClick={handleStop} title="Stop Generating"
                  className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                  style={{ background: "rgba(56,189,248,.14)", border: "1px solid rgba(56,189,248,.45)", boxShadow: "0 0 12px rgba(56,189,248,.25)" }}>
                  <Square size={10} className="text-sky-400" fill="currentColor" />
                </button>
              ) : (
                <button onClick={handleSend} disabled={!input.trim()} title="Send (Enter)"
                  className="flex items-center justify-center rounded-lg w-7 h-7 transition-all disabled:opacity-25"
                  style={{
                    background: input.trim() ? "rgba(56,189,248,.2)" : "rgba(56,189,248,.04)",
                    border: `1px solid rgba(56,189,248,${input.trim() ? ".6" : ".1"})`,
                    boxShadow: input.trim() ? "0 0 16px rgba(56,189,248,.3)" : "none",
                  }}>
                  <ArrowUp size={13} className="text-sky-400" />
                </button>
              )}
            </div>
          </div>

          {/* ─── Attached items ─── */}
          {attachedItems.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1.5 px-5 pb-1.5">
              {attachedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono text-sky-300"
                  style={{ background: "rgba(56,189,248,.07)", border: "1px solid rgba(56,189,248,.2)" }}>
                  <item.icon size={9} />
                  <span className="max-w-[90px] truncate">{item.label}</span>
                  <button onClick={() => setAttachedItems(p => p.filter((_, j) => j !== i))}>
                    <X size={8} className="text-sky-400/40 hover:text-sky-400 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ─── Bottom toolbar ─── */}
          <div className="relative z-10 flex items-center justify-between px-5 pb-3 pt-0 gap-2">
            {/* Mode pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {MODES.map(m => {
                const active = modes.has(m.id);
                return (
                  <button key={m.id} onClick={() => toggleMode(m.id)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-mono tracking-wider transition-all"
                    style={{
                      background: active ? "rgba(56,189,248,.12)" : "rgba(56,189,248,.03)",
                      border: `1px solid rgba(56,189,248,${active ? ".45" : ".1"})`,
                      color: active ? "rgba(125,211,252,1)" : "rgba(125,211,252,.45)",
                      boxShadow: active ? "0 0 10px rgba(56,189,248,.2)" : "none",
                    }}>
                    <m.icon size={9} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom action row */}
            <div className="flex items-center gap-1.5">
              {streamDone && (
                <>
                  <button onClick={handleCopy}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-mono tracking-wider text-sky-400/50 hover:text-sky-300 transition-all"
                    style={{ background: "rgba(56,189,248,.03)", border: "1px solid rgba(56,189,248,.1)" }}>
                    {copied ? <Check size={9} /> : <Copy size={9} />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                  <button onClick={handleRegenerate}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-mono tracking-wider text-sky-400/50 hover:text-sky-300 transition-all"
                    style={{ background: "rgba(56,189,248,.03)", border: "1px solid rgba(56,189,248,.1)" }}>
                    <RotateCcw size={9} />REGEN
                  </button>
                </>
              )}
              <button onClick={handleClear}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-mono tracking-wider text-sky-400/30 hover:text-sky-400 transition-all"
                style={{ background: "rgba(56,189,248,.02)", border: "1px solid rgba(56,189,248,.08)" }}>
                <X size={9} />CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input ref={fileRef} type="file" className="hidden" />
      </div>
    </>
  );
}
