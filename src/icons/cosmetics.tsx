import type { IconProps } from "./types"

// icon / cosmetics — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Cosmetics({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 1a1 1 0 0 1 1-1h7.2c.78 0 1.5.344 2.017.917A3.12 3.12 0 0 1 19 2.999a1 1 0 1 1-2 0c0-.296-.108-.563-.27-.745A.72.72 0 0 0 16.2 2H13v3h1c.956 0 1.743.57 2.246 1.324.503.753.754 1.718.754 2.675v2.006a4.2 4.2 0 0 1 4 4.194v7a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 22.2v-7a4.2 4.2 0 0 1 4-4.194V9c0-.958.25-1.923.754-2.676C8.257 5.569 9.044 5 10 5h1V2H9a1 1 0 0 1-1-1m1 10h6V9c0-.634-.17-1.197-.418-1.567S14.104 7 14 7h-4c-.104 0-.335.063-.582.433C9.17 7.803 9 8.366 9 9zm-1.8 2A2.203 2.203 0 0 0 5 15.2v6.799h14v-6.8a2.2 2.2 0 0 0-2.2-2.2z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M11 0a2 2 0 0 1 2 2 1 1 0 0 1-2 0H9v1a3 3 0 0 1 3 3v1.173c1.165.412 2 1.52 2 2.827v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5c0-1.307.835-2.415 2-2.827V6a3 3 0 0 1 3-3V2H6a1 1 0 0 1 0-2zM5 9a1 1 0 0 0-1 1v4h8v-4a1 1 0 0 0-1-1zm2-4a1 1 0 0 0-1 1v1h4V6a1 1 0 0 0-1-1z"/></svg>
  )
}
