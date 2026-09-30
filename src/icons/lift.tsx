import type { IconProps } from "./types"

// icon / lift — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Lift({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.23 1.999a.994.994 0 0 1 1-.997h1.54c.551 0 1 .44 1 .997a.994.994 0 0 1-1 .996h-1.54c-.551 0-1-.439-1-.996m1.737 1.305h-6.89c-.553 0-1 .45-1 1.009v16.682H2A1.004 1.004 0 0 0 2 23h20a1.003 1.003 0 0 0 0-2.005h-2.077V4.313c0-.558-.447-1.009-1-1.009zm5.955 17.691V5.309H13v15.686zm-6.922 0V5.309H6.077v15.686z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12 4.004c.552 0 1 .439 1 .997v7.997h1a1.001 1.001 0 0 1 0 2.005H2a1.004 1.004 0 0 1 0-2.005h1V5a.994.994 0 0 1 1-.997zm-3 8.994h2v-7H9zm-4 0h2v-7H5zM9 1.002c.552 0 1 .44 1 .997a.994.994 0 0 1-1 .996H7c-.552 0-1-.439-1-.996a.994.994 0 0 1 1-.997z"/></svg>
  )
}
