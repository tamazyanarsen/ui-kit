import type { IconProps } from "./types"

// 24px drawing is Figma's `icon / alert`, e.g. inside Empty Page's 48px tile
// (node 4109:25377). It fills the whole 24 box and is optically corrected
// rather than scaled: a 2px ring with a stem spanning y 5→15 (41.7% of the
// height), where the 16px drawing below has a proportionally heavier ring
// and a much shorter y 4→9 stem.
export function CircleAlert({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M12 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1" clipRule="evenodd"/><path fill="currentColor" d="M13 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M7 8V5a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m9 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/><path fill="currentColor" d="M9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
  )
}
