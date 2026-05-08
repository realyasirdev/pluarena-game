/*
PlayArena.fun — Theme Provider
- Persist theme in localStorage
- Default is dark
*/

import * as React from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

const KEY = "playarena.theme";

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, _setTheme] = React.useState<Theme>(() => {
    const saved = (localStorage.getItem(KEY) as Theme | null) ?? null;
    return saved ?? defaultTheme;
  });

  const setTheme = React.useCallback((t: Theme) => {
    _setTheme(t);
    localStorage.setItem(KEY, t);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    if (!switchable) return;
    setTheme(theme === "light" ? "dark" : "light");
  }, [switchable, theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
