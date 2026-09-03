import type { IconProps } from "./types"

// Figma's `icon / more` — two independent drawings, not one scaled:
//
//   16px: three r=1.5 dots on a 14×3 strip placed at (1, 6.5) inside the box
//         (node I16029:57773;16029:58070 в `ELK / files`).
//   24px: три r=2 точки с шагом 8 — центры на 4, 12 и 20 при cy 12 (ассет
//         плашки `ELK / thumbnail` внутри `ELK / item`, 31845:82858).
//
// ⚠️ 24-я ступень нужна по-настоящему: у 16-го рисунка точки r=1.5 с шагом
// 5,5, и при растяжении до 24 они выходят r=2,25 с шагом 8,25 — толще и
// шире макетных. Раньше здесь стоял только 16-й рисунок, и плашка `Item`
// (единственное место, где глиф просят 24px) рисовала именно его.
//
// До этого тут вообще лежал остаток от lucide на 24-й сетке — визуально
// близко, но мимо 16-й сетки кита, и рядом с фигмовскими иконками он
// оптически не совпадал.
export function Ellipsis({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g fill="currentColor"><path d="M6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/><path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/><path d="M22 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M15 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
  )
}
