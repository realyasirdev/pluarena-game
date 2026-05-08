import { useEffect } from "react";
import AppFrame from "@/components/AppFrame";
import { motion } from "framer-motion";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About • PlayArena.fun";
  }, []);

  const sections = [
    {
      title: "The Story",
      body: "PlayArena started as a simple idea: make mini-games feel like a premium platform. Crisp UI, fast matches, and bragging rights built-in.",
    },
    {
      title: "Mission",
      body: "Build a playful, futuristic space where anyone can jump in, compete, and level up — without waiting, installs, or friction.",
    },
    {
      title: "Vision",
      body: "A startup-level gaming hub that scales from small web games into tournaments, creator tools, and real-time multiplayer experiences.",
    },
  ];

  return (
    <AppFrame>
      <div className="rounded-2xl pa-glass pa-neon-border p-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold">About PlayArena</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          A futuristic demo platform designed to feel like a real gaming startup — glass panels, neon accents, and motion-first UX.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              className="rounded-2xl bg-muted/25 p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, duration: 0.28 }}
            >
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl pa-glass pa-neon-border p-6">
          <div className="text-sm text-muted-foreground">Design principles</div>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Glassmorphism surfaces with gradient neon borders</li>
            <li>High-contrast typography with bold headings</li>
            <li>Meaningful motion: page transitions + hover feedback</li>
            <li>Performance-first: lightweight effects, lazy assets</li>
          </ul>
        </div>
      </div>
    </AppFrame>
  );
}
