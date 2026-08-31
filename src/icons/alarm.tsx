import type { IconProps } from "./types"

export function Alarm({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1M3.222 3.222a1 1 0 0 1 1.414 0L6.05 4.636A1 1 0 1 1 4.636 6.05L3.222 4.636a1 1 0 0 1 0-1.414m17.556 0a1 1 0 0 1 0 1.414L19.364 6.05a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0M5 12a7 7 0 0 1 14 0v6h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3zm2 6h10v-6a5 5 0 0 0-10 0zm-7-7a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1m20 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1M3 20v2h18v-2z" clipRule="evenodd"/></svg>
  )
}
