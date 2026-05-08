import { useEffect, useMemo, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { GAMES } from "@/data/games";
import type { GameCategory, GameDifficulty } from "@/data/games";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Filter, Search } from "lucide-react";

const categories: (GameCategory | "All")[] = ["All", "Board", "Memory", "Quiz"];
const difficulties: (GameDifficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

export default function GamesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("All");

  useEffect(() => {
    document.title = "Games • PlayArena.fun";
  }, []);

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || g.title.toLowerCase().includes(q) || g.tagline.toLowerCase().includes(q);
      const matchC = category === "All" || g.category === category;
      const matchD = difficulty === "All" || g.difficulty === difficulty;
      return matchQ && matchC && matchD;
    });
  }, [query, category, difficulty]);

  return (
    <AppFrame>
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Games</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Pick a game, learn the rules, and hit Play. Your scores are saved locally.
            </p>
          </div>
          <Button className="rounded-xl pa-neon-border" asChild>
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>

        <div className="rounded-2xl pa-glass pa-neon-border p-4">
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.4fr_0.4fr]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games…"
                className="pl-9 rounded-xl"
              />
            </div>

            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>{filtered.length} game(s) match</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <motion.div
              key={g.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="rounded-2xl pa-glass pa-neon-border overflow-hidden"
            >
              <div className="aspect-video bg-muted/20 overflow-hidden">
                <img src={g.thumb} alt={g.title} className="h-full w-full object-cover opacity-90" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{g.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{g.tagline}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {g.category}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {g.players}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {g.estTime}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {g.difficulty}
                  </Badge>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button className="rounded-xl pa-neon-border flex-1" asChild>
                    <Link href={`/games/${g.id}`}>Open</Link>
                  </Button>
                  <Button variant="secondary" className="rounded-xl" asChild>
                    <Link href={`/games/${g.id}#play`}>Play</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
