import type { IconProps } from "./types"

export function CirclePlus({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12m12-5.714a1 1 0 0 1 1 1V11h3.714a1 1 0 1 1 0 2H13v3.714a1 1 0 1 1-2 0V13H7.286a1 1 0 1 1 0-2H11V7.286a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
  )
}
