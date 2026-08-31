import type { IconProps } from "./types"

// icon / company — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Company({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7.982 3.48a2.5 2.5 0 0 1 1.768-.73h4.5a2.494 2.494 0 0 1 2.5 2.5v.5h3.5c.966 0 1.75.78 1.75 1.75v12c0 .97-.784 1.75-1.75 1.75H3.75c-.966 0-1.75-.78-1.75-1.75v-12c0-.97.784-1.75 1.75-1.75h3.5v-.5c0-.66.263-1.3.732-1.77M4 7.75V14h16V7.75zm10.75-2h-5.5v-.5c0-.13.053-.26.146-.35a.48.48 0 0 1 .354-.15h4.5c.133 0 .26.05.354.15.093.09.146.22.146.35zM20 16H4v3.25h16z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9 1c1.657 0 3 1.34 3 3 1.657 0 3 1.34 3 3v5c0 1.66-1.343 3-3 3H4c-1.657 0-3-1.34-3-3V7c0-1.66 1.343-3 3-3 0-1.66 1.343-3 3-3zM3 12c0 .55.448 1 1 1h8c.552 0 1-.45 1-1zm1-6c-.552 0-1 .45-1 1v3h10V7c0-.55-.448-1-1-1zm3-3c-.552 0-1 .45-1 1h4c0-.55-.448-1-1-1z"/></svg>
  )
}
