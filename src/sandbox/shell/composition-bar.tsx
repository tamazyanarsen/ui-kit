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
        <div className="flex h-4 w-full overflow-hidden rounded-full">
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

        <div className="flex flex-wrap items-center justify-center gap-6 text-p3-regular text-[var(--grey-284)]">
          {visible.map((segment, index) => (
            <span key={index} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
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
