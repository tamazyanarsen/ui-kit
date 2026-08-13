import type { IconProps } from "./types"

// Figma's `icon / drag` (node I70279:7101;28080:56517 in the column-settings
// "Menu Point (ELK)" row): six r=1.5 dots in two columns on a 10×17 grid,
// placed at (7, 3) inside the 24px box. Drawn only at 24px in the spec — the
// reorder grip is the sole place it appears — so `size` is accepted and
// ignored like the kit's other single-drawing icons.
export function Drag({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(7 3)" fill="currentColor">
        <path d="M3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5Z" />
        <path d="M3 8.5C3 9.32843 2.32843 10 1.5 10C0.671573 10 0 9.32843 0 8.5C0 7.67157 0.671573 7 1.5 7C2.32843 7 3 7.67157 3 8.5Z" />
        <path d="M3 15.5C3 16.3284 2.32843 17 1.5 17C0.671573 17 0 16.3284 0 15.5C0 14.6716 0.671573 14 1.5 14C2.32843 14 3 14.6716 3 15.5Z" />
        <path d="M10 1.5C10 2.32843 9.32843 3 8.5 3C7.67157 3 7 2.32843 7 1.5C7 0.671573 7.67157 0 8.5 0C9.32843 0 10 0.671573 10 1.5Z" />
        <path d="M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z" />
        <path d="M10 15.5C10 16.3284 9.32843 17 8.5 17C7.67157 17 7 16.3284 7 15.5C7 14.6716 7.67157 14 8.5 14C9.32843 14 10 14.6716 10 15.5Z" />
      </g>
    </svg>
  )
}
