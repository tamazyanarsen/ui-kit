import type { IconProps } from "./types"

// Figma's `icon / drag` (node I70279:7101;28080:56517 in the column-settings
// "Menu Point (ELK)" row): six r=1.5 dots in two columns on a 10×17 grid,
// placed at (7, 3) inside the 24px box. Drawn only at 24px in the spec — the
// reorder grip is the sole place it appears — so `size` is accepted and
// ignored like the kit's other single-drawing icons.
export function Drag({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m7-14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
  )
}
