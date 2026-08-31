import type { IconProps } from "./types"

// icon / archive — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Archive({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M.373 3.438c0-.497.411-.9.916-.9h20.149c.506 0 .915.403.915.9v4.495c0 .497-.409.9-.915.9h-.916v10.79c0 .497-.411.9-.916.9H3.121a.91.91 0 0 1-.916-.9V8.833h-.916a.91.91 0 0 1-.916-.9zm3.663 5.395v9.892H18.69V8.833zm16.486-1.798H2.205V4.336h18.317zM8.616 11.531c0-.497.41-.9.915-.9h3.664c.505 0 .916.403.916.9a.91.91 0 0 1-.916.899H9.531a.91.91 0 0 1-.915-.899" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.404 1.536a1 1 0 0 1 1 1v2.996a1 1 0 0 1-1 1v5.995a1 1 0 0 1-.999.998H2.414a1 1 0 0 1-.999-.998V6.532a1 1 0 0 1-.999-1V2.536c0-.553.447-1 .999-1zm-9.991 9.991h7.993V6.532H3.413zm4.595-3.996a.998.998 0 1 1 0 1.998H6.011a1 1 0 1 1 0-1.998zM2.414 4.533h9.991v-.999H2.414z"/></svg>
  )
}
