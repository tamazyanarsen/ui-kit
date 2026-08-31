import type { IconProps } from "./types"

// icon / pharmacy — 19. Categories, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pharmacy({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.667 3v5.67c0 .55-.448 1-1 1H3v4.66h5.667c.552 0 1 .45 1 1V21h4.666v-5.67c0-.55.448-1 1-1H21V9.67h-5.667c-.552 0-1-.45-1-1V3zM8.204 1.54C8.547 1.19 9.014 1 9.5 1h5c.486 0 .953.19 1.296.54.344.34.537.81.537 1.29v4.84h4.834c.486 0 .952.19 1.296.53.344.35.537.81.537 1.3v5c0 .49-.193.95-.537 1.3-.344.34-.81.53-1.296.53h-4.834v4.84c0 .48-.193.95-.537 1.29-.343.35-.81.54-1.296.54h-5c-.486 0-.953-.19-1.296-.54a1.82 1.82 0 0 1-.537-1.29v-4.84H2.833c-.486 0-.952-.19-1.296-.53A1.85 1.85 0 0 1 1 14.5v-5c0-.49.193-.95.537-1.3.344-.34.81-.53 1.296-.53h4.834V2.83c0-.48.193-.95.537-1.29" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 6H9c0 .55.448 1 1 1zm4 0h1c0-.55-.448-1-1-1zm0 4v1c.552 0 1-.45 1-1zm-4 0V9c-.552 0-1 .45-1 1zm0 4v1c.552 0 1-.45 1-1zm-4 0H5c0 .55.448 1 1 1zm0-4h1c0-.55-.448-1-1-1zm-4 0H1c0 .55.448 1 1 1zm0-4V5c-.552 0-1 .45-1 1zm4 0v1c.552 0 1-.45 1-1zm0-4V1c-.552 0-1 .45-1 1zm4 0h1c0-.55-.448-1-1-1zm0 4v1h4V5h-4zm4 0h-1v4h2V6zm0 4V9h-4v2h4zm-4 0H9v4h2v-4zm0 4v-1H6v2h4zm-4 0h1v-4H5v4zm0-4V9H2v2h4zm-4 0h1V6H1v4zm0-4v1h4V5H2zm4 0h1V2H5v4zm0-4v1h4V1H6zm4 0H9v4h2V2z"/></svg>
  )
}
