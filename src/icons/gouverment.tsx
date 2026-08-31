import type { IconProps } from "./types"

// icon / gouverment — 19. Categories, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Gouverment({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.432 1.43c.344-.24.803-.24 1.147 0l10 7c.358.25.512.7.38 1.12a.995.995 0 0 1-.953.7h-1.984v7.5H21c.552 0 1 .45 1 1s-.448 1-1 1H3c-.552 0-1-.45-1-1s.448-1 1-1h1.011v-7.5H2.006a1 1 0 0 1-.574-1.82zm-5.421 8.82v7.5H8.65v-7.5zm4.639 0v7.5h2.722v-7.5zm4.722 0v7.5h2.65v-7.5zm-10.194-2h13.655l-6.827-4.78zM0 21.75c0-.55.448-1 1-1h22c.552 0 1 .45 1 1s-.448 1-1 1H1c-.552 0-1-.45-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -1588)"><defs><clipPath id="gouverment-16-clip9_70326_26"><path fill="#fff" d="M56 1588h16v16H56z"/></clipPath></defs><g clipPath="url(#gouverment-16-clip9_70326_26)"><path fill="currentColor" d="M63.555 1589.1a1 1 0 0 1 1.026.09l7 5A.996.996 0 0 1 71 1596h-1.5v5H71c.552 0 1 .45 1 1s-.448 1-1 1H57c-.552 0-1-.45-1-1s.448-1 1-1h1.5v-5H57a.996.996 0 0 1-.581-1.81l7-5zM60.5 1596v5h1v-5zm3 0v5h1v-5zm3 0v5h1v-5zm-6.38-2h7.76l-3.88-2.77z"/></g></g></svg>
  )
}
