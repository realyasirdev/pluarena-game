import AppFrame from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <AppFrame>
      <div className="rounded-2xl pa-glass pa-neon-border p-8 text-center">
        <div className="text-sm text-muted-foreground">404</div>
        <div className="mt-2 text-3xl font-extrabold">Lost in the Arena</div>
        <p className="mt-2 text-sm text-muted-foreground">That route doesn’t exist.</p>
        <Button className="mt-6 rounded-xl" asChild>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </AppFrame>
  );
}
