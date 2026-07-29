import { cn } from "@/lib/utils"

import { getTagStyle, type TagColor, type TagSize, type TagVariant } from "./variants"

// Tag — "Тег": a small, non-interactive label that marks status changes
// (Green/Orange/Red/Blue/Grey) or generic signs (Black/White/Grey-Info) on
// an object. Per spec it's not clickable and never shows a tooltip on hover.
interface TagProps {
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  showIcon?: boolean
  className?: string
  children: React.ReactNode
}

function Tag({
  color = "green",
  variant = "main",
  size = "l",
  showIcon = false,
  className,
  children,
}: TagProps) {
  const style = getTagStyle(color, variant)

  return (
    <span
      data-slot="tag"
      data-color={color}
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md px-1.5 font-medium whitespace-nowrap",
        size === "l" ? "h-[22px] text-xs" : "h-[18px] text-[11px]",
        style.border && "border",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        borderColor: style.border,
      }}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
      {children}
    </span>
  )
}

export { Tag }
export type { TagProps }
