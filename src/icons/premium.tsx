import type { IconProps } from "./types"

// icon / premium — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Premium({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 3a1 1 0 0 1 .905.575l2.555 5.438 5.075-2.668a1.002 1.002 0 0 1 1.434 1.133l-3 11.769A1 1 0 0 1 18 20H6a1 1 0 0 1-.969-.753l-3-11.769a.999.999 0 0 1 1.434-1.133L8.54 9.013l2.555-5.438A1 1 0 0 1 12 3m0 3.351L9.905 10.81a1 1 0 0 1-1.37.46L4.524 9.161 6.777 18h10.446l2.253-8.839-4.011 2.109a1 1 0 0 1-1.37-.46z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.001 2a1 1 0 0 1 .894.553l1.553 3.105 3.105-1.553a1 1 0 0 1 1.417 1.137l-2 8a1 1 0 0 1-.969.758h-8a1 1 0 0 1-.97-.758l-2-8a1.002 1.002 0 0 1 1.417-1.137l3.105 1.553 1.553-3.105.071-.121c.185-.268.492-.432.824-.432M6.895 7.447a1 1 0 0 1-1.342.448L3.497 6.866 4.781 12h6.439l1.284-5.134-2.056 1.029a1 1 0 0 1-1.342-.448L8.001 5.236z"/></svg>
  )
}
