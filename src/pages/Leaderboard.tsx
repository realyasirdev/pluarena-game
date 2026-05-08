import { useEffect, useMemo, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Crown, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { addResult, buildLeaderboard } from "@/utils/results";
import type { GameId } from "@/utils/results";

const seedPlayers = [
  { name: "NeonFox", score: 980 },
  { name: "SkyByte", score: 910 },
  { name: "PulseKnight", score: 860 },
  { name: "ArcadeNova", score: 740 },
  { name: "EchoRift", score: 690 },
];

function randGame(): GameId {
  return ["tic-tac-toe", "memory", "quiz"][Math.floor(Math.random() * 3)] as GameId;
}

export default function LeaderboardPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    document.title = "Leaderboard • PlayArena.fun";
  }, []);

  const rows = useMemo(() => buildLeaderboard(seedPlayers), [tick]);
  const top3 = rows.slice(0, 3);

  return (
    <AppFrame>
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Leaderboard</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Aggregated scores from your saved game results (localStorage) + a few seeded demo players.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="rounded-xl pa-neon-border"
              onClick={() => {
                const who = seedPlayers[Math.floor(Math.random() * seedPlayers.length)].name;
                const gameId = randGame();
                const score = 40 + Math.floor(Math.random() * 180);
                addResult({ gameId, player: who, score, detail: "Simulated" });
                setTick((t) => t + 1);
                toast.success("Scores updated", { description: `${who} +${score} pts (${gameId})` });
              }}
            >
              <Sparkles className="mr-2 size-4" /> Simulate Update
            </Button>
            <Button variant="secondary" className="rounded-xl" onClick={() => setTick((t) => t + 1)}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {top3.map((p, idx) => (
            <motion.div
              key={p.name}
              className="rounded-2xl pa-glass pa-neon-border p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                  <div className="text-3xl font-extrabold tracking-tight">#{p.rank}</div>
                </div>
                {p.rank === 1 ? (
                  <Crown className="size-6 text-primary" />
                ) : (
                  <Trophy className="size-6 text-sky-400" />
                )}
              </div>
              <div className="mt-3 text-lg font-semibold">{p.name}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full" variant="secondary">
                  Total: {p.score}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  Best TTT: {p.best["tic-tac-toe"]}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  Best Mem: {p.best["memory"]}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  Best Quiz: {p.best["quiz"]}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl pa-glass pa-neon-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">TTT</TableHead>
                <TableHead className="text-right">Memory</TableHead>
                <TableHead className="text-right">Quiz</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-semibold">#{p.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      {p.rank <= 3 ? <span className="text-xs text-muted-foreground">• podium</span> : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <motion.span key={`${p.name}-total-${p.score}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      {p.score}
                    </motion.span>
                  </TableCell>
                  <TableCell className="text-right">{p.best["tic-tac-toe"]}</TableCell>
                  <TableCell className="text-right">{p.best["memory"]}</TableCell>
                  <TableCell className="text-right">{p.best["quiz"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-xs text-muted-foreground">🏆 Ranking is computed from saved results in your browser.</div>
      </div>
    </AppFrame>
  );
}
