import { useEffect, useState } from "react";
import { CountUp } from "./CountUp";

interface Stat {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  jitter?: number;
}

const INITIAL: Stat[] = [
  { label: "Projects", value: 1247 },
  { label: "Countries", value: 194 },
  { label: "AI Models", value: 68 },
  { label: "Storage", value: 842.6, decimals: 1, suffix: " TB", jitter: 0.4 },
  { label: "Users", value: 2483910, jitter: 1000 },
  { label: "Network", value: 12.4, decimals: 1, suffix: " Gb/s", jitter: 0.3 },
  { label: "API / s", value: 48291, jitter: 250 },
  { label: "Security", value: 99.98, decimals: 2, suffix: "%" },
  { label: "CPU", value: 42, suffix: "%", jitter: 3 },
  { label: "GPU", value: 67, suffix: "%", jitter: 4 },
  { label: "Memory", value: 58, suffix: "%", jitter: 2 },
  { label: "Nodes", value: 3204, jitter: 4 },
];

export function StatusBar() {
  const [stats, setStats] = useState(INITIAL);
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) =>
        s.map((st) =>
          st.jitter
            ? { ...st, value: Math.max(0, st.value + (Math.random() - 0.5) * st.jitter * 2) }
            : st,
        ),
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-strong pointer-events-auto mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto rounded-2xl px-3 py-2">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex min-w-[110px] flex-col px-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </span>
            <span className="mt-0.5 font-mono text-sm text-foreground text-glow">
              <CountUp value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
            </span>
          </div>
          {i < stats.length - 1 && <span className="h-8 w-px bg-primary/20" />}
        </div>
      ))}
    </div>
  );
}
