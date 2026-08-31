import type { IconProps } from "./types"

// icon / overview — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Overview({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 2h9v9H2zm0 11h9v9H2zm11 0h9v9h-9zm0-11h9v9h-9z"/><path fill="currentColor" fillRule="evenodd" d="M9 4H4v5h5zm0 11H4v5h5zm11 0h-5v5h5zm0-11h-5v5h5zM2 2v9h9V2zm0 11v9h9v-9zm20 0v9h-9v-9zM13 2v9h9V2z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M1.333 1.333h6v6h-6zm0 7.334h6v6h-6zm7.333 0h6v6h-6zm0-7.334h6v6h-6z"/><path fill="currentColor" fillRule="evenodd" d="M6 2.667H2.666V6H6zM6 10H2.666v3.333H6zm7.333 0H10v3.333h3.333zm0-7.333H10V6h3.333zm-12-1.334v6h6v-6zm0 7.334v6h6v-6zm13.333 0v6h-6v-6zm-6-7.334v6h6v-6z" clipRule="evenodd"/></svg>
  )
}
