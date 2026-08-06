import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BadgeColor } from "@/components/ui/badge"

// Count Button — "Кнопка с индикатором уведомлений": any Button (anatomy
// and states are the same as Button's own, per ui/button-count/count
// button.png) with a small counter badge pinned to its top-right corner.
// Badge already implements the exact display rule from that spec
// ("от 1 до 99 — без изменений, от 100 и более — 99+") and the 16px
// counter height, so this is just the two composed rather than a new
// visual system. Per spec: only one Count Button per button group.
interface CountButtonProps extends ButtonProps {
  count: number
  /** Badge color. Red is the master's own (`ELK / count button`); Table Top's
   * "Ещё фильтры" instance overrides it to `black`, so it is a prop rather
   * than a constant. */
  countColor?: BadgeColor
}

function CountButton({
  count,
  countColor = "red",
  className,
  ...props
}: CountButtonProps) {
  return (
    <span className="relative inline-flex">
      <Button className={className} {...props} />
      {/* The badge overhangs the button by 4px on each side (Figma's
          `right-[-4px] top-[-4px]`), not 8. */}
      <Badge
        type="counter"
        value={count}
        color={countColor}
        className="absolute -top-1 -right-1"
      />
    </span>
  )
}

export { CountButton }
export type { CountButtonProps }
