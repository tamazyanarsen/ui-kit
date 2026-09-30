import type { IconProps } from "./types"

// icon / Check — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Check({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M20.456 6.382a1 1 0 0 1 0 1.414l-9.822 9.822a1 1 0 0 1-1.414 0l-5.676-5.675a1 1 0 1 1 1.414-1.415l4.969 4.969 9.115-9.115a1 1 0 0 1 1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.972 3.287a1 1 0 0 1 1.402 1.426L7.03 11.94a1 1 0 0 1-1.4.002L2.3 8.688a1 1 0 0 1 1.4-1.431l2.626 2.568z"/></svg>
  )
}
