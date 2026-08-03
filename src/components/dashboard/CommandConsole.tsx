import { useState, useEffect, useRef, useCallback } from "react";
import { Paperclip, Mic, ImageIcon, ArrowUp, Square, RotateCcw, Copy, X, Check } from "lucide-react";
import { processAiQuery } from "@/lib/ai.functions";

/* ─── Minimal Markdown ─── */
function MiniMd({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("### ")) return <p key={i} className="text-[11px] font-bold text-cyan-300 mt-2">{line.slice(4)}</p>;
        if (line.startsWith("## "))  return <p key={i} className="text-xs font-bold text-cyan-200 mt-2">{line.slice(3)}</p>;
        if (line.startsWith("# "))   return <p key={i} className="text-sm font-bold text-white mt-2">{line.slice(2)}</p>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <p key={i} className="text-[11px] text-white/75 pl-3">• {line.slice(2)}</p>;
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className="text-[11px] text-white/75 leading-relaxed">
            {parts.map((p, j) => {
              if (p.startsWith("**") && p.endsWith("**")) return <strong key={j} className="text-white/90 font-semibold">{p.slice(2,-2)}</strong>;
              if (p.startsWith("`")  && p.endsWith("`"))  return <code   key={j} className="font-mono text-[10px] text-sky-300 bg-sky-900/20 px-1 rounded">{p.slice(1,-1)}</code>;
              return p;
            })}
          </p>
        );
      })}
    </div>
  );
}

/* ─── Thinking states ─── */
const STATES = ["Thinking", "Analyzing", "Searching", "Reasoning", "Reading Memory", "Generating"];

