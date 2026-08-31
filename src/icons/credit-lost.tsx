import type { IconProps } from "./types"

// icon / credit lost — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CreditLost({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1 8a1 1 0 0 1 1-1h19a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M3 4v12h11a1 1 0 0 1 0 2H2.769A1.773 1.773 0 0 1 1 16.222V3.778C1 2.806 1.782 2 2.769 2h17.462C21.218 2 22 2.806 22 3.778V10a1 1 0 0 1-2 0V4z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M19.5 14c-.867 0-1.5.665-1.5 1.4a1 1 0 0 1-2 0c0-1.916 1.606-3.4 3.5-3.4s3.5 1.484 3.5 3.4c0 1.566-1.073 2.844-2.5 3.258V19a1 1 0 0 1-2 0v-1.2a1 1 0 0 1 1-1c.867 0 1.5-.665 1.5-1.4s-.633-1.4-1.5-1.4" clipRule="evenodd"/><path fill="currentColor" d="M20.5 21.547a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.5 13.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-.957-5.56a2.5 2.5 0 1 1 1.907 4.621.999.999 0 0 1-1.95-.311v-.5a1 1 0 0 1 1-1 .5.5 0 1 0-.416-.777 1 1 0 0 1-1.662-1.112 2.5 2.5 0 0 1 1.121-.921M12 1a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0H2v4h6a1 1 0 0 1 0 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM2 4h10V3H2z"/></svg>
  )
}
