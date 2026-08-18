import type { IconProps } from "./types"

// icon / plus circle, add — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function PlusCircleAdd({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="160.000 372.000 24.000 24.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><clipPath id="plus-circle-add-24-clip0_70326_26"> <rect width="24" height="24" fill="white" transform="translate(160 372)" /> </clipPath></defs><g clipPath="url(#plus-circle-add-24-clip0_70326_26)"> <path fillRule="evenodd" clipRule="evenodd" d="M172 374C166.477 374 162 378.477 162 384C162 389.523 166.477 394 172 394C177.523 394 182 389.523 182 384C182 378.477 177.523 374 172 374ZM160 384C160 377.373 165.373 372 172 372C178.627 372 184 377.373 184 384C184 390.627 178.627 396 172 396C165.373 396 160 390.627 160 384ZM172 378.286C172.552 378.286 173 378.733 173 379.286V383H176.714C177.267 383 177.714 383.448 177.714 384C177.714 384.552 177.267 385 176.714 385H173V388.714C173 389.267 172.552 389.714 172 389.714C171.448 389.714 171 389.267 171 388.714V385H167.286C166.733 385 166.286 384.552 166.286 384C166.286 383.448 166.733 383 167.286 383H171V379.286C171 378.733 171.448 378.286 172 378.286Z" fill="currentColor" /> </g>
      </svg>
    )
  }

  return (
    <svg viewBox="56.000 376.000 16.000 16.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs><clipPath id="plus-circle-add-16-clip1_70326_26"> <rect width="16" height="16" fill="white" transform="translate(56 376)" /> </clipPath></defs><g clipPath="url(#plus-circle-add-16-clip1_70326_26)"> <path d="M70 384C70 380.686 67.314 378 64 378C60.686 378 58 380.686 58 384C58 387.314 60.686 390 64 390C67.314 390 70 387.314 70 384ZM63 387V385H61C60.448 385 60 384.552 60 384C60 383.448 60.448 383 61 383H63V381C63 380.448 63.448 380 64 380C64.552 380 65 380.448 65 381V383H67C67.552 383 68 383.448 68 384C68 384.552 67.552 385 67 385H65V387C65 387.552 64.552 388 64 388C63.448 388 63 387.552 63 387ZM72 384C72 388.418 68.418 392 64 392C59.582 392 56 388.418 56 384C56 379.582 59.582 376 64 376C68.418 376 72 379.582 72 384Z" fill="currentColor" /> </g>
    </svg>
  )
}
