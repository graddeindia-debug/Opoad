import { useState, useEffect, useRef } from "react";
import {
  type LucideIcon,
  Cpu,
  Brain,
  Search,
  Globe,
  CheckCircle,
  FileText,
  ShieldCheck,
  Network,
  Tv,
  Calendar,
  Sparkles,
  Zap,
  FastForward,
  RotateCcw,
} from "lucide-react";

interface AiProcessingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  title?: string;
  description?: string;
}

interface ProcessingStep {
  label: string;
  subText: string;
  icon: LucideIcon;
  duration: number; // base duration in ms
}

const STEPS: ProcessingStep[] = [
  {
    label: "Initializing Intelligence",
    subText: "Loading deep reasoning neural arrays & mapping context vector fields...",
    icon: Cpu,
    duration: 1000,
  },
  {
    label: "Scanning Global Sources",
    subText: "Sourcing legal, regulatory, and financial news wires via OPOAD Core...",
    icon: Globe,
    duration: 1200,
  },
  {
    label: "Searching Trusted Websites",
    subText: "Crawling authenticated policy archives & digital records...",
    icon: Search,
    duration: 1000,
  },
  {
    label: "Reading Articles",
    subText: "Extracting semantic sentiments & tokenizing regional entities...",
    icon: FileText,
    duration: 900,
  },
  {
    label: "Verifying Facts",
    subText: "Triangulating claims against consensus databases & sovereign trust stores...",
    icon: ShieldCheck,
    duration: 1100,
  },
  {
    label: "Connecting Information",
    subText: "Assembling knowledge graphs & mapping historical cause-and-effect nodes...",
    icon: Network,
    duration: 1000,
  },
  {
    label: "Deep Reasoning",
    subText: "Synthesizing deep-reasoning paths for high-impact target analysis...",
    icon: Brain,
    duration: 1400,
  },
  {
    label: "Writing Script",
    subText: "Structuring premium bilingual script loops (Hindi & English)...",
    icon: Sparkles,
    duration: 1300,
  },
  {
    label: "Generating Visual Ideas",
    subText: "Fusing teleprompter pacing with rich interactive HUD visual cues...",
    icon: Tv,
    duration: 1000,
  },
  {
    label: "Building Timeline",
    subText: "Finalizing execution flow & preparing telemetry scrolling indices...",
    icon: Calendar,
    duration: 800,
  },
  {
    label: "Final Response Ready",
    subText: "Sync complete. Ready to inject compiled bilingual assets to dashboard.",
    icon: CheckCircle,
    duration: 600,
  },
];

