import { useEffect, useState } from "react";
import { Bell, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  onOpenSettings: () => void;
}

export function TopNav({ onOpenSettings }: Props) {
  const [time, setTime] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="pointer-events-auto flex items-center justify-between px-6 py-4">
      <div className="flex flex-col items-start gap-0.5">
        <img
          src="/opoad-logo-transparent.png"
          alt="OPOAD"
          className="h-10 w-auto object-contain"
          style={{
            filter:
              "brightness(1.8) drop-shadow(0 0 18px rgba(56,189,248,0.9)) drop-shadow(0 0 6px rgba(255,255,255,0.6)) drop-shadow(0 0 40px rgba(56,189,248,0.5))",
          }}
        />
        <p className="font-mono text-[9px] tracking-[0.32em] text-sky-400/80 pl-1">
          INTELLIGENCE · AUTOMATION · FUTURE
        </p>
      </div>

      <div className="hidden md:flex glass items-center gap-3 rounded-full px-5 py-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/90">
          System · Online
        </span>
        <span className="h-4 w-px bg-primary/30" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          {time} UTC
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block glass rounded-2xl px-4 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Founder
          </p>
          <p className="text-sm font-medium text-foreground">{user?.email ?? "Commander"}</p>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="glass group flex h-11 w-11 items-center justify-center rounded-xl text-foreground/80 transition-all hover:text-primary hover:shadow-[0_0_20px_var(--color-glow)]"
        >
          <SettingsIcon size={16} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => {
            // Bell — scroll to news wire section
            const newsSection = document.querySelector("[data-news-wire]");
            if (newsSection) {
              newsSection.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }}
          aria-label="View notifications"
          className="glass group flex h-11 w-11 items-center justify-center rounded-xl text-foreground/80 transition-all hover:text-primary hover:shadow-[0_0_20px_var(--color-glow)]"
        >
          <Bell size={16} strokeWidth={1.5} />
        </button>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="glass group flex h-11 w-11 items-center justify-center rounded-xl text-foreground/80 transition-all hover:text-primary hover:shadow-[0_0_20px_var(--color-glow)]"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
