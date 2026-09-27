import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BadgeColor } from "@/components/ui/badge"

// Count Button — «Кнопка с индикатором уведомлений»: любая Button
// (анатомия и состояния те же, что у самой Button, так сказано в макете) с
// маленьким значком-счётчиком, приколотым к правому верхнему углу. Badge
// уже реализует точно то правило показа, что записано в этом макете («от 1
// до 99 — без изменений, от 100 и более — 99+»), и высоту счётчика 16px,
// поэтому здесь просто композиция двух компонентов, а не новая визуальная
// система. По макету: в одной группе кнопок Count Button может быть только
// одна.
interface CountButtonProps extends ButtonProps {
  /** Значение счётчика. `undefined` — плашки нет вовсе: это свойство
   *  `Show Count = False` мастера `ELK / count button`. */
  count?: number
  /** Цвет значка. Красный — собственный цвет мастера
   * (`ELK / count button`), но инстанс «Ещё фильтры» в Table Top
   * переопределяет его на `black`, поэтому это пропс, а не константа. */
  countColor?: BadgeColor
}

function CountButton({
  count,
  countColor = "red",
  className,
  ...props
}: CountButtonProps) {
  return (
    <span data-slot="count-button" className="relative inline-flex">
      <Button className={className} {...props} />
      {/* Значок свисает за кнопку на 4px с каждой стороны (в макете это
          `right-[-4px] top-[-4px]`), а не на 8. */}
      {count !== undefined && (
        <Badge
          type="counter"
          value={count}
          color={countColor}
          className="absolute -top-1 -right-1"
        />
      )}
    </span>
  )
}

export { CountButton }
export type { CountButtonProps }
