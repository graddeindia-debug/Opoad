import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Density = "low" | "medium" | "high";
export type Intensity = "off" | "subtle" | "normal" | "cinematic";
export type PerfMode = "battery" | "balanced" | "ultra";

export interface Settings {
  particleDensity: Density;
  animationIntensity: Intensity;
  performanceMode: PerfMode;
}

const DEFAULTS: Settings = {
  particleDensity: "medium",
  animationIntensity: "normal",
  performanceMode: "balanced",
};

interface Ctx extends Settings {
  set: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  reset: () => void;
  // derived values components read
  particleMultiplier: number;
  animSpeed: number;
  motionEnabled: boolean;
  showStars: boolean;
  showAtmosphere: boolean;
  showInnerParticles: boolean;
  dprMax: number;
  autoRotate: boolean;
}

const SettingsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "opoad.settings.v1";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Settings>(DEFAULTS);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const densityMap: Record<Density, number> = { low: 0.3, medium: 1, high: 2 };
    const intensityMap: Record<Intensity, number> = {
      off: 0,
      subtle: 0.5,
      normal: 1,
      cinematic: 1.6,
    };

    const perf = state.performanceMode;
    // Performance mode adjusts heavy toggles / caps
    const showStars = perf !== "battery";
    const showAtmosphere = perf !== "battery";
    const showInnerParticles = perf !== "battery";
    const dprMax = perf === "battery" ? 1 : perf === "balanced" ? 1.75 : 2;
    const autoRotate = state.animationIntensity !== "off";

    return {
      ...state,
      set: (k, v) => setState((s) => ({ ...s, [k]: v })),
      reset: () => setState(DEFAULTS),
      particleMultiplier: densityMap[state.particleDensity] * (perf === "battery" ? 0.4 : 1),
      animSpeed: intensityMap[state.animationIntensity],
      motionEnabled: state.animationIntensity !== "off",
      showStars,
      showAtmosphere,
      showInnerParticles,
      dprMax,
      autoRotate,
    };
  }, [state]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
