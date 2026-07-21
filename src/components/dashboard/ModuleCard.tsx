import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useSettings } from "@/lib/settings";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: string;
  delay?: number;
  onOpenDetails?: () => void;
}

export function ModuleCard({
  icon: Icon,
  title,
  description,
  status = "ONLINE",
  delay = 0,
  onOpenDetails,
}: Props) {
  const { animSpeed, motionEnabled } = useSettings();
  const hoverLift = motionEnabled ? -4 * animSpeed : 0;
  const hoverScale = motionEnabled ? 1 + 0.02 * animSpeed : 1;
  return (
    <motion.button
      type="button"
      initial={motionEnabled ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: motionEnabled ? delay : 0,
        duration: motionEnabled ? 0.6 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: hoverLift, scale: hoverScale }}
      onClick={onOpenDetails}
      className="group glass relative h-full w-full overflow-hidden rounded-2xl p-4 text-left transition-shadow duration-500 hover:shadow-[0_0_40px_-4px_var(--color-glow)]"
    >
      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-primary/70" />
      <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-primary/70" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-primary/70" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-primary/70" />

      {/* Sheen */}
      <span className="pointer-events-none absolute -inset-x-8 -top-full h-40 rotate-12 bg-gradient-to-b from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-y-[220%]" />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:shadow-[0_0_20px_var(--color-glow)]">
          <Icon size={18} strokeWidth={1.4} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow shadow-[0_0_8px_var(--color-glow)]" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
            {status}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium tracking-wide text-foreground">{title}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
