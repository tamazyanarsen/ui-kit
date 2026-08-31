import type { IconProps } from "./types"

// icon / add user — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function AddUser({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".5" d="M11.021 4.4c-1.174 0-2.125.94-2.125 2.1s.951 2.1 2.125 2.1 2.125-.94 2.125-2.1-.952-2.1-2.125-2.1M7.479 6.5c0-1.933 1.586-3.5 3.542-3.5s3.541 1.567 3.541 3.5-1.585 3.5-3.541 3.5-3.542-1.567-3.542-3.5m11.688 0c.391 0 .708.313.708.7v1.4h1.417c.391 0 .708.313.708.7s-.317.7-.708.7h-1.417v1.4c0 .387-.317.7-.708.7a.704.704 0 0 1-.709-.7V10h-1.416a.704.704 0 0 1-.709-.7c0-.387.317-.7.709-.7h1.416V7.2c0-.387.317-.7.709-.7m-13.13 5.925A3.57 3.57 0 0 1 8.542 11.4H13.5c.939 0 1.84.369 2.504 1.025a3.48 3.48 0 0 1 1.038 2.475v4.4c0 .387-.317.7-.709.7a.704.704 0 0 1-.708-.7v-4.4a2.1 2.1 0 0 0-.622-1.485A2.14 2.14 0 0 0 13.5 12.8H8.542c-.564 0-1.104.221-1.503.615a2.1 2.1 0 0 0-.622 1.485v4.4c0 .387-.317.7-.709.7A.704.704 0 0 1 5 19.3v-4.4c0-.928.373-1.818 1.037-2.475" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -760)"><defs><clipPath id="add-user-16-clip4_70326_26"><path fill="#fff" d="M112 760h16v16h-16z"/></clipPath></defs><g clipPath="url(#add-user-16-clip4_70326_26)"><path fill="currentColor" d="M121 769a3 3 0 0 1 3 3v2a1 1 0 0 1-2 0v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2a1 1 0 0 1-2 0v-2a3 3 0 0 1 3-3zm4-5a1 1 0 0 1 1 1v1.005h1.005a1 1 0 0 1 0 2H126V769a1 1 0 0 1-2 0v-.995h-.995a1 1 0 0 1 0-2H124V765a1 1 0 0 1 1-1m-7-3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 2a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 118 763"/></g></g></svg>
  )
}
