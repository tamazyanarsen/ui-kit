import type { IconProps } from "./types"

export function ChevronUp({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.36848 3.91094C7.76126 3.59028 8.34112 3.61307 8.70735 3.9793L14.3636 9.63653C14.7541 10.0271 14.7541 10.6601 14.3636 11.0506C13.9731 11.4408 13.34 11.4409 12.9495 11.0506L7.99934 6.10039L3.05012 11.0506C2.65965 11.4409 2.02654 11.4409 1.63606 11.0506C1.2456 10.6601 1.24572 10.0271 1.63606 9.63653L7.29329 3.9793L7.36848 3.91094Z"
        fill="currentColor"
      />
    </svg>
  )
}
