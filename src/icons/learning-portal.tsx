import type { IconProps } from "./types"

// icon / learning portal — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function LearningPortal({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7.305 3c-.376 0-.736.157-1.001.44a1.54 1.54 0 0 0-.416 1.06v11.837c.44-.22.922-.337 1.417-.337h11.806V3zM21 2c0-.552-.424-1-.945-1H7.305c-.877 0-1.717.368-2.337 1.025A3.6 3.6 0 0 0 3.999 4.5v15c0 .93.35 1.82.969 2.475A3.22 3.22 0 0 0 7.305 23h12.75c.521 0 .945-.448.945-1zm-1.889 16H7.305c-.376 0-.736.157-1.001.44a1.54 1.54 0 0 0-.416 1.06c0 .398.15.779.416 1.06.265.281.625.44 1.001.44h11.806z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5q-.055 0-.107-.006A2.493 2.493 0 0 1 2.5 12.5v-9q0-.054.005-.103a2.5 2.5 0 0 1 .185-.855A2.51 2.51 0 0 1 5 1zM5 12a.5.5 0 1 0 0 1h7v-1zm0-9a.49.49 0 0 0-.463.31.5.5 0 0 0-.038.19v6.55q.195-.037.394-.045A1 1 0 0 1 5 10h7V3z"/></svg>
  )
}
