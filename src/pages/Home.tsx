import { useEffect, useMemo, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImg from "@/assets/generated/hero.jpeg";
import { GAMES } from "@/data/games";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

interface HomeProps {
  targetSection?: string;
}

function useCountUp(target: number, ms = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

export default function Home({ targetSection }: HomeProps) {
  useEffect(() => {
    document.title = "PlayArena.fun";
  }, []);

  useEffect(() => {
    if (targetSection) {
      document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetSection]);

  const stats = useMemo(
    () => [
      { label: "Players online", value: 1248 },
      { label: "Matches played", value: 58321 },
      { label: "Games", value: 3 },
    ],
    []
  );

  const s0 = useCountUp(stats[0].value);
  const s1 = useCountUp(stats[1].value);
  const s2 = useCountUp(stats[2].value);

  return (
    <AppFrame>
      <section className="relative overflow-hidden rounded-3xl pa-glass pa-neon-border pa-glow">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/55 to-background/90" />
        <div className="relative p-8 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/35 px-3 py-1 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-primary pa-glow" />
                Glass UI • Neon feedback • Motion-first
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.02]">
                Your next match starts in the <span className="text-primary">Arena</span>.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
                Play built-in mini-games, track scores, and climb the leaderboard — all in a sleek, futuristic interface.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button className="rounded-xl pa-neon-border pa-glow-strong" asChild>
                  <Link href="/games">Play Now</Link>
                </Button>
                <Button variant="secondary" className="rounded-xl" asChild>
                  <Link href="/leaderboard">Join Arena</Link>
                </Button>
                <Button variant="ghost" className="rounded-xl" asChild>
                  <Link href="/about">Learn more</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[s0, s1, s2].map((v, i) => (
                  <div key={stats[i].label} className="rounded-2xl bg-muted/25 p-4">
                    <div className="text-2xl font-extrabold tracking-tight">{v.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{stats[i].label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl pa-glass pa-neon-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Featured</div>
                  <div className="text-lg font-semibold">Hot games</div>
                </div>
                <Badge variant="secondary" className="rounded-full">New</Badge>
              </div>

              <Carousel className="mt-4">
                <CarouselContent>
                  {GAMES.map((g) => (
                    <CarouselItem key={g.id}>
                      <motion.div
                        className="rounded-2xl overflow-hidden bg-muted/20 border border-border/60"
                        whileHover={{ y: -4 }}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img src={g.thumb} alt={g.title} className="h-full w-full object-cover opacity-90" loading="lazy" />
                        </div>
                        <div className="p-4">
                          <div className="text-sm font-semibold">{g.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{g.tagline}</div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" className="rounded-xl" asChild>
                              <Link href={`/games/${g.id}`}>Open</Link>
                            </Button>
                            <Button size="sm" variant="secondary" className="rounded-xl" asChild>
                              <Link href={`/games/${g.id}#play`}>Play</Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Neon-fast UI",
            body: "Crisp motion, glass panels, and glow feedback on every click.",
          },
          {
            title: "Mini-games included",
            body: "Tic Tac Toe, Memory Cards, and a Quiz — playable instantly.",
          },
          {
            title: "Local-first stats",
            body: "Scores and progress persist locally (no backend required).",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            className="rounded-2xl pa-glass pa-neon-border p-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.05, duration: 0.26 }}
          >
            <div className="text-lg font-semibold">{f.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">{f.body}</div>
          </motion.div>
        ))}
      </section>
    </AppFrame>
  );
}
