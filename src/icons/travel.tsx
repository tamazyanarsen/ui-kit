import type { IconProps } from "./types"

// icon / travel — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Travel({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M6 3.996A3.006 3.006 0 0 1 9 .994h6c1.656 0 3 1.352 3 3.002v1.008h3c1.657 0 3 1.34 3 2.99v12.008a3.006 3.006 0 0 1-3 3.002H3c-1.657 0-3-1.353-3-3.002V7.994c0-1.65 1.343-2.99 3-2.99h3zm0 3.002H3a1 1 0 0 0-1 .996v12.008a1 1 0 0 0 1 .996h3zm2 14v-14h8v14zm10 0h3a1 1 0 0 0 1-.996V7.994a1 1 0 0 0-1-.996h-3zM16 5.004H8V3.996c0-.546.448-.997 1-.997h6c.552 0 1 .45 1 .997z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.991 0c1.104 0 1.999.901 1.999 2.003v.996h.999a2.996 2.996 0 0 1 2.997 2.999v5.999a2.993 2.993 0 0 1-2.997 2.987H2.998A2.993 2.993 0 0 1 0 11.997V5.998a2.997 2.997 0 0 1 2.998-2.999h.999v-.996C3.997.901 4.891 0 5.995 0zm1.999 12.993h.999a1 1 0 0 0 .999-.996V5.998a.99.99 0 0 0-.999-.995h-.999zm-5.995 0h3.996v-7.99H5.995zm-2.997-7.99c-.552 0-1 .438-1 .995v5.999c0 .545.448.996 1 .996h.999v-7.99zm2.997-2.004h3.996v-.996H5.995z"/></svg>
  )
}
