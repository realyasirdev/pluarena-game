export type GameCategory = "Board" | "Memory" | "Quiz";
export type GameDifficulty = "Easy" | "Medium" | "Hard";

export type GameMeta = {
  id: "tic-tac-toe" | "memory" | "quiz";
  title: string;
  tagline: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  players: string;
  estTime: string;
  accent: "neon" | "sky" | "purple";
  thumb: string;
};

import heroTtt from "@/assets/generated/tic-tac-toe.jpeg";
import heroMemory from "@/assets/generated/memory.jpeg";
import heroQuiz from "@/assets/generated/quiz.jpeg";

export const GAMES: GameMeta[] = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    tagline: "Classic mind duel — neon edition.",
    category: "Board",
    difficulty: "Easy",
    players: "2 players",
    estTime: "2–5 min",
    accent: "neon",
    thumb: heroTtt,
  },
  {
    id: "memory",
    title: "Memory Cards",
    tagline: "Flip, focus, and chain combos.",
    category: "Memory",
    difficulty: "Medium",
    players: "Solo",
    estTime: "3–8 min",
    accent: "sky",
    thumb: heroMemory,
  },
  {
    id: "quiz",
    title: "Arena Quiz",
    tagline: "Fast questions. Faster confidence.",
    category: "Quiz",
    difficulty: "Medium",
    players: "Solo",
    estTime: "2–6 min",
    accent: "purple",
    thumb: heroQuiz,
  },
];

export function getGameById(id: string | undefined) {
  return GAMES.find((g) => g.id === id);
}
