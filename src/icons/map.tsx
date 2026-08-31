import type { IconProps } from "./types"

// icon / map — 02. Map, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Map({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M21.472 1.118A1 1 0 0 1 22 2v17a1 1 0 0 1-.553.894l-6 3a1 1 0 0 1-.894 0L9 20.118l-5.553 2.776A1 1 0 0 1 2 22V6a1 1 0 0 1 .445-.832l6-4a1 1 0 0 1 1.11 0L15 4.798l5.445-3.63a1 1 0 0 1 1.027-.05M4 6.535v13.847l4-2V3.869zm10 13.847-4-2V3.869l4 2.666zm2 0 4-2V3.869l-4 2.666z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M14.526 1.149c.294.183.474.504.474.851v10a1 1 0 0 1-.553.894l-4 2a1 1 0 0 1-.894 0L6 13.118l-3.553 1.776A1 1 0 0 1 1 14V4c0-.379.214-.725.553-.894l4-2a1 1 0 0 1 .894 0L10 2.882l3.553-1.776a1 1 0 0 1 .973.043M3 4.618v7.764l2-1V3.618zm6 7.764-2-1V3.618l2 1zm2 0 2-1V3.618l-2 1z" clipRule="evenodd"/></svg>
  )
}
