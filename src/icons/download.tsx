import type { IconProps } from "./types"

export function Download({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 1c.368 0 .667.298.667.667v6.451l1.884-1.884a.667.667 0 1 1 .943.943l-3.023 3.022a.667.667 0 0 1-.942 0L4.506 7.177a.667.667 0 0 1 .943-.943l1.884 1.884V1.667C7.333 1.298 7.632 1 8 1m-6 9c.368 0 .667.299.667.667V14h10.666v-3.333a.667.667 0 0 1 1.334 0v3.5c0 .329-.143.631-.376.845a1.24 1.24 0 0 1-.837.321H2.545c-.303 0-.605-.11-.836-.321a1.15 1.15 0 0 1-.376-.845v-3.5c0-.368.299-.667.667-.667" clipRule="evenodd"/></svg>
  )
}
