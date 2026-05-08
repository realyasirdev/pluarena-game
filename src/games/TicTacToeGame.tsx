import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { addResult, getBestScore } from "@/utils/results";
import { useSound } from "@/hooks/useSound";

type Cell = "X" | "O" | null;

const WINS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: Cell[]) {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default function TicTacToeGame() {
  const { user } = useAuth();
  const player = user?.username ?? "Guest";
  const { beep } = useSound();

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [locked, setLocked] = useState(false);

  const win = useMemo(() => winner(board), [board]);
  const full = useMemo(() => board.every(Boolean), [board]);

  const best = useMemo(() => getBestScore("tic-tac-toe", player), [player]);

  const status = win ? `Winner: ${win}` : full ? "Draw" : `Turn: ${turn}`;

  const score = useMemo(() => {
    // Simple scoring: win gives 120 - moves, draw gives 40
    const moves = board.filter(Boolean).length;
    if (win) return Math.max(30, 120 - moves * 6);
    if (full) return 40;
    return 0;
  }, [win, full, board]);

  const finish = (detail: string) => {
    if (locked) return;
    setLocked(true);
    const finalScore = score;
    addResult({ gameId: "tic-tac-toe", player, score: finalScore, detail });
    toast.success("Result saved", { description: `${detail} • +${finalScore} pts` });
  };

  return (
    <div className="rounded-2xl pa-glass pa-neon-border p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Tic Tac Toe</div>
          <div className="text-xl font-semibold">{status}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">Best: {best}</Badge>
          <Badge variant="outline" className="rounded-full">Player: {player}</Badge>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 max-w-sm">
        {board.map((cell, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: cell || win || locked ? 1 : 1.03 }}
            whileTap={{ scale: cell || win || locked ? 1 : 0.98 }}
            className="aspect-square rounded-2xl bg-muted/25 border border-border/60 flex items-center justify-center text-4xl font-extrabold"
            onClick={() => {
              if (cell || win || locked) return;
              setBoard((prev) => {
                const next = [...prev];
                next[idx] = turn;
                return next;
              });
              beep("tap");
              setTurn((t) => (t === "X" ? "O" : "X"));
            }}
          >
            <span className={cell === "X" ? "text-primary" : cell === "O" ? "text-sky-400" : "text-transparent"}>
              {cell ?? "·"}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          className="rounded-xl"
          variant="secondary"
          onClick={() => {
            setBoard(Array(9).fill(null));
            setTurn("X");
            setLocked(false);
          }}
        >
          Reset
        </Button>

        <Button
          className="rounded-xl pa-neon-border"
          onClick={() => {
            if (win) {
              beep("success");
              finish(`${win} wins`);
              return;
            }
            if (full) {
              beep("fail");
              finish("Draw");
              return;
            }
            toast.message("Finish the match", { description: "Play until win or draw, then Save unlocks." });
          }}
          disabled={locked || (!win && !full)}
        >
          Save result (+{score} pts)
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Tip: Play to completion, then save your result to update the leaderboard.
      </p>
    </div>
  );
}
