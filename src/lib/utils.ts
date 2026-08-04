import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Without this, twMerge doesn't recognize the custom text-h1..h4/text-p1..p4
// typography classes (src/index.css's @theme text-* keys) as font-size
// utilities — it falls back to bucketing them under "text-color" instead,
// so combining one with a real color class (e.g. `cn("text-p1 font-medium",
// "text-[var(--x-fg)]")`) silently drops the size class at runtime instead
// of merging cleanly. Registering them here fixes that for every consumer.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-h1", "text-h2", "text-h3", "text-h4", "text-p1", "text-p2", "text-p3", "text-p4"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
