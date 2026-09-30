import type { IconProps } from "./types"

// icon / Download — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Download({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 1c.368 0 .667.298.667.667v6.451l1.884-1.884a.667.667 0 1 1 .943.943l-3.023 3.022a.667.667 0 0 1-.942 0L4.506 7.177a.667.667 0 0 1 .943-.943l1.884 1.884V1.667C7.333 1.298 7.632 1 8 1m-6 9c.368 0 .667.299.667.667V14h10.666v-3.333a.667.667 0 0 1 1.334 0v3.5c0 .329-.143.631-.376.845a1.24 1.24 0 0 1-.837.321H2.545c-.303 0-.605-.11-.836-.321a1.15 1.15 0 0 1-.376-.845v-3.5c0-.368.299-.667.667-.667" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7 1a1 1 0 0 1 2 0v6.495l1.634-1.633a1 1 0 1 1 1.414 1.414l-3.341 3.34a1 1 0 0 1-1.414 0l-3.34-3.34a1 1 0 1 1 1.413-1.414L7 7.495zm9 13.363A1.637 1.637 0 0 1 14.363 16H1.637A1.637 1.637 0 0 1 0 14.363V9.91a1 1 0 1 1 2 0V14h12V9.91a1 1 0 1 1 2 0z"/></svg>
  )
}
