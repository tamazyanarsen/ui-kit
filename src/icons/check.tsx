import type { IconProps } from "./types"

export function Check({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.9717 3.28723C13.3654 2.90002 13.9984 2.90532 14.3857 3.29895C14.7729 3.69264 14.7676 4.32573 14.374 4.71301L7.03027 11.9396C6.64206 12.3213 6.01934 12.322 5.62988 11.9415L2.30078 8.68762C1.90586 8.30158 1.89914 7.6685 2.28516 7.27356C2.6712 6.87863 3.30428 6.87093 3.69922 7.25696L6.32617 9.82532L12.9717 3.28723Z"
        fill="currentColor"
      />
    </svg>
  )
}
