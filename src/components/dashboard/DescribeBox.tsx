import { useState, useEffect, useRef, useCallback } from "react";
import {
  Paperclip,
  Camera,
  Mic,
  Image as ImageIcon,
  Monitor,
  Search,
  Brain,
  Sparkles,
  ArrowUp,
  X,
  Scan,
  FileText,
  ScanLine,
  QrCode,
  Grid3X3,
  Cpu,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DescribeBoxProps {
  onGenerateScript: (title: string, description: string) => void;
  selectedNewsArticle?: { title: string; description: string; id: string } | null;
  onClearArticle?: () => void;
}

export function DescribeBox({
  onGenerateScript,
  selectedNewsArticle,
  onClearArticle,
}: DescribeBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [researchActive, setResearchActive] = useState(false);

  // Mouse coordinates for 3D holographic tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Custom camera overlay states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<
    "photo" | "document" | "ocr" | "qr" | "whiteboard" | "object"
  >("photo");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [ocrTextFound, setOcrTextFound] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestions = [
    {
      label: "Research",
      icon: Search,
      prompt: "Perform deep regulatory research on Indian IT rules...",
    },
    {
      label: "Generate Script",
      icon: Sparkles,
      prompt: "Generate a dual-language viral video script about...",
    },
    {
      label: "Create Presentation",
      icon: Grid3X3,
      prompt: "Create a 5-slide outline on sovereign AI developments...",
    },
    {
      label: "Summarize PDF",
      icon: FileText,
      prompt: "Summarize compliance PDF and flag key audit items...",
    },
    {
      label: "Analyze News",
      icon: Search,
      prompt: "Analyze the RBI repo rate market sentiment impact...",
    },
    {
      label: "Create Video",
      icon: Sparkles,
      prompt: "Develop storyboard ideas for Tata's semiconductor plant...",
    },
    {
      label: "Generate Thumbnail",
      icon: ImageIcon,
      prompt: "Design descriptive prompts for an AI thumbnail model...",
    },
    {
      label: "Translate",
      icon: FileText,
      prompt: "Translate legal disclaimer script into localized Hindi...",
    },
    {
      label: "Fact Check",
      icon: Brain,
      prompt: "Fact check social media rumors on digital privacy acts...",
    },
    {
      label: "Compare",
      icon: Cpu,
      prompt: "Compare Indian Sovereign AI cloud parameters vs global models...",
    },
  ];

  // Monitor news article injection
  useEffect(() => {
    if (selectedNewsArticle) {
      setInputValue(
        `Analyze and generate script for: "${selectedNewsArticle.title}"\nContext: ${selectedNewsArticle.description}`,
      );
      // Smooth scroll the DescribeBox into view if necessary
      const el = document.getElementById("opoad-describe-box");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedNewsArticle]);

  // Handle dynamic typing speed multipliers
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 1500) as unknown as number;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    };
  }, []);

  // 3D holographic mouse tilt tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Smooth responsive angles (max 6 degrees tilt for ultra-premium subtle feel)
    const angleX = (yc - y) / 18;
    const angleY = (x - xc) / 28;
    setTilt({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // CAMERA FEED MANAGEMENT
  const startCamera = async (mode: typeof cameraMode) => {
    setCameraMode(mode);
    setScanProgress(0);
    setScanResult(null);
    setOcrTextFound([]);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn(
        "Webcam blocked or sandboxed in iframe. Falling back to high-fidelity scan simulation.",
      );
      setCameraStream(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
  };

  const handleScanCompletion = useCallback(() => {
    if (cameraMode === "ocr") {
      setOcrTextFound([
        "RESERVE BANK OF INDIA",
        "Repo Rate remains at 6.5%",
        "Retail inflation prioritized",
        "Sovereign AI Node Active",
      ]);
      setScanResult("OCR processing complete. Captured 4 blocks of legal/financial texts.");
    } else if (cameraMode === "qr") {
      setScanResult("QR Match: https://opoad.ai/secure-verify-node/30491-a");
    } else if (cameraMode === "document") {
      setScanResult("Document edge detection successful. Saved PDF segment (Letter size).");
    } else if (cameraMode === "object") {
      setScanResult(
        "Neural classification complete. Object ID: Core Chip Module (Confidence: 98.4%).",
      );
    } else {
      setScanResult("Captured premium high-resolution AI layout frame.");
    }
  }, [cameraMode]);

  // Camera scan progress simulation
  useEffect(() => {
    if (!cameraOpen) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleScanCompletion();
          return 100;
        }
        return prev + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [cameraOpen, cameraMode, handleScanCompletion]);

  const applyScanResultToInput = () => {
    if (cameraMode === "ocr" && ocrTextFound.length > 0) {
      setInputValue((prev) => `${prev}\n[OCR Text Scanned]: ${ocrTextFound.join(" | ")}`);
    } else if (scanResult) {
      setInputValue((prev) => `${prev}\n[AI Scanner Input]: ${scanResult}`);
    }
    stopCamera();
  };

  const handleSendQuery = () => {
    if (!inputValue.trim()) return;

    if (selectedNewsArticle) {
      onGenerateScript(selectedNewsArticle.title, selectedNewsArticle.description);
    } else {
      onGenerateScript("Custom AI Generated Campaign", inputValue);
    }

    setInputValue("");
    if (onClearArticle) onClearArticle();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 px-2 select-none">
      {/* Self-contained styling module for high-fidelity interactive animations */}
      <style>{`
        @keyframes fluxTravel {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @keyframes cursorPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 3px #00D9FF);
          }
        }
        @keyframes floatDust {
          0% {
            transform: translateY(12px) translateX(0);
            opacity: 0;
          }
          40% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(-25px) translateX(var(--drift, 12px));
            opacity: 0;
          }
        }
      `}</style>

      {/* Signature Holographic 3D Interactive Describe Box */}
      <div
        id="opoad-describe-box"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.015 : 1})`,
          transition: isHovered
            ? "transform 0.08s ease-out, shadow 0.5s ease-out"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), shadow 0.5s ease-out",
        }}
        className={`relative w-[92%] sm:w-[86%] rounded-[28px] p-[1.5px] z-20 ${
          isFocused
            ? "shadow-[0_30px_70px_rgba(0,217,255,0.25),_inset_0_1px_3px_rgba(255,255,255,0.18)]"
            : isHovered
              ? "shadow-[0_24px_55px_rgba(0,217,255,0.16)]"
              : "shadow-[0_16px_40px_rgba(0,0,0,0.65)]"
        }`}
      >
        {/* DUAL-LAYER RESPONSIVE PLASMA ENERGY BORDER */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="20%" stopColor="#4FD6FF" />
              <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#EC4899" stopOpacity="0.45" />
              <stop offset="78%" stopColor="#EAB308" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00D9FF" />
            </linearGradient>
          </defs>

          {/* Deep blur ambient glow backing vector */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="28"
            fill="none"
            stroke="url(#plasmaGradient)"
            strokeWidth={isFocused || isTyping ? "5" : "3.5"}
            className="opacity-45 blur-[5px] transition-all duration-500"
            style={{
              vectorEffect: "non-scaling-stroke",
              animation: `fluxTravel ${isTyping ? "4s" : isFocused ? "6s" : "15s"} linear infinite`,
              strokeDasharray: "140 280",
            }}
          />

          {/* High-definition sharp core vector energy stream */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="28"
            fill="none"
            stroke="url(#plasmaGradient)"
            strokeWidth={isFocused || isTyping ? "2.2" : "1.2"}
            className="opacity-95 transition-all duration-300"
            style={{
              vectorEffect: "non-scaling-stroke",
              animation: `fluxTravel ${isTyping ? "2.5s" : isFocused ? "4s" : "11s"} linear infinite`,
              strokeDasharray: "100 200",
            }}
          />
        </svg>

        {/* CORNER SECURITY HUD BRACKETS */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-[24px] pointer-events-none transition-colors duration-300 group-hover:border-cyan-400/80" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-[24px] pointer-events-none transition-colors duration-300 group-hover:border-cyan-400/80" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-[24px] pointer-events-none transition-colors duration-300 group-hover:border-cyan-400/80" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400/40 rounded-br-[24px] pointer-events-none transition-colors duration-300 group-hover:border-cyan-400/80" />

        {/* FLOATING HOLOGRAPHIC DUST PARTICLES */}
        {(isFocused || isTyping) && (
          <div className="absolute inset-0 overflow-hidden rounded-[27px] pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[3px] h-[3px] rounded-full bg-cyan-400/80"
                style={
                  {
                    bottom: "15%",
                    left: `${18 + i * 14}%`,
                    animation: `floatDust ${2.8 + i * 0.4}s infinite ease-in-out`,
                    animationDelay: `${i * 0.3}s`,
                    "--drift": `${(i % 2 === 0 ? 1 : -1) * 16}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* SLOWLY MOVING AMBIENT SCAN LINES */}
        {(isFocused || isTyping) && (
          <div className="absolute inset-0 overflow-hidden rounded-[27px] pointer-events-none">
            <div className="w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent absolute top-0 animate-[scanline_7s_linear_infinite]" />
          </div>
        )}

        {/* INTERACTIVE GRID PATTERN (fades in on hover/focus) */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] rounded-[27px] pointer-events-none transition-opacity duration-500 ${
            isFocused || isHovered ? "opacity-60" : "opacity-20"
          }`}
        />

        {/* Outer card surface: Premium thick Glassmorphism substrate */}
        <div className="relative rounded-[27px] bg-[#05070A]/85 backdrop-blur-[40px] p-4 sm:p-5 flex flex-col gap-3.5 border border-white/5 overflow-hidden">
          {/* Subtle soft blue internal glow flare */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Selected News Article Notification HUD */}
          {selectedNewsArticle && (
            <div className="flex items-center justify-between rounded-xl bg-cyan-950/30 border border-cyan-400/30 px-3.5 py-2.5 text-xs text-cyan-200 animate-fade-in relative z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-mono text-[9px] tracking-widest uppercase text-cyan-400">
                  Target Ingress:
                </span>
                <span className="font-semibold line-clamp-1">{selectedNewsArticle.title}</span>
              </div>
              <button
                onClick={onClearArticle}
                className="text-cyan-400 hover:text-white transition p-0.5 ml-2"
                title="Clear selected target"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Main Input Area Row */}
          <div className="flex items-start gap-4 relative z-10">
            {/* Left side: Advanced living OPOAD AI Orb */}
            <div className="relative flex-shrink-0 mt-0.5">
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center bg-black/90 border border-cyan-500/35 overflow-hidden shadow-[0_0_20px_rgba(0,217,255,0.18)] transition-all duration-500 ${
                  isTyping
                    ? "scale-110 shadow-[0_0_30px_rgba(0,217,255,0.45)] border-cyan-300"
                    : isFocused
                      ? "scale-105 border-cyan-400 shadow-[0_0_25px_rgba(0,217,255,0.3)]"
                      : "hover:scale-105"
                }`}
              >
                {/* Rotating holographic core elements */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-600/25 via-black to-blue-500/15" />
                <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-1 border border-dashed border-blue-500/25 rounded-full animate-[spin_8s_linear_reverse_infinite]" />

                {/* Breathing plasma core node */}
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 filter blur-[1px] transition-all duration-300 ${
                    isTyping
                      ? "animate-ping scale-135 opacity-90"
                      : isFocused
                        ? "animate-pulse scale-110"
                        : "animate-pulse scale-90"
                  }`}
                />

                <span className="absolute text-[8px] font-mono text-cyan-300/80 top-1 scale-75 select-none font-extrabold tracking-widest">
                  OP
                </span>
                <span className="absolute text-[7px] font-mono text-cyan-400/40 bottom-1 scale-75 select-none">
                  N9
                </span>
              </div>
            </div>

            {/* Middle: Expanding Textarea with integrated glowing caret */}
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={2}
                placeholder="Submit prompt, ask for dual-language scripts, research complex Indian regulatory updates, or generate videos..."
                className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-400/50 focus:outline-none focus:ring-0 resize-none pr-4 leading-relaxed font-sans"
                style={{ caretColor: "#00D9FF" }}
              />
              {/* Dynamic responsive bottom feedback underline */}
              <div
                className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-cyan-400/50 via-blue-400/30 to-transparent transition-all duration-700 ${
                  isFocused ? "w-full" : "w-1/4"
                }`}
              />
            </div>
          </div>

          {/* Holographic divider rail with cyber metadata */}
          <div className="flex items-center justify-between my-0.5 relative z-10">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
            <div className="mx-4 text-[7px] font-mono tracking-[0.25em] text-cyan-500/30 uppercase select-none flex items-center gap-1.5">
              <Zap size={7} className="animate-pulse" />
              <span>OPOAD_CORE_ONLINE // 0x773A</span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
          </div>

          {/* Bottom Actions and Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            {/* Left Controls: Uploads, Scanners & Core AI Toggle HUDs */}
            <div className="flex items-center flex-wrap gap-1.5">
              {/* Attach File Button */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/15 transition-all duration-200"
                title="Attach Regulatory Brief"
              >
                <Paperclip size={15} />
              </button>

              {/* Inbuilt Custom AI Camera Button */}
              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/15 transition-all duration-200"
                title="Launch AI Scan Viewport"
              >
                <Camera size={15} />
              </button>

              {/* Upload Image Button */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/15 transition-all duration-200"
                title="Upload Photo Asset"
              >
                <ImageIcon size={15} />
              </button>

              {/* Screen capture simulation */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/15 transition-all duration-200"
                title="Capture Display Frame"
              >
                <Monitor size={15} />
              </button>

              {/* Interactive Voice dictation simulation */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/15 transition-all duration-200"
                title="Dual-Language Voice Input"
              >
                <Mic size={15} />
              </button>

              {/* Technical Separator bar */}
              <span className="h-4 w-px bg-slate-800/80 mx-1.5" />

              {/* Toggle Research Mode HUD */}
              <button
                type="button"
                onClick={() => setResearchActive(!researchActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono tracking-wider transition-all duration-300 ${
                  researchActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.25)]"
                    : "bg-transparent text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Search size={11} className={researchActive ? "animate-pulse text-cyan-300" : ""} />
                <span>RESEARCH_ENG</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${researchActive ? "bg-cyan-400 animate-ping" : "bg-slate-600"}`}
                />
              </button>

              {/* Toggle Deep Think Mode HUD */}
              <button
                type="button"
                onClick={() => setDeepThinkActive(!deepThinkActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono tracking-wider transition-all duration-300 ${
                  deepThinkActive
                    ? "bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    : "bg-transparent text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Brain
                  size={11}
                  className={deepThinkActive ? "animate-pulse text-purple-300" : ""}
                />
                <span>DEEP_REASON</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${deepThinkActive ? "bg-purple-400 animate-ping" : "bg-slate-600"}`}
                />
              </button>
            </div>

            {/* Right Side Controls: Dynamic submit action pill */}
            <div className="flex items-center gap-2 ml-auto">
              {selectedNewsArticle ? (
                /* Primary Highlighted Action for News Wire Card interaction */
                <Button
                  onClick={handleSendQuery}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,217,255,0.45)] border border-cyan-300 transition duration-300 scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={13} className="text-black animate-bounce" />
                  <span>SYNTHESIZE CAMPAIGN</span>
                </Button>
              ) : (
                /* Default Futuristic Send Action button */
                <button
                  onClick={handleSendQuery}
                  disabled={!inputValue.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    inputValue.trim()
                      ? "bg-cyan-500 border-cyan-400 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(0,217,255,0.5)] cursor-pointer"
                      : "bg-slate-900 border-slate-800/85 text-slate-600 cursor-not-allowed"
                  }`}
                  title="Inject Signal"
                >
                  <ArrowUp size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion Chips Section */}
      <div className="w-[94%] sm:w-[90%] flex flex-col gap-2.5 z-10">
        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500/80 text-center">
          OPOAD Suggester Array Node
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setInputValue(s.prompt);
                setIsFocused(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider border border-cyan-500/10 bg-[#05070A]/50 backdrop-blur-md text-slate-400 hover:text-cyan-300 hover:border-cyan-500/35 hover:bg-[#05070A]/80 transition duration-300 shadow-sm"
            >
              <s.icon size={11} className="text-cyan-400/80" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INBUILT CUSTOM SCAN CAMERA OVERLAY (Redesigned with Glassmorphism) */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-[25px] p-4 animate-fade-in select-none">
          {/* Cyber Dashboard Scanning Interface Frame */}
          <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/25 bg-[#05070A]/90 p-5 overflow-hidden shadow-[0_0_80px_rgba(0,217,255,0.22)]">
            {/* HUD Corner braces */}
            <div className="pointer-events-none absolute inset-0">
              <div className="grid-overlay opacity-15" />
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl opacity-60" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl opacity-60" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl opacity-60" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400 rounded-br-xl opacity-60" />
            </div>

            {/* Header HUD */}
            <div className="relative flex items-center justify-between border-b border-cyan-500/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-300">
                  OPOAD Intelligent Scan Array
                </h3>
              </div>
              <button
                onClick={stopCamera}
                className="rounded-full bg-slate-900 border border-slate-800 p-1.5 text-slate-400 hover:text-white transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Camera Viewport and Scan lasers */}
            <div className="relative aspect-[4/3] rounded-2xl border border-cyan-500/20 bg-slate-950/60 mt-4 overflow-hidden flex items-center justify-center">
              <div className="absolute top-3 left-3 z-20 font-mono text-[8px] text-cyan-400/80 bg-black/60 border border-cyan-500/10 px-2.5 py-1 rounded">
                ISO 400 | CAM_DEV_01 // COGNITIVE_BEAM
              </div>

              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                /* Fallback high-fidelity cyber simulations */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-radial-gradient(circle,rgba(34,211,238,0.06),transparent_80%)">
                  <div className="absolute w-[85%] h-[80%] border border-cyan-500/10 rounded-xl flex items-center justify-center">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-400" />

                    {cameraMode === "ocr" && (
                      <div className="space-y-2 max-w-[80%]">
                        <div className="border border-green-400/40 bg-green-950/20 px-2.5 py-1 rounded text-[10px] font-mono text-green-300 animate-pulse">
                          [OCR TARGET]: RESERVE BANK OF INDIA
                        </div>
                        <div className="border border-green-400/40 bg-green-950/20 px-2.5 py-1 rounded text-[10px] font-mono text-green-300 animate-pulse">
                          [OCR TARGET]: REPO RATE AT 6.5%
                        </div>
                      </div>
                    )}

                    {cameraMode === "object" && (
                      <div className="absolute top-1/4 left-1/3 border-2 border-amber-500 bg-amber-950/30 p-2.5 rounded-lg text-left animate-pulse">
                        <p className="text-[8px] font-mono text-amber-300 uppercase tracking-widest font-bold">
                          OBJECT_DETECTED
                        </p>
                        <p className="text-[11px] text-white font-semibold">
                          Regulatory Document Scan
                        </p>
                        <p className="text-[9px] font-mono text-amber-400 mt-0.5">
                          Confidence: 98.42%
                        </p>
                      </div>
                    )}

                    {cameraMode === "qr" && (
                      <div className="w-24 h-24 border border-dashed border-cyan-400 rounded-lg flex items-center justify-center p-2 bg-cyan-950/25 animate-pulse">
                        <QrCode size={40} className="text-cyan-400" />
                      </div>
                    )}
                  </div>

                  <Scan size={44} className="text-cyan-500/25 animate-pulse animate-floaty" />
                  <p className="text-[11px] font-mono text-slate-400 max-w-sm mt-3 leading-relaxed">
                    CONNECTING_LOCAL_AI_CORE // Simulated telemetry feed active.
                  </p>
                </div>
              )}

              {/* Glowing animated scanner laser beam */}
              <div className="absolute left-0 right-0 top-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.85)] z-10 animate-[scanline_3.5s_ease-in-out_infinite]" />

              {/* Laser Grid Scan Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,217,255,0.03),rgba(0,217,255,0.01),rgba(0,217,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none" />

              <div className="absolute bottom-3 right-3 z-20 font-mono text-[8px] text-slate-400 bg-black/70 px-2 py-1 rounded">
                FRAME RATE: 60FPS // SHIELD_C_1
              </div>

              {/* Progress Bar Overlay */}
              <div className="absolute bottom-3 left-3 z-20 bg-black/70 border border-cyan-500/10 p-2 rounded w-48 text-left">
                <div className="flex justify-between text-[8px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  <span>NEURAL_SCANNING_ARRAY</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Selector list for scanning capabilities */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
              {(
                [
                  { id: "photo", label: "Camera Photo", icon: Camera },
                  { id: "document", label: "Doc Scan", icon: FileText },
                  { id: "ocr", label: "AI OCR Text", icon: ScanLine },
                  { id: "qr", label: "QR Scanner", icon: QrCode },
                  { id: "whiteboard", label: "Whiteboard", icon: Grid3X3 },
                  { id: "object", label: "AI Object", icon: Scan },
                ] as const
              ).map((mode) => {
                const isActive = cameraMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => startCamera(mode.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isActive
                        ? "border-cyan-400 bg-cyan-950/35 text-cyan-300 shadow-[0_0_10px_rgba(0,217,255,0.15)]"
                        : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <mode.icon size={16} className="mb-1" />
                    <span className="text-[9px] font-mono uppercase tracking-wider">
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results block & Actions */}
            {scanResult && (
              <div className="bg-cyan-950/20 border border-cyan-500/15 rounded-xl p-3.5 mt-4 text-left animate-fade-in space-y-2">
                <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Telemetry Captured Result
                </p>
                <p className="text-xs text-slate-200 leading-relaxed">{scanResult}</p>
                {cameraMode === "ocr" && ocrTextFound.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ocrTextFound.map((block, i) => (
                      <span
                        key={i}
                        className="bg-cyan-900/30 border border-cyan-500/25 rounded px-2 py-0.5 text-[9px] text-cyan-300 font-mono"
                      >
                        {block}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-cyan-500/15 pt-4 mt-4">
              <Button
                variant="outline"
                onClick={stopCamera}
                className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-900 text-xs py-1.5"
              >
                Discard / Close
              </Button>
              <Button
                disabled={!scanResult}
                onClick={applyScanResultToInput}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs py-1.5 px-4 shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center gap-1.5"
              >
                <Check size={12} />
                <span>Inject Scanned Data</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