export function CommandConsole() {
  const [input, setInput]         = useState("");
  const [focused, setFocused]     = useState(false);
  const [typing, setTyping]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [response, setResponse]   = useState<string | null>(null);
  const [streamed, setStreamed]    = useState("");
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const [thinkIdx, setThinkIdx]   = useState(0);
  const [thinkVis, setThinkVis]   = useState(true); // for fade transition
  const [listening, setListening] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);

  const typingRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const thinkFade  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);

  /* ── thinking state cycle with fade ── */
  useEffect(() => {
    if (loading) {
      setThinkIdx(0); setThinkVis(true);
      thinkTimer.current = setInterval(() => {
        setThinkVis(false);
        thinkFade.current = setTimeout(() => {
          setThinkIdx(i => (i + 1) % STATES.length);
          setThinkVis(true);
        }, 300);
      }, 1400);
    } else {
      if (thinkTimer.current) clearInterval(thinkTimer.current);
      if (thinkFade.current)  clearTimeout(thinkFade.current);
    }
    return () => {
      if (thinkTimer.current) clearInterval(thinkTimer.current);
      if (thinkFade.current)  clearTimeout(thinkFade.current);
    };
  }, [loading]);

  /* ── textarea auto-grow ── */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setTyping(true);
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => setTyping(false), 900);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  /* ── stream ── */
  const streamText = useCallback((full: string) => {
    setStreamed(""); setDone(false);
    let i = 0;
    const tick = () => {
      i += Math.floor(Math.random() * 5) + 2;
      setStreamed(full.slice(0, i));
      if (i < full.length) streamRef.current = setTimeout(tick, 13);
      else setDone(true);
    };
    tick();
  }, []);

  /* ── send ── */
  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setLoading(true); setError(null); setResponse(null);
    setStreamed(""); setDone(false);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      const res = await processAiQuery({ data: { query: q, deepThink: false, researchMode: false } });
      setResponse(res.response);
      streamText(res.response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI processing failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── stop ── */
  const handleStop = () => {
    if (streamRef.current) clearTimeout(streamRef.current);
    setLoading(false); setDone(true);
  };

  /* ── copy ── */
  const handleCopy = () => {
    if (response) { navigator.clipboard.writeText(response).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  /* ── clear ── */
  const handleClear = () => {
    setStreamed(""); setResponse(null); setError(null); setDone(false); setAttachment(null);
  };

  /* ── voice ── */
  const handleVoice = () => { setListening(l => !l); if (!listening) setTimeout(() => setListening(false), 5000); };

  /* ── keyboard ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isActive  = focused || loading || Boolean(streamed) || Boolean(error);
  const hasResult = Boolean(streamed) || Boolean(error);

  return (
    <>
      <style>{`
        @keyframes cc2-scanline {
          0%   { left:-80px; opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { left:calc(100% + 80px); opacity:0; }
        }
        @keyframes cc2-holo {
          0%   { top:-2px; opacity:.6; }
          100% { top:calc(100%+2px); opacity:0; }
        }
        @keyframes cc2-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes cc2-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cc2-spin-r { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes cc2-fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cc2-fadeup { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-4px)} }
        @keyframes cc2-pulse  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2);opacity:0} }
        @keyframes cc2-float  {
          0%,100%{transform:translate(0,0) scale(1);opacity:.4}
          50%{transform:translate(var(--fx,4px),var(--fy,-5px)) scale(1.4);opacity:.8}
        }
        .cc2-scanline { animation: cc2-scanline 2.2s linear infinite; }
        .cc2-holo     { animation: cc2-holo 3.5s linear infinite; }
        .cc2-blink    { animation: cc2-blink 1s step-end infinite; }
        .cc2-spin     { animation: cc2-spin   1s linear infinite; }
        .cc2-spin-r   { animation: cc2-spin-r .65s linear infinite; }
        .cc2-fadein   { animation: cc2-fadein .25s ease forwards; }
        .cc2-fadeup   { animation: cc2-fadeup .2s ease forwards; }
        .cc2-float    { animation: cc2-float var(--dur,2s) ease-in-out infinite; }
        .cc2-noscroll::-webkit-scrollbar { display:none; }
        .cc2-noscroll { scrollbar-width:none; }
        textarea.cc2-ta::placeholder { color:rgba(148,163,184,.22); transition:color .3s; }
        textarea.cc2-ta:focus::placeholder { color:rgba(148,163,184,.35); }
        .cc2-btn-hover { opacity:0; transition:opacity .2s; }
        .cc2-shell:hover .cc2-btn-hover { opacity:1; }
      `}</style>

      <div className="cc2-shell pointer-events-auto w-full relative">

        {/* ── Ambient floating particles (only when active) ── */}
        {isActive && Array.from({length: 10}).map((_, k) => (
          <div key={k} className="cc2-float absolute rounded-full pointer-events-none z-0"
            style={{
              left:`${10 + k*8}%`, top:`${20 + (k%3)*30}%`,
              width: 1.5 + (k%2), height: 1.5 + (k%2),
              background:"rgba(56,189,248,.55)",
              "--dur": `${2 + k*.18}s`,
              "--fx":  `${(k%2===0?1:-1)*(3+k%5)}px`,
              "--fy":  `${(k%3===0?-1:1)*(3+k%4)}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* ════════════ MAIN SHELL ════════════ */}
        <div className="relative overflow-hidden rounded-2xl transition-all duration-500"
          style={{
            /* Ultra transparent — 95–98% when idle, slight deepening on focus */
            background: loading
              ? "rgba(2,10,22,.35)"
              : isActive
              ? "rgba(2,10,22,.22)"
              : "rgba(2,10,22,.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: isActive
              ? "1px solid rgba(56,189,248,.45)"
              : "1px solid rgba(56,189,248,.12)",
            boxShadow: isActive
              ? "0 0 0 1px rgba(56,189,248,.12), 0 0 30px rgba(56,189,248,.1), inset 0 1px 0 rgba(255,255,255,.03)"
              : "0 0 0 1px rgba(56,189,248,.04), inset 0 1px 0 rgba(255,255,255,.01)",
            transition: "background .5s, border-color .4s, box-shadow .5s",
          }}
        >
          {/* Holographic top-to-bottom scan (only when focused/loading) */}
          {isActive && (
            <div className="cc2-holo absolute left-0 right-0 pointer-events-none z-10"
              style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(56,189,248,.4),transparent)" }}
            />
          )}

          {/* ── THINKING banner (only while loading) ── */}
          {loading && (
            <div className="cc2-fadein relative z-10 flex items-center gap-3 px-5 py-2.5 border-b border-sky-400/10">
              {/* Spinning OPOAD logo */}
              <div className="relative shrink-0 flex items-center justify-center" style={{width:18,height:18}}>
                <div className="absolute inset-0 rounded-full border border-sky-400/30 cc2-spin" />
                <div className="absolute inset-[2px] rounded-full border border-sky-300/20 cc2-spin-r" />
                <img src="/opoad-logo-transparent.png" alt="" className="w-3 h-3 object-contain cc2-spin"
                  style={{filter:"brightness(3) drop-shadow(0 0 5px rgba(56,189,248,1))"}} />
              </div>
              {/* Fading state text */}
              <p className="font-mono text-[10px] tracking-[.3em] transition-all duration-300"
                style={{
                  color: "rgba(125,211,252,.8)",
                  opacity: thinkVis ? 1 : 0,
                  transform: thinkVis ? "translateY(0)" : "translateY(-3px)",
                }}>
                {STATES[thinkIdx]}...
              </p>
              {/* Wave bars */}
              <div className="ml-auto flex items-center gap-px">
                {Array.from({length:8}).map((_,k) => (
                  <div key={k} className="w-px rounded-full bg-sky-400/35 cc2-blink"
                    style={{height: 5+Math.sin(k*.8)*7, animationDelay:`${k*.09}s`}} />
                ))}
              </div>
            </div>
          )}

          {/* ── RESPONSE area (only when there's a result) ── */}
          {hasResult && (
            <div className="cc2-fadein relative z-10 border-b border-sky-400/08">
              {error ? (
                <div className="flex items-center gap-2 px-5 py-3">
                  <p className="text-[11px] text-sky-300/70">{error}</p>
                  <button onClick={() => setError(null)} className="ml-auto text-sky-400/30 hover:text-sky-400 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3 max-h-56 overflow-y-auto cc2-noscroll">
                    <MiniMd text={streamed} />
                    {!done && <span className="cc2-blink inline-block w-0.5 h-3.5 bg-sky-400/80 ml-0.5 align-middle rounded-full" />}
                  </div>
                  {/* Action row — always visible after done, hover-reveal on Stop */}
                  <div className="flex items-center gap-3 px-5 pb-2.5">
                    {!done && (
                      <button onClick={handleStop}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400/60 hover:text-sky-300 transition-colors">
                        <Square size={9} fill="currentColor" />STOP
                      </button>
                    )}
                    {done && (
                      <>
                        <button onClick={handleCopy}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                          {copied ? <Check size={9}/> : <Copy size={9}/>}
                          {copied ? "COPIED" : "COPY"}
                        </button>
                        <button onClick={handleClear}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400/50 hover:text-sky-300 transition-colors">
                          <RotateCcw size={9}/>REGEN
                        </button>
                        <button onClick={handleClear}
                          className="cc2-btn-hover flex items-center gap-1.5 text-[10px] font-mono text-sky-400/35 hover:text-sky-400 transition-colors ml-auto">
                          <X size={9}/>CLEAR
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── INPUT ROW ── */}
          <div className="relative z-10 flex items-end gap-2 px-4 py-3">
            {/* Textarea */}
            <div className="relative flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe anything..."
                disabled={loading}
                rows={1}
                className="cc2-ta w-full bg-transparent resize-none outline-none text-sm text-white/85 font-light leading-relaxed"
                style={{ minHeight:28, maxHeight:160 }}
              />

              {/* Holographic cursor dot (empty + focused) */}
              {focused && !input && !loading && (
                <span className="cc2-blink absolute left-0 bottom-1 w-0.5 h-4 bg-sky-400/70 rounded-full" />
              )}

              {/* Scanning line at caret bottom while typing */}
              {typing && (
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
                  <div className="cc2-scanline absolute h-full w-24 rounded-full"
                    style={{background:"linear-gradient(90deg,transparent,rgba(56,189,248,.85),transparent)"}} />
                </div>
              )}

              {/* Static glowing bottom line when focused */}
              {focused && !typing && (
                <div className="absolute bottom-0 left-0 right-0 h-px rounded-full transition-opacity duration-300"
                  style={{background:"linear-gradient(90deg,transparent,rgba(56,189,248,.3),transparent)"}} />
              )}
            </div>

            {/* ── Right buttons ── */}
            <div className="flex items-center gap-1.5 pb-0.5 shrink-0">
              {/* Image Upload */}
              <button onClick={() => fileRef.current?.click()} title="Upload Image"
                className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                style={{
                  background:"rgba(56,189,248,.04)",
                  border:"1px solid rgba(56,189,248,.1)",
                  opacity: focused || attachment ? 1 : 0.5,
                }}>
                <ImageIcon size={12} className="text-sky-400/70" />
              </button>

              {/* Attach */}
              <button onClick={() => fileRef.current?.click()} title="Attach File"
                className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                style={{
                  background:"rgba(56,189,248,.04)",
                  border:"1px solid rgba(56,189,248,.1)",
                  opacity: focused || attachment ? 1 : 0.5,
                }}>
                <Paperclip size={12} className="text-sky-400/70" />
              </button>

              {/* Voice */}
              <button onClick={handleVoice} title="Voice Input"
                className="relative flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                style={{
                  background: listening ? "rgba(56,189,248,.12)" : "rgba(56,189,248,.04)",
                  border: `1px solid rgba(56,189,248,${listening ? ".45" : ".1"})`,
                  boxShadow: listening ? "0 0 12px rgba(56,189,248,.25)" : "none",
                }}>
                <Mic size={12} className={listening ? "text-sky-300" : "text-sky-400/70"} />
                {listening && (
                  <span className="absolute inset-0 rounded-lg border border-sky-400/35"
                    style={{animation:"cc2-pulse .9s ease-out infinite"}} />
                )}
              </button>

              {/* Send / Stop */}
              {loading ? (
                <button onClick={handleStop} title="Stop"
                  className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                  style={{background:"rgba(56,189,248,.14)", border:"1px solid rgba(56,189,248,.45)"}}>
                  <Square size={10} fill="currentColor" className="text-sky-400" />
                </button>
              ) : (
                <button onClick={handleSend} disabled={!input.trim()} title="Send (Enter)"
                  className="flex items-center justify-center rounded-lg w-7 h-7 transition-all"
                  style={{
                    background: input.trim() ? "rgba(56,189,248,.2)" : "rgba(56,189,248,.04)",
                    border: `1px solid rgba(56,189,248,${input.trim() ? ".6" : ".1"})`,
                    boxShadow: input.trim() ? "0 0 18px rgba(56,189,248,.28)" : "none",
                    opacity: input.trim() ? 1 : 0.35,
                  }}>
                  <ArrowUp size={13} className="text-sky-400" />
                </button>
              )}
            </div>
          </div>

          {/* Attachment badge */}
          {attachment && (
            <div className="cc2-fadein relative z-10 flex items-center gap-1.5 px-5 pb-3">
              <div className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono text-sky-300"
                style={{background:"rgba(56,189,248,.07)", border:"1px solid rgba(56,189,248,.2)"}}>
                <Paperclip size={8} />
                <span className="max-w-[120px] truncate">{attachment}</span>
                <button onClick={() => setAttachment(null)}><X size={8} className="text-sky-400/40 hover:text-sky-400 transition-colors" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input ref={fileRef} type="file" className="hidden"
          onChange={e => { if(e.target.files?.[0]) setAttachment(e.target.files[0].name); }} />
      </div>
    </>
  );
}
