import type { IconProps } from "./types"

// icon / metro — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Metro({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M15.381 5.054L15.231 5.054L12.03 11.326L8.714 5L4.173 16.428H3V17.346H9.428V16.428H8.153L9.428 12.856L12.03 17.346L14.53 12.856L15.805 16.428H14.53V17.346H20.906V16.428H19.802L15.381 5.054Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.254 3.369L10.154 3.369L8.02 7.55L5.809 3.333L2.782 10.952H2V11.564H6.285V10.952H5.435L6.285 8.571L8.02 11.564L9.686 8.571L10.537 10.952H9.686V11.564H13.938V10.952H13.201L10.254 3.369Z" fill="currentColor" />
    </svg>
  )
}
