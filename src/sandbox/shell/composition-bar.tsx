import { THEME_COLORS } from "../charts"

// Полоса состава с легендой — `Chart Bar (ELK)`.
//
// Намеренно НЕ echarts: у полосы нет ни осей, ни масштаба, ни подсказок —
// это доли одной суммы. Канвас-рендерер отдал бы растровую полосу, а её
// кромки обязаны совпадать с сеткой блока и переживать смену темы. Цвета
// берём из темы графиков, чтобы полоса и настоящие графики соседних экранов
// говорили одним языком.

interface CompositionSegment {
  label: React.ReactNode
  value: number
  /** Цвет доли. По умолчанию — по порядку из палитры графиков. */
  color?: string
}

const DEFAULT_COLORS = [
  THEME_COLORS.blue,
  THEME_COLORS.lavender,
  THEME_COLORS.grey,
  THEME_COLORS.mint,
  THEME_COLORS.yellow,
]

interface SandboxCompositionBarProps {
  segments: CompositionSegment[]
  className?: string
}

function SandboxCompositionBar({
  segments,
  className,
}: SandboxCompositionBarProps) {
  const visible = segments.filter((segment) => segment.value > 0)
  const total = visible.reduce((sum, segment) => sum + segment.value, 0)

  if (total <= 0) return null

  return (
    <div className={className}>
      <div className="flex w-full flex-col gap-4">
        {/* Углы прямые — дизайн-чек от 08.09, замечание 14 («убрать
            скругления у чартов»). В целёвке `Horizontal Bars Stacked`
            (нода 63703:18971) полоса нарисована без скруглений вообще,
            включая внешние концы; здесь стояло `rounded-full`. */}
        <div className="flex h-4 w-full overflow-hidden">
          {visible.map((segment, index) => (
            <div
              key={index}
              style={{
                width: `${(segment.value / total) * 100}%`,
                backgroundColor:
                  segment.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
              }}
            />
          ))}
        </div>

        {/* Легенда — `Legend Element (ELK)` (нода 63582:16040): маркер 16×4
            со скруглением 1, зазор 6, подпись P2 Medium цветом Grey 1514,
            шаг между элементами 16. Дизайн-чек от 08.09, замечание 17:
            «Неверный размер и начертание элемента легенды» — здесь стояла
            круглая точка 8px и подпись P3 серым. */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-p2-medium text-[var(--grey-1514)]">
          {visible.map((segment, index) => (
            <span
              key={index}
              className="flex min-h-8 items-center gap-1.5 py-1"
            >
              <span
                aria-hidden="true"
                className="h-1 w-4 shrink-0 rounded-[1px]"
                style={{
                  backgroundColor:
                    segment.color ??
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                }}
              />
              {segment.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export { SandboxCompositionBar }
export type { CompositionSegment, SandboxCompositionBarProps }
