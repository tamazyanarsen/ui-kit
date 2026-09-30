import type { IconProps } from "./types"

// icon / sort — 09. Settings Menus, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Sort({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 1c.28 0 .548.12.737.32l5.5 6c.373.41.346 1.04-.061 1.42a1.01 1.01 0 0 1-1.413-.06L12 3.48l-4.763 5.2a1.01 1.01 0 0 1-1.413.06 1.01 1.01 0 0 1-.061-1.42l5.5-6c.189-.2.457-.32.737-.32M5.824 15.26a1.01 1.01 0 0 1 1.413.06L12 20.52l4.763-5.2a1.01 1.01 0 0 1 1.413-.06c.407.38.434 1.01.061 1.42l-5.5 6c-.189.2-.457.32-.737.32s-.548-.12-.737-.32l-5.5-6a1.01 1.01 0 0 1 .061-1.42" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.965 6.02a1 1 0 1 0 1.44-1.387L8.721.807a1 1 0 0 0-1.368-.07l-.074.07-3.678 3.826A1 1 0 0 0 5.043 6.02L8 2.94zM7.993 15.5c.271.002.532-.107.722-.3l3.726-3.807a1 1 0 0 0-1.428-1.399L8.01 13.06l-2.909-3.056a1 1 0 0 0-1.448 1.379l3.622 3.806a1 1 0 0 0 .717.311"/></svg>
  )
}
