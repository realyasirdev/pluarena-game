/*
PlayArena.fun — Component Design Reminder
- Use asymmetric layouts + glass panels
- Strong neon hover feedback and clear focus rings
*/

import { Link, useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Gamepad2,
  Trophy,
  User,
  LogIn,
  LayoutDashboard,
  Info,
  Mail,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

function useActivePath() {
  const [location] = useLocation();
  return location;
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useActivePath();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            className="absolute right-3 top-3 w-[88vw] max-w-sm rounded-2xl pa-glass pa-neon-border overflow-hidden"
            initial={{ x: 26, y: -6, scale: 0.98, opacity: 0 }}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={{ x: 26, y: -6, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <div className="text-sm text-muted-foreground">Menu</div>
                <div className="font-semibold tracking-tight">PlayArena</div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                        isActive
                          ? "bg-accent text-accent-foreground pa-glow"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 pt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle size="sm" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const active = useActivePath();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const topNav = useMemo(() => NAV.slice(0, 5), []);

  return (
    <header className="sticky top-0 z-40">
      <div className="pa-noise" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <div className="relative rounded-2xl pa-glass pa-neon-border">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href="/">
              <div className="group flex items-center gap-3">
                <div className="relative size-10 rounded-2xl bg-secondary/60 pa-neon-border pa-glow">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-sky-400/10" />
                  <div className="absolute inset-0 rounded-2xl pa-sheen" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm text-muted-foreground">PlayArena.fun</div>
                  <div className="font-semibold tracking-tight group-hover:text-primary transition">Enter the Arena</div>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {topNav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                        isActive ? "bg-accent text-accent-foreground pa-glow" : "hover:bg-muted/40"
                      )}
                    >
                      <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <Button
                variant="secondary"
                className="hidden sm:inline-flex rounded-xl pa-neon-border"
                asChild
              >
                <Link href="/games">Play Now</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">PlayArena.fun</div>
            <div className="text-lg font-semibold">Built for quick matches & big bragging rights.</div>
            <p className="text-sm text-muted-foreground max-w-sm">
              A futuristic demo platform with mini-games, profiles, and a leaderboard. All data is stored locally in your browser.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/games" className="text-muted-foreground hover:text-foreground transition">Games</Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition">Leaderboard</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition">About</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition">Contact</Link>
          </div>
          <div className="rounded-2xl pa-glass pa-neon-border p-4">
            <div className="text-sm font-medium">Weekly Challenge</div>
            <p className="text-sm text-muted-foreground mt-1">
              Win 3 games in a row to unlock the “Neon Streak” badge.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">(Challenge is a UI demo)</div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} PlayArena.fun</div>
      </div>
    </footer>
  );
}
