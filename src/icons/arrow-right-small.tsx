import type { IconProps } from "./types"

// icon / arrow right small и icon / arrow back small — 08. Arrows, набор
// ALL ICONS. 16 и 24 — отдельные начертания мастера, а не масштаб одного.
// ArrowLeftSmall — это «arrow back small» (в макете у пары такие имена),
// поэтому его рисунок совпадает с ArrowBackSmall.
//
// Бегунок Range Input рисует свою, более тонкую пару шевронов (вложенный
// в макет экземпляр, а не символ этого набора), — она лежит рядом с
// компонентом: range-input/thumb-arrow.tsx.
export function ArrowRightSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.29 5.29a.98.98 0 0 1 1.398 0l5.978 5.91c.445.44.445 1.16 0 1.6l-5.978 5.91a.98.98 0 0 1-1.398 0 .965.965 0 0 1 0-1.38L13.676 12 8.29 6.67a.965.965 0 0 1 0-1.38" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.293 3.29a1 1 0 0 1 1.414 0l3.89 3.89c.39.39.39 1.03 0 1.42l-3.89 3.89a1 1 0 1 1-1.414-1.42l3.182-3.18-3.182-3.18c-.39-.39-.39-1.03 0-1.42" clipRule="evenodd"/></svg>
  )
}

export function ArrowLeftSmall({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M15.71 18.71a.98.98 0 0 1-1.398 0L8.334 12.8a1.126 1.126 0 0 1 0-1.6l5.978-5.91a.98.98 0 0 1 1.398 0c.387.38.387 1 0 1.38L10.324 12l5.386 5.33c.387.38.387 1 0 1.38" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.182 3.29a1.002 1.002 0 1 1 1.415 1.42L7.414 7.89l3.183 3.18a1.002 1.002 0 1 1-1.415 1.42L5.293 8.6a1.006 1.006 0 0 1 0-1.42z"/></svg>
  )
}
