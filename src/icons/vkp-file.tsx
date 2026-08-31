import type { IconProps } from "./types"

// icon / VKP / File — 17. Docs VKP, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function VkpFile({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8 12h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2m8-4H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2m-8 8h2a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2"/><path fill="currentColor" fillRule="evenodd" d="m20.707 16.707.019-.02A1 1 0 0 0 21 16V4a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h8a1 1 0 0 0 .707-.293zM13 16v5H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v11h-5a1 1 0 0 0-1 1m2 1h2.586L15 19.586z" clipRule="evenodd"/><path fill="currentColor" d="M8 12h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2m8-4H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2m-8 8h2a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2"/><path fill="currentColor" fillRule="evenodd" d="m20.707 16.707.019-.02A1 1 0 0 0 21 16V4a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h8a1 1 0 0 0 .707-.293zM13 16v5H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v11h-5a1 1 0 0 0-1 1m2 1h2.586L15 19.586z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M5.333 8h5.334a.667.667 0 0 0 0-1.333H5.333a.666.666 0 1 0 0 1.333m5.334-2.667H5.333a.666.666 0 1 1 0-1.333h5.334a.666.666 0 1 1 0 1.333m-5.334 5.334h1.334a.667.667 0 0 0 0-1.334H5.333a.667.667 0 0 0 0 1.334"/><path fill="currentColor" fillRule="evenodd" d="m13.805 11.138.012-.013a.66.66 0 0 0 .183-.458v-8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10.666a2 2 0 0 0 2 2h5.333a.67.67 0 0 0 .472-.195zm-5.138-.471V14H4a.667.667 0 0 1-.667-.667V2.667C3.333 2.298 3.632 2 4 2h8c.368 0 .667.298.667.667V10H9.333a.666.666 0 0 0-.666.667m1.333.666h1.724L10 13.057z" clipRule="evenodd"/><path fill="currentColor" d="M5.333 8h5.334a.667.667 0 0 0 0-1.333H5.333a.666.666 0 1 0 0 1.333m5.334-2.667H5.333a.666.666 0 1 1 0-1.333h5.334a.666.666 0 1 1 0 1.333m-5.334 5.334h1.334a.667.667 0 0 0 0-1.334H5.333a.667.667 0 0 0 0 1.334"/><path fill="currentColor" fillRule="evenodd" d="m13.805 11.138.012-.013a.66.66 0 0 0 .183-.458v-8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10.666a2 2 0 0 0 2 2h5.333a.67.67 0 0 0 .472-.195zm-5.138-.471V14H4a.667.667 0 0 1-.667-.667V2.667C3.333 2.298 3.632 2 4 2h8c.368 0 .667.298.667.667V10H9.333a.666.666 0 0 0-.666.667m1.333.666h1.724L10 13.057z" clipRule="evenodd"/></svg>
  )
}
