import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Without this, twMerge doesn't recognize the custom text-h1..h4/text-p1..p4
// typography classes (src/styles/theme.css's @theme text-* keys) as font-size
// utilities — it falls back to bucketing them under "text-color" instead,
// so combining one with a real color class (e.g. `cn("text-p1 font-medium",
// "text-[var(--x-fg)]")`) silently drops the size class at runtime instead
// of merging cleanly. Registering them here fixes that for every consumer.
// The compound text-pN-{regular,medium,heavy} utilities (one per named
// Figma paragraph style) go in the same group so they still evict a bare
// text-h*/text-p* or an earlier compound class passed in via cn() overrides.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-factoid", "text-factoid-mobile",
        "text-h1", "text-h2", "text-h3", "text-h4",
        "text-h1-mobile", "text-h2-mobile", "text-h3-mobile", "text-h4-mobile",
        "text-p1", "text-p2", "text-p3", "text-p4",
        "text-p1-regular", "text-p1-medium", "text-p1-heavy",
        "text-p2-regular", "text-p2-medium", "text-p2-heavy",
        "text-p3-regular", "text-p3-medium",
        "text-p4-regular",
      ],
      // Same reasoning for the one custom @theme shadow key ("Universal
      // shadow" in Figma): unregistered, twMerge reads the bare word as a
      // shadow *color* rather than the shadow itself, so it would neither
      // evict nor be evicted by a real shadow class passed through cn().
      shadow: ["shadow-universal"],
      // `.text-link` only sets text-decoration, but its name would otherwise
      // be bucketed as a text *color* and silently survive next to a real
      // one. Filed under text-decoration so it conflicts with underline/
      // no-underline the way it actually behaves.
      "text-decoration": ["text-link"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
