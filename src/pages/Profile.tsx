import { useEffect, useMemo } from "react";
import AppFrame from "@/components/AppFrame";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = "Profile • PlayArena.fun";
  }, []);

  const stats = useMemo(() => {
    // Demo stats; will be connected to game results later.
    return {
      gamesPlayed: user ? 12 : 0,
      wins: user ? 6 : 0,
      progress: user ? 68 : 0,
    };
  }, [user]);

  if (!user) {
    return (
      <AppFrame>
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-2xl font-bold">Sign in to view your profile</div>
          <p className="mt-2 text-muted-foreground">
            Profiles are stored locally for now. Log in to create your player identity.
          </p>
          <Button className="mt-6 rounded-xl pa-neon-border" asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-secondary/70">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs text-muted-foreground">Player</div>
              <div className="text-2xl font-extrabold">{user.username}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card className="pa-glass pa-neon-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Games</div>
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
              </CardContent>
            </Card>
            <Card className="pa-glass pa-neon-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Wins</div>
                <div className="text-2xl font-bold">{stats.wins}</div>
              </CardContent>
            </Card>
            <Card className="pa-glass pa-neon-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Winrate</div>
                <div className="text-2xl font-bold">{Math.round((stats.wins / Math.max(1, stats.gamesPlayed)) * 100)}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Season progress</span>
              <span className="text-muted-foreground">{stats.progress}%</span>
            </div>
            <Progress value={stats.progress} className="mt-2" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="rounded-xl" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => toast.message("Coming soon", { description: "Achievements are displayed on Dashboard." })}
            >
              Achievements
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl ml-auto"
              onClick={() => {
                logout();
                toast.success("Logged out");
              }}
            >
              Log out
            </Button>
          </div>
        </div>

        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-xl font-semibold">Progress Bars</div>
          <p className="mt-2 text-sm text-muted-foreground">
            A few demo progress meters for UI polish. Hook these to real game stats later.
          </p>

          <div className="mt-6 space-y-4">
            {[
              { label: "Tic Tac Toe Mastery", value: 72 },
              { label: "Memory Combo Control", value: 54 },
              { label: "Quiz Accuracy", value: 63 },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-muted/25 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-muted-foreground">{m.value}%</span>
                </div>
                <Progress value={m.value} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
