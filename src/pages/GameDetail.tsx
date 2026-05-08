import { useEffect } from "react";
import AppFrame from "@/components/AppFrame";
import { getGameById } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { ChevronLeft, Play, Star } from "lucide-react";
import TicTacToeGame from "@/games/TicTacToeGame";
import MemoryGame from "@/games/MemoryGame";
import QuizGame from "@/games/QuizGame";

export default function GameDetailPage({ id }: { id?: string }) {
  const [, navigate] = useLocation();
  const game = getGameById(id);

  useEffect(() => {
    document.title = game ? `${game.title} • PlayArena.fun` : "Game • PlayArena.fun";
  }, [game]);

  if (!game) {
    return (
      <AppFrame>
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-2xl font-bold">Game not found</div>
          <p className="mt-2 text-muted-foreground">The arena can’t locate that game ID.</p>
          <Button className="mt-6 rounded-xl" asChild>
            <Link href="/games">Back to Games</Link>
          </Button>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" className="rounded-xl" onClick={() => navigate("/games")}>
            <ChevronLeft className="mr-2 size-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{game.category}</Badge>
            <Badge variant="outline" className="rounded-full">{game.difficulty}</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl pa-glass pa-neon-border overflow-hidden">
            <div className="aspect-video bg-muted/20">
              <img src={game.thumb} alt={game.title} className="h-full w-full object-cover opacity-95" />
            </div>
            <div className="p-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold">{game.title}</h1>
              <p className="mt-2 text-muted-foreground">{game.tagline}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Card className="pa-glass pa-neon-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Players</div>
                    <div className="text-lg font-semibold">{game.players}</div>
                  </CardContent>
                </Card>
                <Card className="pa-glass pa-neon-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Time</div>
                    <div className="text-lg font-semibold">{game.estTime}</div>
                  </CardContent>
                </Card>
                <Card className="pa-glass pa-neon-border">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">Mode</div>
                    <div className="text-lg font-semibold">Ranked (demo)</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="rounded-2xl pa-glass pa-neon-border p-6 flex flex-col gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Ready?</div>
              <div className="text-xl font-semibold">Launch the match</div>
            </div>
            <Button
              className="rounded-xl pa-neon-border pa-glow-strong"
              onClick={() => {
                toast.message("Launching…", { description: "Scroll to the game scene below." });
                document.getElementById("play")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Play className="mr-2 size-4" /> Play
            </Button>

            <div className="text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Instructions</div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Play and earn points.</li>
                <li>Your best score is saved locally.</li>
                <li>Compete on the leaderboard (demo data).</li>
              </ul>
            </div>

            <div className="mt-auto rounded-2xl bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="size-4 text-primary" /> Ratings & comments
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Ratings UI is included as a demo. Hook it to a backend later if needed.
              </p>
              <Button
                variant="secondary"
                className="mt-3 rounded-xl"
                onClick={() => toast.info("Coming soon", { description: "Comment system is not wired yet." })}
              >
                Leave a comment
              </Button>
            </div>
          </div>
        </div>

        <div id="play" className="space-y-4">
          {game.id === "tic-tac-toe" ? (
            <TicTacToeGame />
          ) : game.id === "memory" ? (
            <MemoryGame />
          ) : (
            <QuizGame />
          )}

          <div className="rounded-2xl pa-glass pa-neon-border p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm font-semibold">Want another challenge?</div>
              <div className="text-xs text-muted-foreground">Switch games anytime — your results stay saved locally.</div>
            </div>
            <Button className="rounded-xl" asChild>
              <Link href="/games">Browse games</Link>
            </Button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
