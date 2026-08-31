import type { IconProps } from "./types"

// icon / user check — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function UserCheck({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.5 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10.001.001A5 5 0 0 1 3.5 7m20.207 1.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a.999.999 0 1 1 1.414-1.414L19 11.586l3.293-3.293a1 1 0 0 1 1.414 0M1.464 15.464A5 5 0 0 1 5 14h7c1.326 0 2.598.527 3.536 1.464A5 5 0 0 1 17 19v2a1 1 0 0 1-2 0v-2c0-.796-.316-1.559-.879-2.121A3 3 0 0 0 12 16H5c-.796 0-1.559.316-2.121.879A3 3 0 0 0 2 19v2a1 1 0 0 1-2 0v-2c0-1.326.527-2.598 1.464-3.536" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9 9a3 3 0 0 1 3 3v2a1 1 0 0 1-2 0v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 1-2 0v-2a3 3 0 0 1 3-3zm5.27-3.753a1.001 1.001 0 0 1 1.455 1.372L13.2 9.296a1 1 0 0 1-1.413.042l-1.496-1.411a1 1 0 0 1 1.372-1.455l.769.724zM6 1a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 2a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 6 3"/></svg>
  )
}
