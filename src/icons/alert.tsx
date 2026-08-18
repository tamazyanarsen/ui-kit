import type { IconProps } from "./types"

// icon / alert — 04. Errors Allert Info, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Alert({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="156.000 116.000 24.000 24.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><clipPath id="alert-24-clip0_70326_26"> <rect width="24" height="24" fill="white" transform="translate(156 116)" /> </clipPath></defs><g clipPath="url(#alert-24-clip0_70326_26)"> <g> <path fillRule="evenodd" clipRule="evenodd" d="M168 118C162.477 118 158 122.477 158 128C158 133.523 162.477 138 168 138C173.523 138 178 133.523 178 128C178 122.477 173.523 118 168 118ZM156 128C156 121.373 161.373 116 168 116C174.627 116 180 121.373 180 128C180 134.627 174.627 140 168 140C161.373 140 156 134.627 156 128Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M168 121C168.552 121 169 121.448 169 122V130C169 130.552 168.552 131 168 131C167.448 131 167 130.552 167 130V122C167 121.448 167.448 121 168 121Z" fill="currentColor" /> <path d="M169 134C169 134.552 168.552 135 168 135C167.448 135 167 134.552 167 134C167 133.448 167.448 133 168 133C168.552 133 169 133.448 169 134Z" fill="currentColor" /> </g> </g>
      </svg>
    )
  }

  return (
    <svg viewBox="60.000 120.000 16.000 16.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs><clipPath id="alert-16-clip1_70326_26"> <rect width="16" height="16" fill="white" transform="translate(60 120)" /> </clipPath></defs><g clipPath="url(#alert-16-clip1_70326_26)"> <g> <path d="M74 128C74 124.686 71.314 122 68 122C64.686 122 62 124.686 62 128C62 131.314 64.686 134 68 134C71.314 134 74 131.314 74 128ZM67 128V125C67 124.448 67.448 124 68 124C68.552 124 69 124.448 69 125V128C69 128.552 68.552 129 68 129C67.448 129 67 128.552 67 128ZM76 128C76 132.418 72.418 136 68 136C63.582 136 60 132.418 60 128C60 123.582 63.582 120 68 120C72.418 120 76 123.582 76 128Z" fill="currentColor" /> <path d="M69 131C69 131.552 68.552 132 68 132C67.448 132 67 131.552 67 131C67 130.448 67.448 130 68 130C68.552 130 69 130.448 69 131Z" fill="currentColor" /> </g> </g>
    </svg>
  )
}
