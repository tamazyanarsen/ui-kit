import type { IconProps } from "./types"

export function CircleHelp({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M12 7c-1.467 0-2.5 1.067-2.5 2.2a1 1 0 1 1-2 0C7.5 6.798 9.6 5 12 5s4.5 1.798 4.5 4.2c0 2.06-1.546 3.677-3.5 4.094V14a1 1 0 1 1-2 0v-1.6a1 1 0 0 1 1-1c1.467 0 2.5-1.067 2.5-2.2S13.467 7 12 7" clipRule="evenodd"/><path fill="currentColor" d="M13 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
  )
}
