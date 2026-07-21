import { useEffect } from "react";
import { X, Gauge, Sparkles, Cpu, RotateCcw } from "lucide-react";
import { useSettings, type Density, type Intensity, type PerfMode } from "@/lib/settings";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DENSITY: { value: Density; label: string; hint: string }[] = [
  { value: "low", label: "Low", hint: "Minimal particles" },
  { value: "medium", label: "Medium", hint: "Balanced" },
  { value: "high", label: "High", hint: "Dense field" },
];
const INTENSITY: { value: Intensity; label: string; hint: string }[] = [
  { value: "off", label: "Off", hint: "Static" },
  { value: "subtle", label: "Subtle", hint: "Calm" },
  { value: "normal", label: "Normal", hint: "Recommended" },
  { value: "cinematic", label: "Cinematic", hint: "Maximum" },
];
const PERF: { value: PerfMode; label: string; hint: string }[] = [
  { value: "battery", label: "Battery", hint: "Lightweight" },
  { value: "balanced", label: "Balanced", hint: "Default" },
  { value: "ultra", label: "Ultra", hint: "Full fidelity" },
];

export function SettingsPanel({ open, onClose }: Props) {
  const s = useSettings();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6">
      <button
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
      />
      <aside className="glass-strong relative z-10 flex h-full max-h-[calc(100vh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              System
            </p>
            <h2 className="text-lg font-light tracking-wide text-foreground text-glow">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <Section
            icon={<Sparkles size={14} strokeWidth={1.5} />}
            title="Particle Density"
            description="Number of particles across the scene."
          >
            <SegmentedGroup
              options={DENSITY}
              value={s.particleDensity}
              onChange={(v) => s.set("particleDensity", v)}
            />
          </Section>

          <Section
            icon={<Gauge size={14} strokeWidth={1.5} />}
            title="Animation Intensity"
            description="Speed and amplitude of motion across the interface."
          >
            <SegmentedGroup
              options={INTENSITY}
              value={s.animationIntensity}
              onChange={(v) => s.set("animationIntensity", v)}
            />
          </Section>

          <Section
            icon={<Cpu size={14} strokeWidth={1.5} />}
            title="Performance Mode"
            description="Battery disables heavy effects. Ultra maximises fidelity."
          >
            <SegmentedGroup
              options={PERF}
              value={s.performanceMode}
              onChange={(v) => s.set("performanceMode", v)}
            />
          </Section>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Live Preview
            </p>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80">
              Changes apply instantly to the operating system. No reload required.
            </p>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-primary/20 px-6 py-4">
          <button
            onClick={s.reset}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            <RotateCcw size={12} strokeWidth={1.5} /> Reset defaults
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_var(--color-glow)]"
          >
            Done
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNodeLike;
  title: string;
  description: string;
  children: ReactNodeLike;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-sm font-medium tracking-wide text-foreground">{title}</h3>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

type ReactNodeLike = import("react").ReactNode;

function SegmentedGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="glass grid grid-cols-2 gap-1 rounded-xl p-1 sm:grid-cols-4">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={
              "rounded-lg px-2 py-2 text-center transition-all " +
              (active
                ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_var(--color-glow),0_0_16px_var(--color-glow)]"
                : "text-foreground/70 hover:bg-primary/5 hover:text-foreground")
            }
          >
            <span className="block text-xs font-medium tracking-wide">{o.label}</span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              {o.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
