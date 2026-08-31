import type { IconProps } from "./types"

export function FileText({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.586 0A2 2 0 0 1 11 .586L13.414 3A2 2 0 0 1 14 4.414V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM4 14h8V6H9a1 1 0 0 1-1-1V2H4zm6-3.5a1 1 0 1 1 0 2H6a1 1 0 1 1 0-2zm0-3a1 1 0 1 1 0 2H6a1 1 0 1 1 0-2zM10 4h1.586L10 2.414z"/></svg>
  )
}
