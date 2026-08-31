import type { IconProps } from "./types"

// icon / lift — 18. Other, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Lift({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.129.995c0-.557.448-.995.999-.995h1.537c.552 0 1 .438 1 .995a.993.993 0 0 1-1 .996h-1.537a.993.993 0 0 1-.999-.996m1.735 1.304H4.98c-.552 0-.999.451-.999 1.008v16.668H1.906a1.002 1.002 0 0 0 0 2.003h19.982a1.002 1.002 0 0 0 0-2.003h-2.075V3.307c0-.557-.447-1.008-1-1.008zm5.95 17.676V4.303h-4.918v15.672zm-6.916 0V4.303H5.979v15.672z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.94 2.999c.551 0 .999.438.999.996v7.99h.999a1 1 0 0 1 0 2.003H1.948a1 1 0 0 1 0-2.003h1v-7.99c0-.558.447-.996.999-.996zm-2.998 8.986h1.998V4.99H8.942zm-3.996 0h1.998V4.99H4.946zM8.942 0c.552 0 .999.438.999.995a.99.99 0 0 1-.999.996H6.944a.99.99 0 0 1-.999-.996c0-.557.447-.995.999-.995z"/></svg>
  )
}
