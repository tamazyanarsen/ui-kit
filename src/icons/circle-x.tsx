import type { IconProps } from "./types"

export function CircleX({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12m7.96-4.04a1 1 0 0 1 1.414 0L12 10.585l2.626-2.626a1 1 0 1 1 1.415 1.414L13.414 12l2.627 2.626a1 1 0 0 1-1.415 1.415L12 13.414l-2.626 2.627a1 1 0 1 1-1.415-1.415L10.586 12 7.959 9.374a1 1 0 0 1 0-1.415" clipRule="evenodd"/></svg>
  )
}
