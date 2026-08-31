import type { IconProps } from "./types"

// icon / print — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Print({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 2c0-.55.448-1 1-1h14c.552 0 1 .45 1 1v4c0 .55-.448 1-1 1s-1-.45-1-1V3H6v3c0 .55-.448 1-1 1s-1-.45-1-1zm0 12c0-.55.448-1 1-1h14c.552 0 1 .45 1 1v8c0 .55-.448 1-1 1H5c-.552 0-1-.45-1-1zm2 1v6h12v-6z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M3.733 7C3.38 7 3 7.32 3 7.83V16h1.5c.552 0 1 .45 1 1s-.448 1-1 1H2c-.552 0-1-.45-1-1V7.83C1 6.32 2.172 5 3.733 5h16.534C21.828 5 23 6.32 23 7.83V17c0 .55-.448 1-1 1h-2.5c-.552 0-1-.45-1-1s.448-1 1-1H21V7.83c0-.51-.38-.83-.733-.83z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.667.47c.478 0 .866.39.866.86v1.8c1.152.02 2 .99 2 2.09v6.11c0 .48-.388.87-.866.87h-1.134v2.47a.86.86 0 0 1-.866.86H3.334a.86.86 0 0 1-.867-.86V12.2H1.334a.87.87 0 0 1-.867-.87V5.22c0-1.1.848-2.07 2-2.09v-1.8c0-.47.388-.86.867-.86zM4.2 13.8h7.601v-3.6H4.2zM2.489 4.87c-.118 0-.289.11-.289.35v5.25h.267V9.33c0-.47.388-.86.867-.86h9.333c.478 0 .866.39.866.86v1.14h.268V5.22c0-.24-.171-.35-.289-.35zM4.2 3.13h7.601V2.2H4.2z"/></svg>
  )
}
