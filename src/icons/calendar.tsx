import type { IconProps } from "./types"

// icon / calendar — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Calendar({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 1a1 1 0 0 1 1 1v1h8V2a1 1 0 0 1 2 0v1h3.091C22.044 3 23 3.718 23 4.818v16.364c0 1.1-.956 1.818-1.909 1.818H2.909C1.956 23 1 22.282 1 21.182V4.818C1 3.718 1.956 3 2.909 3H6V2a1 1 0 0 1 1-1M6 5H3v4h18V5h-3v1a1 1 0 0 1-2 0V5H8v1a1 1 0 0 1-2 0zm15 6H3v10h18z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-60 -120)"><defs><clipPath id="calendar-16-clip0_70326_26"><path fill="#fff" d="M60 120h16v16H60z"/></clipPath></defs><g fill="currentColor" clipPath="url(#calendar-16-clip0_70326_26)"><path d="M62 134h12v-10H62zm14 .454c0 .993-.883 1.546-1.637 1.546H61.637c-.754 0-1.637-.553-1.637-1.546v-10.908c0-.993.883-1.546 1.637-1.546h12.726c.754 0 1.637.553 1.637 1.546z"/><path d="M70 124v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m-6 0v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m10 2a1 1 0 0 1 0 2H62a1 1 0 0 1 0-2z"/></g></g></svg>
  )
}
