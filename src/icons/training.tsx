import type { IconProps } from "./types"

// icon / training — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Training({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M3.2 4C1.985 4 1 4.952 1 6.125v12.75c0 1.174.985 2.124 2.2 2.124h6.6c.845 0 1.616-.306 2.2-.811a3.35 3.35 0 0 0 2.2.811h6.6c1.214 0 2.2-.95 2.2-2.125V6.125C23 4.952 22.013 4 20.8 4h-6.6c-.846 0-1.616.306-2.2.812A3.35 3.35 0 0 0 9.8 4zm7.7 3.187v10.625c0 .587-.493 1.062-1.1 1.062H3.2V6.125h6.6c.607 0 1.1.476 1.1 1.062m2.2 10.625V7.187c0-.586.492-1.062 1.1-1.062h6.6v12.75h-6.6c-.608 0-1.1-.476-1.1-1.063"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 2c.77 0 1.47.291 2 .767A3 3 0 0 1 10 2h4c.552 0 1 .449 1 1v11a1 1 0 0 1-1 1h-4c-.77 0-1.469-.293-2-.769-.53.476-1.23.77-2 .77H2A1 1 0 0 1 1 14V3a1 1 0 0 1 1-1zm4 2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3V4zm-7 9h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H3z"/></svg>
  )
}
