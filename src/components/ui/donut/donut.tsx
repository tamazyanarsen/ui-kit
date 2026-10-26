import * as React from "react"

import { cn } from "@/lib/utils"

import { chartColor, type ChartDatum } from "./chart-palette"
import { DONUT, donutSegments } from "./donut-geometry"

// Donut — кольцевая диаграмма с подписью в центре. Правки UI-Kit от 25.10,
// пункт «Кольцевая диаграмма (бублик)»: штатный образец «Plot Area Component
// (ELK)» — нарисованный макет, а не компонент с данными, поэтому кольцо
// строится из данных и исправляет его недостатки (геометрия — в
// donut-geometry.ts):
//
//   • сегменты пропорциональны значениям, начало сверху, по часовой;
//   • зазор с параллельными краями и скруглённые углы — сегменты читаются
//     отдельно даже у близких цветов (Grey 134 рядом с Lavender 187);
//   • середина ПРОЗРАЧНАЯ — без белого круга, кольцо работает на любом фоне;
//   • нулевые не рисуются, один ненулевой — сплошное кольцо;
//   • смена цвета сегмента — 280 мс `ease`; подсветка выбранного: остальные
//     смешаны с фоном блока (35 % своего цвета), непрозрачно — сквозь них не
//     просвечивает фон;
//   • в центре подпись и значение, пара стилей по размеру кольца: до 300 —
//     подпись P2 Grey 284 и значение P1 Grey 1514 (кольца 200–224 на
//     главной), от 300 — P1 и H2 (штатный образец); в мобильном виде обе
//     ступени — мобильные пары тех же стилей (правило каркаса о мобильной
//     типографике);
//   • `role="img"`, `aria-label` «подпись: значение».

/** Размер, с которого центр рисуется крупной парой P1 + H2. */
const LARGE_SIZE = 300

interface DonutProps extends Omit<React.ComponentProps<"div">, "children"> {
  data: ChartDatum[]
  /** Сторона кольца в px. */
  size?: number
  /** Подпись в центре («Портфель»). */
  label?: React.ReactNode
  /** Значение в центре — по смыслу сумма частей. */
  value?: React.ReactNode
  /**
   * Подсвеченная часть (индекс в `data`). Остальные притушены смешением с
   * фоном. `null`/не задан — подсветки нет.
   */
  activeIndex?: number | null
  /** Фон под кольцом — с ним смешиваются притушенные части. */
  surface?: string
}

const Donut = React.forwardRef<HTMLDivElement, DonutProps>(function Donut(
  {
    data,
    size = 224,
    label,
    value,
    activeIndex = null,
    surface = "var(--chart-surface)",
    className,
    style,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const segments = donutSegments(data.map((datum) => datum.value))
  const large = size >= LARGE_SIZE
  const autoLabel =
    isText(label) && isText(value) ? `${label}: ${value}` : isText(label) ? String(label) : undefined

  return (
    <div
      ref={ref}
      data-slot="donut"
      data-size={large ? "large" : "default"}
      role="img"
      aria-label={ariaLabel ?? autoLabel}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg viewBox="0 0 100 100" className="block size-full overflow-visible" aria-hidden="true">
        {segments.map((segment) => {
          const datum = data[segment.index]
          const base = chartColor(datum, segment.index)
          const dimmed = activeIndex != null && activeIndex !== segment.index
          const color = dimmed ? `color-mix(in srgb, ${base} 35%, ${surface})` : base
          return (
            <path
              key={segment.index}
              data-slot="donut-segment"
              data-name={datum.name}
              data-dimmed={dimmed || undefined}
              d={segment.path}
              fillRule={segment.ring ? "evenodd" : undefined}
              stroke={segment.ring ? "none" : color}
              strokeWidth={segment.ring ? undefined : DONUT.RAD * 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                fill: color,
                transition: "fill var(--duration-release) ease, stroke var(--duration-release) ease",
              }}
            />
          )
        })}
      </svg>
      {(label != null || value != null) && (
        <div
          data-slot="donut-center"
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center text-center [overflow-wrap:anywhere]"
          // Поля по бокам — 40 на кольце 300 (штатный образец), пропорционально
          // на остальных размерах.
          style={{ paddingInline: `${(40 / 300) * 100}%` }}
        >
          {label != null && (
            <span
              data-slot="donut-label"
              className={cn(
                "text-[var(--chart-label-fg)]",
                large
                  ? "text-p1-medium-adaptive"
                  : "text-p2-medium-adaptive"
              )}
            >
              {label}
            </span>
          )}
          {value != null && (
            <span
              data-slot="donut-value"
              className={cn(
                "text-[var(--chart-value-fg)]",
                large
                  ? "text-h2-adaptive"
                  : "text-p1-medium-adaptive"
              )}
            >
              {value}
            </span>
          )}
        </div>
      )}
    </div>
  )
})

function isText(node: React.ReactNode): node is string | number {
  return typeof node === "string" || typeof node === "number"
}

export { Donut }
export type { DonutProps }
