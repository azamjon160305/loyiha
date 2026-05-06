import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const units = [
    { label: "asr", seconds: 3153600000 },
    { label: "yil", seconds: 31536000 },
    { label: "oy", seconds: 2592000 },
    { label: "kun", seconds: 86400 },
    { label: "soat", seconds: 3600 },
    { label: "daqiqa", seconds: 60 },
    { label: "soniya", seconds: 1 },
  ];

  if (seconds === Infinity) return "Cheksiz vaqt";
  if (seconds < 1) return "Darhol (soniya ulushida)";

  for (const unit of units) {
    if (seconds >= unit.seconds) {
      const value = Math.floor(seconds / unit.seconds);
      return `${value} ${unit.label}${value > 1 ? "" : ""}`;
    }
  }

  return "O'ta qisqa vaqt";
}
