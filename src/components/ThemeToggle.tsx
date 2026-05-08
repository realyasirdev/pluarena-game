import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ size = "default" }: { size?: "default" | "sm" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size={size === "sm" ? "sm" : "default"}
      className={cn("rounded-xl pa-neon-border", size === "sm" && "h-9 px-3")}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
