import type { IconProps } from "./types"

// Figma's `icon / clock` (node I40656:66204;1568:931, the pending-signature
// row in ELK / event): a clock face with hands, 14.2222×14.2222 centred in
// the 16px box. What lived here before was an *hourglass* — a leftover from
// the lucide passthrough era, not this design system's glyph, so Event's
// "awaiting signature" row was showing the wrong symbol entirely.
export function Clock({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(0.889 0.889)" fill="currentColor">
        <path d="M7.11111 2.58586C7.46814 2.58586 7.75758 2.87529 7.75758 3.23232V6.84334L9.50762 8.59339C9.76009 8.84585 9.76009 9.25516 9.50762 9.50762C9.25516 9.76009 8.84585 9.76009 8.59339 9.50762L6.65399 7.56823C6.53276 7.44699 6.46465 7.28256 6.46465 7.11111V3.23232C6.46465 2.87529 6.75408 2.58586 7.11111 2.58586Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.11111 14.2222C3.18375 14.2222 0 11.0385 0 7.11111C0 3.18375 3.18375 0 7.11111 0C11.0385 0 14.2222 3.18375 14.2222 7.11111C14.2222 11.0385 11.0385 14.2222 7.11111 14.2222ZM7.11111 12.9293C10.3244 12.9293 12.9293 10.3244 12.9293 7.11111C12.9293 3.89782 10.3244 1.29293 7.11111 1.29293C3.89782 1.29293 1.29293 3.89782 1.29293 7.11111C1.29293 10.3244 3.89782 12.9293 7.11111 12.9293Z"
        />
      </g>
    </svg>
  )
}
