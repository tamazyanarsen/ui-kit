import type { IconProps } from "./types"

// icon / investment qualification — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function InvestmentQualification({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m9 10.5 1.846 1.5L15 9"/><circle cx="12" cy="10" r="7"/><path d="M17 15.5v5.023a1 1 0 0 1-1.371.928L12.37 20.15a1 1 0 0 0-.742 0l-3.258 1.3A1 1 0 0 1 7 20.523V15"/></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.943 0a5.664 5.664 0 0 1 5.661 5.667 5.65 5.65 0 0 1-1.332 3.651l.001.012v3.343a1.666 1.666 0 0 1-2.284 1.553l-2.046-.818-2.045.818a1.666 1.666 0 0 1-2.284-1.553V9.318A5.664 5.664 0 0 1 7.943 0m2.332 10.823c-.711.321-1.5.51-2.332.51s-1.62-.189-2.331-.51v1.364l1.713-.688.151-.047a1.57 1.57 0 0 1 .935 0l.151.047 1.713.688zM7.943 2.004a3.66 3.66 0 0 0-3.664 3.663A3.66 3.66 0 0 0 7.943 9.33a3.66 3.66 0 0 0 3.663-3.663 3.66 3.66 0 0 0-3.663-3.663m1.413 2.193a.996.996 0 0 1 1.395.213 1.003 1.003 0 0 1-.224 1.399L7.76 7.812a1.006 1.006 0 0 1-1.215-.035l-1.23-.996a1.006 1.006 0 0 1-.146-1.411.994.994 0 0 1 1.406-.142l.635.51z"/></svg>
  )
}
