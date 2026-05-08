import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { addResult, getBestScore } from "@/utils/results";
import { useSound } from "@/hooks/useSound";

type Card = { id: string; value: string };

const ICONS = ["◆", "◈", "▲", "⬟", "◬", "◢", "⬢", "✦"]; // 8 pairs

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = ICONS.flatMap((v) => [v, v]);
  return shuffle(pairs).map((value) => ({ id: crypto.randomUUID(), value }));
}

export default function MemoryGame() {
  const { user } = useAuth();
  const player = user?.username ?? "Guest";
  const { beep } = useSound();

  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const startRef = useRef<number>(Date.now());

  const best = useMemo(() => getBestScore("memory", player), [player]);

  const done = matched.size === deck.length;

  useEffect(() => {
    if (!done) return;
    const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const score = Math.max(20, 260 - moves * 10 - seconds * 2);
    addResult({ gameId: "memory", player, score, detail: `${moves} moves • ${seconds}s` });
    beep("success");
    toast.success("Memory cleared", { description: `Saved +${score} pts (${moves} moves)` });
    // prevent double save
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const scorePreview = useMemo(() => {
    const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    return Math.max(20, 260 - moves * 10 - seconds * 2);
  }, [moves]);

  return (
    <div className="rounded-2xl pa-glass pa-neon-border p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Memory Cards</div>
          <div className="text-xl font-semibold">Match all pairs</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">Best: {best}</Badge>
          <Badge variant="outline" className="rounded-full">Moves: {moves}</Badge>
          <Badge variant="outline" className="rounded-full">Score: {done ? "Saved" : scorePreview}</Badge>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 max-w-xl">
        {deck.map((c, idx) => {
          const isOpen = open.includes(idx);
          const isMatched = matched.has(idx);
          return (
            <motion.button
              key={c.id}
              whileHover={{ y: locked || isMatched ? 0 : -3 }}
              whileTap={{ scale: locked || isMatched ? 1 : 0.98 }}
              className="aspect-square rounded-2xl border border-border/60 bg-muted/25 relative overflow-hidden"
              onClick={() => {
                if (locked || isMatched || isOpen || done) return;
                beep("tap");
                setOpen((prev) => {
                  const next = [...prev, idx];
                  return next.slice(-2);
                });
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(180px_120px_at_30%_20%,rgba(34,197,94,0.14),transparent_60%),radial-gradient(180px_120px_at_70%_80%,rgba(56,189,248,0.12),transparent_60%)]" />
              <AnimatePresence initial={false} mode="wait">
                {isOpen || isMatched ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold"
                  >
                    <span className={isMatched ? "text-primary" : "text-sky-400"}>{c.value}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="size-10 rounded-2xl bg-secondary/60 pa-neon-border" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="rounded-xl"
          onClick={() => {
            setDeck(buildDeck());
            setOpen([]);
            setMatched(new Set());
            setMoves(0);
            setLocked(false);
            startRef.current = Date.now();
          }}
        >
          New deck
        </Button>
      </div>

      {/* matching logic */}
      <MatchWatcher
        deck={deck}
        open={open}
        setOpen={setOpen}
        matched={matched}
        setMatched={setMatched}
        setMoves={setMoves}
        locked={locked}
        setLocked={setLocked}
        beep={beep}
      />

      <p className="mt-4 text-xs text-muted-foreground">
        Auto-saves a score when you finish. Try to minimize moves.
      </p>
    </div>
  );
}

function MatchWatcher({
  deck,
  open,
  setOpen,
  matched,
  setMatched,
  setMoves,
  locked,
  setLocked,
  beep,
}: {
  deck: Card[];
  open: number[];
  setOpen: (v: any) => void;
  matched: Set<number>;
  setMatched: (s: Set<number>) => void;
  setMoves: (f: any) => void;
  locked: boolean;
  setLocked: (v: boolean) => void;
  beep: (k: any) => void;
}) {
  useEffect(() => {
    if (locked) return;
    if (open.length !== 2) return;

    const [a, b] = open;
    setLocked(true);
    setMoves((m: number) => m + 1);

    const same = deck[a]?.value === deck[b]?.value;

    const t = window.setTimeout(() => {
      if (same) {
        beep("success");
        const next = new Set(matched);
        next.add(a);
        next.add(b);
        setMatched(next);
      } else {
        beep("fail");
      }
      setOpen([]);
      setLocked(false);
    }, same ? 360 : 520);

    return () => window.clearTimeout(t);
  }, [open, deck, matched, locked, setLocked, setMoves, setOpen, setMatched, beep]);

  return null;
}
