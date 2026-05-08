import { Spinner } from "@/components/ui/spinner";

export default function RouteLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="rounded-2xl pa-glass pa-neon-border p-5 flex items-center gap-3">
        <Spinner className="text-primary" />
        <div className="text-sm text-muted-foreground">{label}…</div>
      </div>
    </div>
  );
}
