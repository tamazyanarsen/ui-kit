import type { IconProps } from "./types"

// icon / clipboard — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Clipboard({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 2.994c0-1.103.895-1.993 2-1.993h6c1.104 0 2 .89 2 1.993h1c.795 0 1.558.32 2.12.878.563.57.88 1.33.88 2.124v14.001A3 3 0 0 1 18 23H6a3 3 0 0 1-3-3.002v-14c0-.796.316-1.555.878-2.125A3.02 3.02 0 0 1 6 2.994zM7 5H6a1 1 0 0 0-.707.296.98.98 0 0 0-.293.7v14.001a1 1 0 0 0 .293.712.98.98 0 0 0 .707.285h12a.98.98 0 0 0 .706-.285 1 1 0 0 0 .293-.712v-14a.98.98 0 0 0-.293-.7A1 1 0 0 0 18 5h-1a2.006 2.006 0 0 1-2 2.005H9c-1.105 0-2-.902-2-2.005m8 0H9V2.994h6z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9 1a2 2 0 0 1 1.73.996H11c1.657 0 3 1.341 3 3.002v7a3 3 0 0 1-3 3.003H5c-1.657 0-3-1.341-3-3.002v-7a3 3 0 0 1 3-3.003h.27A2 2 0 0 1 7 1zM5 4c-.553 0-1 .451-1 .997v7c0 .558.447.997 1 .997h6c.552 0 1-.439 1-.996v-7A1 1 0 0 0 11 4h-.27A2 2 0 0 1 9 4.998H7a2 2 0 0 1-1.73-.997z"/></svg>
  )
}
