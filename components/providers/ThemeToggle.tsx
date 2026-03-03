"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-surface-2 border border-line"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          className={`absolute inset-0 w-5 h-5 text-brand transition-all duration-300 ${
            theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`absolute inset-0 w-5 h-5 text-orange-500 transition-all duration-300 ${
            theme === "light" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
      </div>
    </button>
  );
}
