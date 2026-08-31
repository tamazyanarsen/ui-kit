import type { IconProps } from "./types"

// icon / users dom24 — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function UsersDom24({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13 14a5 5 0 0 1 5 5v2a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5zm6.032.88a1 1 0 0 1 1.218-.718A5 5 0 0 1 24 19v2a1 1 0 0 1-2 0v-1.999a3 3 0 0 0-2.25-2.902 1 1 0 0 1-.718-1.219"/><path fill="currentColor" fillRule="evenodd" d="M9 2a5 5 0 1 1-.001 10.001A5 5 0 0 1 9 2m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" clipRule="evenodd"/><path fill="currentColor" d="M15.031 2.882a1 1 0 0 1 1.217-.721 5.001 5.001 0 0 1 0 9.688 1 1 0 0 1-.496-1.938 3 3 0 0 0 0-5.812 1 1 0 0 1-.721-1.217"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9 9a3 3 0 0 1 3 3v2a1 1 0 0 1-2 0v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 1-2 0v-2a3 3 0 0 1 3-3zm4 0a3 3 0 0 1 3 3v2a1 1 0 0 1-2 0v-2a1 1 0 0 0-.897-.995l-.206-.01A1 1 0 0 1 13 9M6 1a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m3.728.821a1 1 0 0 1 1.237-.685 3.5 3.5 0 0 1 1.803 1.221 3.505 3.505 0 0 1 .107 4.139 3.5 3.5 0 0 1-1.737 1.314 1 1 0 0 1-.651-1.891 1.5 1.5 0 0 0 1.012-1.458 1.5 1.5 0 0 0-1.086-1.402 1 1 0 0 1-.685-1.238M6 3a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 6 3"/></svg>
  )
}
