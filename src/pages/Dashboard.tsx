import { useEffect } from "react";
import AppFrame from "@/components/AppFrame";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GAMES } from "@/data/games";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Dashboard • PlayArena.fun";
  }, []);

  return (
    <AppFrame>
      <div className="flex flex-col gap-8">
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Welcome back</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                {user ? user.username : "Guest"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-xl" asChild>
                <Link href="/games">Play</Link>
              </Button>
              <Button variant="secondary" className="rounded-xl" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </div>
          </div>

          {!user ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to persist your stats. Until then, everything runs in demo mode.
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="pa-glass pa-neon-border">
            <CardHeader>
              <CardTitle className="text-base">Recently Played</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {GAMES.slice(0, 2).map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/25 p-3">
                  <div>
                    <div className="text-sm font-semibold">{g.title}</div>
                    <div className="text-xs text-muted-foreground">Best: 420 (demo)</div>
                  </div>
                  <Button size="sm" className="rounded-xl" asChild>
                    <Link href={`/games/${g.id}`}>Open</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="pa-glass pa-neon-border">
            <CardHeader>
              <CardTitle className="text-base">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Neon Streak", desc: "Win 3 matches in a row", done: true },
                { name: "No-Miss Quiz", desc: "100% accuracy", done: false },
                { name: "Memory Chain", desc: "6 matches without errors", done: false },
              ].map((a) => (
                <div key={a.name} className="flex items-start justify-between gap-3 rounded-xl bg-muted/25 p-3">
                  <div>
                    <div className="text-sm font-semibold">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                  <Badge className="rounded-full" variant={a.done ? "secondary" : "outline"}>
                    {a.done ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="pa-glass pa-neon-border">
            <CardHeader>
              <CardTitle className="text-base">Season Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">68%</span>
              </div>
              <Progress value={68} className="mt-2" />
              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground">Complete matches to fill the track.</div>
              <Button variant="secondary" className="mt-3 rounded-xl" asChild>
                <Link href="/leaderboard">Compete</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
