import type { IconProps } from "./types"

export function LogOut({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 2a1 1 0 0 1 0 2H3.5v8H6a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path fill="currentColor" d="M10.293 4.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L11.586 9H6.5a1 1 0 0 1 0-2h5.086l-1.293-1.293a1 1 0 0 1 0-1.414"/></svg>
  )
}
