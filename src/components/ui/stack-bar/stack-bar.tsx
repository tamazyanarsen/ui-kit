import * as React from "react"

import { cn } from "@/lib/utils"
import { chartColor, isDrawable, type ChartDatum } from "@/components/ui/donut/chart-palette"

// StackBar — горизонтальная диаграмма-полоса: состав целого по частям.
// Правки UI-Kit от 25.10, пункт «Полоса (stack bar)» — завести рядом с
// кольцом (Donut) с тем же форматом данных `{ name, value, color }`.
//
//   • над полосой строка: подпись слева, итог справа, P1; на десктопе оба
//     Grey 1514 в одну строку, в мобильном виде итог под подписью, подпись
//     Grey 284; до полосы 16;
//   • полоса 16 во всю ширину, сегменты по значениям в порядке данных,
//     зазор 3, у каждого сегмента скругление 4, общего скругления у полосы
//     нет; нулевые не рисуются, минимальная ширина сегмента 4.
//     Ширины — флексом: `flex-grow` = значение при `flex-basis: 0` делит
//     ширину ЗА ВЫЧЕТОМ зазоров пропорционально значениям;
//   • при появлении и при смене данных полоса монтируется заново (по ключу
//     данных) и разворачивается слева направо ЦЕЛИКОМ: ширина заливки
//     0 → 100 %, сегменты всё время делят её в своих долях, зазоры 3
//     постоянные, у самого начала лишнее обрезается; 1000 мс
//     `cubic-bezier(0.65, 0, 0.35, 1)` (cubicInOut, как перестроение кольца
//     ECharts в эталоне). Решение от 25.10 из «Механик главной» — оно
//     позже пункта правок кита, где каждый сегмент рос отдельно с шагом
//     90 мс (это пробовали и заменили). `prefers-reduced-motion` — без
//     движения (ключевые кадры — src/styles/rules-content.css);
//   • `role="img"`, `aria-label` «подпись: итог»;
//   • цвета по умолчанию — палитра графиков (как у Donut).

interface StackBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  data: ChartDatum[]
  /** Подпись слева над полосой («Портфель»). */
  label?: React.ReactNode
  /** Итог справа над полосой — по смыслу сумма частей. */
  total?: React.ReactNode
  /** Анимация роста. `false` — полоса сразу целиком. */
  animated?: boolean
}

const StackBar = React.forwardRef<HTMLDivElement, StackBarProps>(function StackBar(
  {
    data,
    label,
    total,
    animated = true,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const parts = data
    .map((datum, index) => ({ datum, index }))
    .filter(({ datum }) => isDrawable(datum.value))
  // Ключ данных: смена состава, значений или цветов перезапускает рост.
  const dataKey = parts
    .map(({ datum, index }) => `${datum.name}:${datum.value}:${chartColor(datum, index)}`)
    .join("|")
  const autoLabel =
    isText(label) && isText(total) ? `${label}: ${total}` : isText(label) ? String(label) : undefined
  const hasHead = label != null || total != null

  return (
    <div
      ref={ref}
      data-slot="stack-bar"
      role="img"
      aria-label={ariaLabel ?? autoLabel}
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      {hasHead && (
        <div
          data-slot="stack-bar-head"
          aria-hidden="true"
          className="flex flex-col text-p1-medium-adaptive desktop:flex-row desktop:items-baseline desktop:justify-between desktop:gap-4"
        >
          {label != null && (
            <span className="min-w-0 text-[var(--chart-label-fg)] [overflow-wrap:anywhere] desktop:text-[var(--chart-value-fg)]">
              {label}
            </span>
          )}
          {total != null && (
            <span className="shrink-0 text-[var(--chart-value-fg)] desktop:text-right">
              {total}
            </span>
          )}
        </div>
      )}
      <div
        key={dataKey}
        data-slot="stack-bar-track"
        data-animated={animated || undefined}
        aria-hidden="true"
        className="h-4 w-full overflow-hidden"
      >
        <div data-slot="stack-bar-fill" className="flex h-full w-full gap-[3px]">
        {parts.map(({ datum, index }) => (
          <span
            key={`${datum.name}-${index}`}
            data-slot="stack-bar-segment"
            data-name={datum.name}
            className="h-full min-w-1 basis-0 rounded-[4px]"
            style={
              {
                flexGrow: datum.value,
                backgroundColor: chartColor(datum, index),
              } as React.CSSProperties
            }
          />
        ))}
        </div>
      </div>
    </div>
  )
})

function isText(node: React.ReactNode): node is string | number {
  return typeof node === "string" || typeof node === "number"
}

export { StackBar }
export type { StackBarProps }
