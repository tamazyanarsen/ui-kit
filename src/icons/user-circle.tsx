import type { IconProps } from "./types"

// icon / user circle — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function UserCircle({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -180)"><defs><clipPath id="user-circle-24-clip1_70326_26"><path fill="#fff" d="M160 180h24v24h-24z"/></clipPath></defs><g fill="currentColor" fillRule="evenodd" clipPath="url(#user-circle-24-clip1_70326_26)" clipRule="evenodd"><path d="M172 187a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0"/><path d="M172 197a7.14 7.14 0 0 0-3.545.94 7.03 7.03 0 0 0-2.591 2.564 1 1 0 0 1-1.728-1.008 9.04 9.04 0 0 1 3.327-3.293 9.15 9.15 0 0 1 9.074.001 9.03 9.03 0 0 1 3.327 3.292 1 1 0 0 1-1.728 1.008 7.04 7.04 0 0 0-2.591-2.564A7.14 7.14 0 0 0 172 197"/><path d="M172 202c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10m0 2c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -184)"><defs><clipPath id="user-circle-16-clip2_70326_26"><path fill="#fff" d="M112 184h16v16h-16z"/></clipPath></defs><g clipPath="url(#user-circle-16-clip2_70326_26)"><path fill="currentColor" d="M120 184a8 8 0 0 1 0 16 7.96 7.96 0 0 1-4.998-1.756A8 8 0 0 1 120 184m-.042 12a4 4 0 0 0-2.861 1.251c.86.477 1.85.749 2.903.749a6 6 0 0 0 2.903-.75 4 4 0 0 0-2.945-1.25m.042-10a6 6 0 0 0-4.471 10 6 6 0 0 1 1.437-1.177 4.5 4.5 0 1 1 6.064.002 6 6 0 0 1 1.441 1.175A6 6 0 0 0 120 186m0 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5"/></g></g></svg>
  )
}
