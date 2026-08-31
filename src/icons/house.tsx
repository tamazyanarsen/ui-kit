import type { IconProps } from "./types"

// icon / house — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function House({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.822 2.72c.322-.29.742-.46 1.177-.46s.856.17 1.178.46l7.5 6.82c.181.16.325.36.423.58.099.23.15.47.15.71v8.42h1.25c.552 0 1 .45 1 1s-.448 1-1 1h-21c-.552 0-1-.45-1-1s.448-1 1-1h1.25v-8.42c0-.24.051-.48.15-.71.098-.22.242-.42.423-.58zM4.75 19.25h4V15c0-.46.184-.91.512-1.24a1.74 1.74 0 0 1 1.238-.51h3c.464 0 .909.18 1.237.51s.513.78.513 1.24v4.25h4v-8.31l-7.251-6.59-7.249 6.59zm8.5 0v-4h-2.5v4z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M7.369 1.22c.393-.32.972-.29 1.338.07l5 5c.187.19.293.44.293.71v5h1c.552 0 1 .45 1 1s-.448 1-1 1H1c-.552 0-1-.45-1-1s.448-1 1-1h1V7a1 1 0 0 1 .293-.71l5-5zM4 7.41V12h1.5V8c0-.55.448-1 1-1h3c.552 0 1 .45 1 1v4H12V7.41l-4-4zM7.5 12h1V9h-1z"/></svg>
  )
}