export function AiProcessingOverlay({
  isOpen,
  onComplete,
  title = "Global Intelligence Core",
  description = "",
}: AiProcessingOverlayProps) {
  // Always invoke React Hooks at the very top level in the same order
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [interactivePulses, setInteractivePulses] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pulsesCountRef = useRef(0);

  // 3D Rotating Sphere Simulation on Canvas (GPU-accelerated, 60 FPS)
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotationX = 0;
    let rotationY = 0;

    // Set high pixel density
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neural nodes in sphere shape
    const numParticles = 120;
    const particles: { x3d: number; y3d: number; z3d: number; size: number }[] = [];
    const radius = 90;

    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particles.push({
        x3d: radius * Math.sin(phi) * Math.cos(theta),
        y3d: radius * Math.sin(phi) * Math.sin(theta),
        z3d: radius * Math.cos(phi),
        size: 1.5 + Math.random() * 2,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Spin speed increases slightly during typing/thinking
      const spinSpeedX = 0.003 * speedMultiplier;
      const spinSpeedY = 0.005 * speedMultiplier;
      rotationX += spinSpeedX;
      rotationY += spinSpeedY;

      // Draw outer ambient radar sweeps
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.strokeStyle = "rgba(0, 217, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 217, 255, 0.08)";
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(0, 0, 115, rotationY, rotationY + Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project & render 3D particles
      const projected = particles.map((p) => {
        // Rotate Y
        const x1 = p.x3d * Math.cos(rotationY) - p.z3d * Math.sin(rotationY);
        const z1 = p.x3d * Math.sin(rotationY) + p.z3d * Math.cos(rotationY);

        // Rotate X
        const y2 = p.y3d * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        const z2 = p.y3d * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        // Perspective projection
        const depthFactor = 300 / (300 + z2);
        const screenX = w / 2 + x1 * depthFactor;
        const screenY = h / 2 + y2 * depthFactor;

        return {
          x: screenX,
          y: screenY,
          z: z2,
          size: p.size * depthFactor,
          depthFactor,
        };
      });

      // Sort by depth (back to front) for natural overlap
      projected.sort((a, b) => b.z - a.z);

      // Draw neural links/connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        let connections = 0;
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 32 && connections < 3) {
            const alpha = (1 - dist / 32) * 0.22 * p1.depthFactor;
            ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw nodes
      projected.forEach((p) => {
        const isFront = p.z < 0;
        const alpha = isFront ? 0.85 : 0.35;
        const glowRadius = p.size * (isFront ? 2.5 : 1.2);

        // Outer neon aura glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `rgba(79, 214, 255, ${alpha})`);
        grad.addColorStop(0.3, `rgba(0, 217, 255, ${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(0, 217, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isOpen, speedMultiplier]);

  // Handle active status sequence transition & smooth progress increments
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const startStepTransition = (index: number) => {
      if (!active) return;
      if (index >= STEPS.length) {
        // AI processing successfully complete!
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 800);
        return;
      }

      setCurrentStepIndex(index);
      const step = STEPS[index];
      const stepDuration = step.duration / speedMultiplier;

      // Dynamic sub-progress interpolation for the glowing loader
      const startProgress = (index / STEPS.length) * 100;
      const endProgress = ((index + 1) / STEPS.length) * 100;
      const stepsCount = 15;
      const intervalMs = stepDuration / stepsCount;
      let stepProgressIndex = 0;

      const incrementProgress = () => {
        if (!active) return;
        if (stepProgressIndex < stepsCount) {
          const delta = (endProgress - startProgress) / stepsCount;
          setProgress((prev) => Math.min(prev + delta, endProgress));
          stepProgressIndex++;
          progressTimer = setTimeout(incrementProgress, intervalMs);
        }
      };

      incrementProgress();

      stepTimer = setTimeout(() => {
        startStepTransition(index + 1);
      }, stepDuration);
    };

    // Begin cascade sequence
    startStepTransition(0);

    return () => {
      active = false;
      clearTimeout(stepTimer);
      clearTimeout(progressTimer);
    };
  }, [isOpen, speedMultiplier, onComplete]);

  // Click core to trigger elegant ripple shockwave
  const handleCoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pulsesCountRef.current++;
    const newPulse = { id: pulsesCountRef.current, x, y };
    setInteractivePulses((prev) => [...prev, newPulse]);

    // Fast click speeds up rotation briefly
    setSpeedMultiplier((m) => Math.min(m + 0.5, 3));
    setTimeout(() => {
      setSpeedMultiplier((m) => Math.max(m - 0.5, 1));
    }, 1800);

    setTimeout(() => {
      setInteractivePulses((prev) => prev.filter((p) => p.id !== newPulse.id));
    }, 1000);
  };

  // Safe early return conditional block for JSX rendering
  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex] || STEPS[0];
  const CurrentIcon = currentStep.icon;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070A]/95 backdrop-blur-[45px] p-4 text-center overflow-y-auto select-none transition-all duration-700 animate-fade-in"
    >
      {/* Immersive background spatial grids & glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="grid-overlay opacity-15" />
        {/* Soft blue cosmic ambient lights */}
        <div className="absolute -top-1/4 -left-1/4 h-[70vw] w-[70vw] rounded-full bg-cyan-500/10 filter blur-[150px] animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[70vw] w-[70vw] rounded-full bg-blue-600/10 filter blur-[150px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 filter blur-[100px]" />
      </div>

      {/* Holographic Header HUD */}
      <div className="relative z-10 mb-6 max-w-xl space-y-2">
        <div className="animate-pulse-glow inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-950/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400">
          <Zap size={11} className="text-cyan-400 animate-bounce" />
          <span>Super Intelligence Sync Active</span>
        </div>
        <h1 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title || "OPOAD Cognitive Matrix"}
        </h1>
        {description && (
          <p className="mx-auto max-w-md line-clamp-1 text-xs leading-relaxed text-slate-400/80">
            Target Query: "{description}"
          </p>
        )}
      </div>

      {/* CENTERPIECE: Floating Holographic AI Core Frame */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        {/* Double circular glass rings rotating */}
        <div className="absolute h-72 w-72 rounded-full border border-cyan-500/15 animate-[spin_15s_linear_infinite]" />
        <div className="absolute h-64 w-64 rounded-full border border-dashed border-cyan-500/10 animate-[spin_25s_linear_reverse_infinite]" />

        {/* Breathing glowing drop shadow backplate */}
        <div className="animate-pulse-glow absolute h-44 w-44 rounded-full bg-cyan-500/10 filter blur-[40px]" />

        {/* Core Click Target Container */}
        <div
          onClick={handleCoreClick}
          className="group relative flex h-56 w-56 items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95"
          title="Click to interact with OPOAD Core"
        >
          {/* Cyber Ring HUD lines with corner ticks */}
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30 border-t-transparent border-b-transparent animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-blue-500/20 border-l-transparent border-r-transparent animate-[spin_12s_linear_reverse_infinite]" />

          {/* Main 3D projected Canvas */}
          <canvas
            ref={canvasRef}
            className="h-48 w-48 rounded-full pointer-events-none"
            style={{ width: "192px", height: "192px" }}
          />

          {/* Core HUD status tag */}
          <div className="absolute bottom-2 rounded bg-black/80 border border-cyan-500/20 px-2.5 py-0.5 text-[8px] font-mono uppercase tracking-widest text-cyan-400 select-none opacity-60 transition duration-200 group-hover:opacity-100">
            CORE_ROTATION: {speedMultiplier.toFixed(1)}x
          </div>

          {/* Interactive touch ripple elements */}
          {interactivePulses.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none rounded-full border border-cyan-400 bg-cyan-500/10 animate-[ripple_1s_ease-out_forwards]"
              style={{
                left: p.x,
                top: p.y,
                width: "12px",
                height: "12px",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* CENTRAL PROCESSING HUD STATS */}
      <div className="relative z-10 w-full max-w-lg space-y-6 mt-4">
        {/* Beautiful Glassmorphic status console */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-md">
          {/* Terminal edge corners */}
          <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-500/40" />
          <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-500/40" />
          <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-500/40" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-500/40" />

          {/* Status Icon & Message Header */}
          <div className="flex items-center gap-3 border-b border-cyan-500/10 pb-3 mb-3 text-left">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 animate-pulse">
              <CurrentIcon size={18} className="animate-bounce" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Active Processing Sequence ({currentStepIndex + 1}/{STEPS.length})
              </p>
              <h2 className="text-sm font-semibold tracking-wider text-white uppercase mt-0.5">
                {currentStep.label}
              </h2>
            </div>
          </div>

          {/* Moving status console lines */}
          <div className="space-y-1.5 text-left font-mono text-[11px]">
            <p className="text-cyan-200/90 leading-relaxed animate-pulse">
              &gt; {currentStep.subText}
            </p>
            <div className="text-slate-500 space-y-1 mt-2.5 border-t border-cyan-500/5 pt-2">
              <p className="flex items-center justify-between">
                <span>[OP_NODE] COGNITIVE_THREAD_ACTIVE_ID:</span>
                <span className="text-cyan-400">0xOPOAD_773A</span>
              </p>
              <p className="flex items-center justify-between">
                <span>[DATA_STREAM] CONSENSUS_LATENCY_INDEX:</span>
                <span className="text-cyan-400">0.021ms</span>
              </p>
              <p className="flex items-center justify-between">
                <span>[VERIFIER_SYNC] SOVEREIGN_COMPLIANCE_KEY:</span>
                <span className="text-green-400 font-bold">VERIFIED_SECURE</span>
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS LINE HUD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>COGNITIVE MATRIX SYNC</span>
            </div>
            <span className="font-bold text-cyan-400">{Math.round(progress)}% COMPLETE</span>
          </div>

          {/* Glowing Progress track with particle slider */}
          <div className="relative h-2.5 w-full rounded-full bg-slate-950 border border-cyan-500/20 p-0.5 overflow-hidden">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,217,255,0.8)]"
              style={{ width: `${progress}%` }}
            >
              {/* Energy particle emission travelling along top edge */}
              <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white filter blur-[1px] shadow-[0_0_10px_#fff] animate-pulse" />
            </div>

            {/* Background grid markings inside bar track */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_9%,rgba(0,217,255,0.15)_10%)] bg-[size:10%_100%] pointer-events-none" />
          </div>
        </div>

        {/* HUD INTERACTIVE CONTROLS BAR */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Accelerator trigger */}
          <button
            type="button"
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2.2 : 1))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono tracking-wider transition-all duration-200 ${
              speedMultiplier > 1
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,217,255,0.15)]"
                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <FastForward size={12} className={speedMultiplier > 1 ? "animate-pulse" : ""} />
            <span>
              {speedMultiplier > 1 ? "ACCELERATION_STAGED (2.2x)" : "ACCELERATE_SYNTHESIS"}
            </span>
          </button>

          {/* Instant Reset Trigger */}
          <button
            type="button"
            onClick={() => {
              setProgress(0);
              setCurrentStepIndex(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-[10px] font-mono tracking-wider transition-all"
            title="Re-synchronize analysis core"
          >
            <RotateCcw size={12} />
            <span>RESET_SYNC</span>
          </button>
        </div>
      </div>
    </div>
  );
}
