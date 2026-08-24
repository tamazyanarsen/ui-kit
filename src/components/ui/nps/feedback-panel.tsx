import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FilterTable } from "@/components/ui/filter-table"
import { Textarea } from "@/components/ui/textarea"

/* Дизайн-чек №3 №16: «Нужна плюс-минус плавная анимация „роста“ окна.
   Сейчас окно растёт рывком… нужно сделать плавное вырастание со стаггерами
   нижних элементов (текстареа, чипсы, кнопка)».

   Нижний блок не монтируется по факту оценки, а всегда есть в разметке и
   раскрывается: grid-строка едет с 0fr до 1fr — это единственный способ
   анимировать высоту «по содержимому», не зная её заранее. Отрицательный
   `-mt-8` в свёрнутом виде гасит зазор родительского `gap-8`, иначе пустая
   строка занимала бы 32px.

   Стаггер сделан переходами с разной задержкой, а не keyframe-анимациями:
   keyframes проигрываются только при монтировании, а блок живёт постоянно. */
const STAGGER_BASE = "transition-all duration-400 ease-out"
const STAGGER_IN = "translate-y-0 opacity-100"
const STAGGER_OUT = "translate-y-2 opacity-0"

/** Общий переход элемента стаггера — своя у каждого только задержка. */
const staggerClass = (open: boolean) =>
  cn(STAGGER_BASE, open ? STAGGER_IN : STAGGER_OUT)

/** Задержка. В свёрнутом виде — нулевая: обратно всё уезжает разом. */
const staggerDelay = (open: boolean, delayMs: number) => ({
  transitionDelay: open ? `${delayMs}ms` : "0ms",
})

interface FeedbackPanelProps {
  /** Раскрыта ли панель — то есть выставлена ли оценка. */
  open: boolean
  showDescription: boolean
  showChips: boolean
  chips: string[]
  /** Выбранный чип или `null`, если текст в поле с ним разошёлся. */
  activeChip: string | null
  onChipSelect: (chip: string) => void
  comment: string
  onCommentChange: (comment: string) => void
  onSubmit: () => void
}

function FeedbackPanel({
  open,
  showDescription,
  showChips,
  chips,
  activeChip,
  onChipSelect,
  comment,
  onCommentChange,
  onSubmit,
}: FeedbackPanelProps) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid w-full transition-all duration-500 ease-out",
        open ? "mt-0 grid-rows-[1fr]" : "-mt-8 grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">
        <div className="flex w-full flex-col items-start gap-8">
          {showDescription && (
            <p
              style={staggerDelay(open, 120)}
              className={cn(
                "w-full text-center text-p1-medium text-[var(--nps-title-fg)]",
                staggerClass(open)
              )}
            >
              Что можно улучшить?
            </p>
          )}

          <div
            style={staggerDelay(open, 200)}
            className={cn("flex w-full flex-col gap-4", staggerClass(open))}
          >
            <Textarea
              label="Комментарий"
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
            />

            {showChips && (
              <div className="flex flex-wrap gap-2">
                {/* Figma builds these from `ELK / filter-table` in its
                    unselected (Checked=False) look — the frame is named
                    "Chips" on the canvas, but the instances inside are
                    filter-table, not `ELK / chips` (node 64534:44873). */}
                {chips.map((chip) => (
                  <FilterTable
                    key={chip}
                    selected={activeChip === chip}
                    // Крестика у выбранного чипа тут нет: выбор снимается
                    // правкой текста в поле, а не кнопкой на самом чипе.
                    showClose={false}
                    aria-pressed={activeChip === chip}
                    onClick={() => onChipSelect(chip)}
                  >
                    {chip}
                  </FilterTable>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            style={staggerDelay(open, 280)}
            className={cn("w-full", staggerClass(open))}
            onClick={onSubmit}
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FeedbackPanel }
