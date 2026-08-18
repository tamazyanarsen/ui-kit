import type { IconProps } from "./types"

// icon / minus circle, delete widget — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function MinusCircleDeleteWidget({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="160.000 500.000 24.000 24.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><clipPath id="minus-circle-delete-widget-24-clip2_70326_26"> <rect width="24" height="24" fill="white" transform="translate(160 500)" /> </clipPath></defs><g clipPath="url(#minus-circle-delete-widget-24-clip2_70326_26)"> <path fillRule="evenodd" clipRule="evenodd" d="M172 502C166.477 502 162 506.477 162 512C162 517.523 166.477 522 172 522C177.523 522 182 517.523 182 512C182 506.477 177.523 502 172 502ZM160 512C160 505.373 165.373 500 172 500C178.627 500 184 505.373 184 512C184 518.627 178.627 524 172 524C165.373 524 160 518.627 160 512ZM166.286 512C166.286 511.448 166.733 511 167.286 511H176.714C177.267 511 177.714 511.448 177.714 512C177.714 512.552 177.267 513 176.714 513H167.286C166.733 513 166.286 512.552 166.286 512Z" fill="currentColor" /> </g>
      </svg>
    )
  }

  return (
    <svg viewBox="56.000 504.000 16.000 16.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs><clipPath id="minus-circle-delete-widget-16-clip3_70326_26"> <rect width="16" height="16" fill="white" transform="translate(56 504)" /> </clipPath></defs><g clipPath="url(#minus-circle-delete-widget-16-clip3_70326_26)"> <path d="M70 512C70 508.686 67.314 506 64 506C60.686 506 58 508.686 58 512C58 515.314 60.686 518 64 518C67.314 518 70 515.314 70 512ZM67 511C67.552 511 68 511.448 68 512C68 512.552 67.552 513 67 513H61C60.448 513 60 512.552 60 512C60 511.448 60.448 511 61 511H67ZM72 512C72 516.418 68.418 520 64 520C59.582 520 56 516.418 56 512C56 507.582 59.582 504 64 504C68.418 504 72 507.582 72 512Z" fill="currentColor" /> </g>
    </svg>
  )
}
