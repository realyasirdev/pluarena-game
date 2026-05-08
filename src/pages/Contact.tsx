import { useEffect } from "react";
import AppFrame from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact • PlayArena.fun";
  }, []);

  return (
    <AppFrame>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Contact</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Send a message to the Arena team. (Demo form — no backend.)
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message queued", { description: "Connect a backend to actually send emails." });
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" className="rounded-xl" placeholder="Your name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="rounded-xl" placeholder="you@domain.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" className="rounded-xl min-h-[140px]" placeholder="Tell us what you want to see next…" required />
            </div>
            <Button type="submit" className="rounded-xl pa-neon-border pa-glow-strong">
              Send
            </Button>
          </form>
        </div>

        <div className="rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-sm text-muted-foreground">Map</div>
          <div className="mt-2 text-xl font-semibold">Arena HQ (placeholder)</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Replace this with a real map embed (Google Maps / Mapbox) when you have a location.
          </p>

          <div className="mt-6 aspect-video rounded-2xl overflow-hidden bg-muted/25 relative">
            <div className="absolute inset-0 bg-[radial-gradient(400px_220px_at_30%_35%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(420px_280px_at_70%_65%,rgba(34,197,94,0.16),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              Map placeholder
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Social links</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Discord", href: "#" },
                { label: "X (Twitter)", href: "#" },
                { label: "YouTube", href: "#" },
              ].map((s) => (
                <Button
                  key={s.label}
                  type="button"
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => toast.info("Coming soon", { description: `${s.label} link not set.` })}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
