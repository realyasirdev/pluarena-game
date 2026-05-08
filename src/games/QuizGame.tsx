import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { addResult, getBestScore } from "@/utils/results";
import { useSound } from "@/hooks/useSound";

type Q = {
  q: string;
  a: string;
  choices: string[];
};

const QUESTIONS: Q[] = [
  { q: "Which CSS technique gives the glass effect?", a: "Backdrop blur", choices: ["Backdrop blur", "Drop shadow", "Outline", "Pixel grid"] },
  { q: "A responsive layout should be…", a: "Mobile-first", choices: ["Desktop-only", "Fixed-width", "Mobile-first", "Image-heavy"] },
  { q: "What library powers page transitions here?", a: "Framer Motion", choices: ["GSAP", "Framer Motion", "Anime.js", "jQuery"] },
  { q: "Neon accent color in PlayArena palette?", a: "#22C55E", choices: ["#F97316", "#22C55E", "#EF4444", "#0EA5E9"] },
  { q: "A good UI hover should feel…", a: "Satisfying", choices: ["Invisible", "Random", "Satisfying", "Slow"] },
];

export default function QuizGame() {
  const { user } = useAuth();
  const player = user?.username ?? "Guest";
  const { beep } = useSound();

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const best = useMemo(() => getBestScore("quiz", player), [player]);

  const q = QUESTIONS[idx];
  const progress = Math.round(((idx + (done ? 1 : 0)) / QUESTIONS.length) * 100);

  const score = useMemo(() => {
    // 70 pts per correct answer, plus speed bonus (simplified)
    return correct * 70;
  }, [correct]);

  useEffect(() => {
    if (!done) return;
    addResult({ gameId: "quiz", player, score, detail: `${correct}/${QUESTIONS.length} correct` });
    toast.success("Quiz saved", { description: `+${score} pts • ${correct}/${QUESTIONS.length}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="rounded-2xl pa-glass pa-neon-border p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Arena Quiz</div>
          <div className="text-xl font-semibold">{done ? "Completed" : `Question ${idx + 1}/${QUESTIONS.length}`}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">Best: {best}</Badge>
          <Badge variant="outline" className="rounded-full">Score: {score}</Badge>
        </div>
      </div>

      <div className="mt-4">
        <Progress value={progress} />
      </div>

      <div className="mt-5 rounded-2xl bg-muted/25 p-5">
        <div className="text-sm text-muted-foreground">Prompt</div>
        <div className="mt-2 text-lg font-semibold">{q?.q}</div>

        <div className="mt-4 grid gap-2">
          {q?.choices.map((c) => {
            const state =
              picked === null
                ? "idle"
                : c === q.a
                  ? "correct"
                  : c === picked
                    ? "wrong"
                    : "idle";

            return (
              <motion.button
                key={c}
                whileHover={{ y: picked ? 0 : -2 }}
                whileTap={{ scale: picked ? 1 : 0.98 }}
                className={
                  "text-left rounded-2xl border px-4 py-3 transition " +
                  (state === "idle"
                    ? "bg-background/10 border-border/70 hover:bg-muted/30"
                    : state === "correct"
                      ? "bg-emerald-500/15 border-emerald-400/50"
                      : "bg-red-500/12 border-red-400/50")
                }
                disabled={picked !== null || done}
                onClick={() => {
                  setPicked(c);
                  const ok = c === q.a;
                  if (ok) {
                    beep("success");
                    setCorrect((x) => x + 1);
                  } else {
                    beep("fail");
                  }
                }}
              >
                <div className="text-sm font-medium">{c}</div>
                {picked && state !== "idle" ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {state === "correct" ? "Correct" : "Not quite"}
                  </div>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="rounded-xl"
            variant="secondary"
            onClick={() => {
              setIdx(0);
              setPicked(null);
              setCorrect(0);
              setDone(false);
              toast.message("Restarted");
            }}
          >
            Restart
          </Button>

          <Button
            className="rounded-xl pa-neon-border"
            disabled={done || picked === null}
            onClick={() => {
              setPicked(null);
              if (idx >= QUESTIONS.length - 1) {
                setDone(true);
              } else {
                setIdx((i) => i + 1);
              }
            }}
          >
            {idx >= QUESTIONS.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Auto-saves score when completed.</p>
    </div>
  );
}
