import type { IconProps } from "./types"

// icon / office management — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function OfficeManagement({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 4.8c-.265 0-.52.095-.708.263A.86.86 0 0 0 3 5.7v12.6c0 .239.106.468.293.636.188.168.443.263.707.263h16c.267 0 .52-.095.708-.263A.86.86 0 0 0 21 18.3V8.4a.86.86 0 0 0-.293-.636A1.06 1.06 0 0 0 20 7.5h-9c-.335 0-.647-.15-.832-.4L8.464 4.8zM1.877 3.79A3.18 3.18 0 0 1 3.999 3h5c.335 0 .647.15.832.4l1.704 2.3H20c.796 0 1.559.284 2.121.79.563.507.878 1.194.878 1.91v9.9c0 .715-.315 1.402-.878 1.91A3.17 3.17 0 0 1 20 21H4a3.18 3.18 0 0 1-2.122-.79C1.316 19.701 1 19.014 1 18.3V5.7c0-.716.316-1.403.878-1.909" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 2q.087 0 .171.016.014 0 .027.004l.048.011.046.012a1 1 0 0 1 .267.127l.075.056q.038.032.072.066L7.914 3.5H12a3 3 0 0 1 3 3V11a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM4 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1H7.5a1 1 0 0 1-.707-.293L5.586 4z"/></svg>
  )
}
