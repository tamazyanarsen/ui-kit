import type { IconProps } from "./types"

// icon / metro — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Metro({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M15.381 5.054h-.15l-3.201 6.272L8.714 5 4.173 16.428H3v.918h6.428v-.918H8.153l1.275-3.572 2.602 4.49 2.5-4.49 1.275 3.572H14.53v.918h6.376v-.918h-1.104z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.254 3.369h-.1L8.02 7.55 5.809 3.333l-3.027 7.619H2v.612h4.285v-.612h-.85l.85-2.381 1.735 2.993 1.666-2.993.851 2.381h-.851v.612h4.252v-.612h-.737z"/></svg>
  )
}
