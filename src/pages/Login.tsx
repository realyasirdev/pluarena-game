import { useEffect } from "react";
import AppFrame from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Globe, Shield } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(20).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { user, login } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Login • PlayArena.fun";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", username: "" },
  });

  return (
    <AppFrame>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <h1 className="text-3xl font-extrabold">Login / Signup</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is a front-end demo. Signing in stores your player profile in localStorage.
          </p>

          {user ? (
            <div className="mt-6 rounded-2xl bg-muted/25 p-4">
              <div className="text-sm">
                Already signed in as <span className="font-semibold">{user.username}</span>.
              </div>
              <Button className="mt-4 rounded-xl" onClick={() => navigate("/profile")}>Go to Profile</Button>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={form.handleSubmit((values) => {
                login(values);
                toast.success("Welcome to the Arena", { description: "Profile saved locally." });
                navigate("/dashboard");
              })}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@domain.com" className="rounded-xl" {...form.register("email")} />
                {form.formState.errors.email ? (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  placeholder="NeonFox"
                  className="rounded-xl"
                  {...form.register("username")}
                />
              </div>

              <Button type="submit" className="w-full rounded-xl pa-neon-border pa-glow-strong">
                Enter Arena
              </Button>

              <Separator />

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => toast.message("Social login", { description: "Hook to Firebase later." })}
                >
                  <Globe className="mr-2 size-4" /> Google
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => toast.message("Social login", { description: "Hook to Firebase later." })}
                >
                  <Shield className="mr-2 size-4" /> GitHub
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-sm text-muted-foreground">Why sign in?</div>
          <div className="mt-2 text-xl font-semibold">Unlock a persistent identity</div>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Save your best scores</li>
            <li>Track streaks & progress bars</li>
            <li>Show up on the leaderboard (demo)</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-muted/25 p-4 text-sm">
            <span className="font-semibold">Tip:</span> This UI uses glassmorphism panels, animated inputs, and neon hover feedback.
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
