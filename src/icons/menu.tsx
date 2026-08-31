import type { IconProps } from "./types"

// Figma's `icon / classic burger` (нода 1168:11555) — 14×12 глиф в 16-м
// боксе: инсет 6.25% по горизонтали (x 1…15) и 2px сверху (y 2…14), три
// полосы по 2px с шагом 5. Раньше здесь была раскладка с шагом 4
// (y 3/7/11) — на кнопке «Меню» в шапке она читалась заметно плотнее
// макета.
export function Menu({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 12a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2zm0-5a1 1 0 1 1 0 2H2a1 1 0 0 1 0-2zm0-5a1 1 0 1 1 0 2H2a1 1 0 0 1 0-2z"/></svg>
  )
}
