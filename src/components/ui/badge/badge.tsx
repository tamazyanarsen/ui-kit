import { cn } from "@/lib/utils"

import {
  BADGE_COLORS,
  disabledBadgeStyle,
  formatBadgeCount,
  type BadgeColor,
  type BadgeType,
} from "./variants"

// Badge — «Счётчик»: маленький индикатор статуса или количества, который
// ставится вместо чипа, когда того требует случай. `type="counter"`
// показывает число (от 1 до 99 как есть, от 100 — как «99+»),
// `type="point"` — просто залитый кружок без текста. Минимальный размер
// зафиксирован в 16px и вырастает в таблетку, только когда тексту счётчика
// нужно больше места: меньше круга он не сжимается никогда.
interface BadgeProps {
  type?: BadgeType
  color?: BadgeColor
  value?: number
  disabled?: boolean
  className?: string
}

function Badge({
  type = "counter",
  color = "red",
  value = 0,
  disabled = false,
  className,
}: BadgeProps) {
  const style = disabled ? disabledBadgeStyle(color) : BADGE_COLORS[color]

  // «Point» — это точка 8px по центру той же коробки нажатия 16px, что и у
  // Counter. Подтверждено по мастеру («ELK / badge»): внешний контейнер —
  // это якорь фиксированного размера size-[16px] (чтобы Point и Counter
  // вставали одинаково, где бы значок ни был размещён, например приколот к
  // углу иконки), а видимый кружок Point — отдельный внутренний элемент
  // size-[8px], а не вся коробка 16px. Прежний проход заливал у Point всю
  // коробку 16px и рисовал точку вдвое большего диаметра, чем в макете;
  // поймано сверкой литерального JSX мастера со скриншотом, где точки Point
  // заметно вдвое меньше таблеток Counter.
  if (type === "point") {
    return (
      <span
        data-slot="badge"
        data-type={type}
        data-color={color}
        className={cn("inline-flex size-4 items-center justify-center", className)}
      >
        {/* Contra-Red в мастере: красный круг диаметром 8px и поверх него
            белое кольцо 1px СНАРУЖИ (окружность r=4.5 с обводкой по краю), то
            есть весь значок 10px. Поэтому коробка с рамкой border-box здесь
            10px, а не 8px: иначе красный круг сжимался до 6px. */}
        <span
          className={cn(
            "shrink-0 rounded-full",
            style.border ? "size-2.5" : "size-2"
          )}
          style={{
            backgroundColor: style.bg,
            border: style.border ? `1px solid ${style.border}` : undefined,
          }}
        />
      </span>
    )
  }

  return (
    <span
      data-slot="badge"
      data-type={type}
      data-color={color}
      className={cn(
        // `px-[2px] pt-[2px]`, а не `px-1` с центрированием: счётчик в
        // мастере (`ELK / badge`) отступает по 2px с боков и опускает свою
        // текстовую коробку высотой 14px на 2px от верха. Это и делает
        // двузначные счётчики на 4px уже, чем при отступе 4px, и опускает
        // цифры на 1px ниже геометрического центра (читаются они при этом
        // как центрированные, потому что у цифр нет выносных элементов
        // вниз).
        "inline-flex h-4 min-w-4 max-w-[33px] items-center justify-center rounded-full px-[2px] pt-[2px] text-p3-medium",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        // Белая обводка Contra-Red лежит внутри коробки и на размер не
        // влияет (в мастере 16px при любой обводке), поэтому тенью, а не
        // `border`: рамка раздвигала двузначные счётчики на 2px.
        boxShadow: style.border ? `inset 0 0 0 1px ${style.border}` : undefined,
      }}
    >
      {formatBadgeCount(value)}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
