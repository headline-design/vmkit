"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme: currentTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const appearances = useMemo(
    () => [
      {
        theme: "dark",
        icon: <Moon strokeWidth="1.5" width="16px" height="16px" />,
      },
      {
        theme: "light",
        icon: <Sun strokeWidth="1.5" width="16px" height="16px" />,
      },
      {
        theme: "system",
        icon: <Monitor strokeWidth="1.5" width="16px" height="16px" />,
      },
    ],
    [],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme && (storedTheme === "dark" || storedTheme === "light")) {
        setTheme(storedTheme);
      }
    }
  }, [isMounted, setTheme]);

  const handleSetTheme = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);
      window.localStorage.setItem("theme", newTheme);
    },
    [setTheme],
  );

  if (!isMounted) return null;

  return (
    <div className="relative mt-8 inline-flex">
      <div className="rust-theme-switcher">
        {appearances.map(({ theme, icon }) => (
          <button
            key={theme}
            className={`${
              currentTheme === theme ? "theme-active " : ""
            } switch-button text-sm text-secondary-accent hover:text-foreground`}
            onClick={() => handleSetTheme(theme)}
          >
            <span className="flex items-center justify-center">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
