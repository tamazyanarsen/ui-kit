import * as React from "react"
import { IMaskInput } from "react-imask"

import { cn } from "@/lib/utils"
import { GROUP_SPACES } from "@/lib/number-format"
import { useCopyWithoutSeparators } from "@/lib/use-copy-without-separators"

import {
  clampToRange,
  formatRangeValue,
  parseRangeValue,
  type RangeValueSpec,
} from "./value-mask"

/**
 * Значение Range Input — настоящее поле ввода, а не надпись.
 *
 * Дизайн-чек 08.10, замечание 31: «не работает клик по тексту в поле и
 * попытка ввода с клавиатуры… должен быть доступен ввод с клавиатуры с
 * изменением положения ползунка в реальном времени по мере ввода символов».
 * В документации (1246:180624) у состояния Focused в поле стоит каретка.
 *
 * Как это устроено:
 *   • пока поле в фокусе, в нём ЧЕРНОВИК — ровно то, что набрал человек;
 *     значение снаружи его не перебивает (иначе «5» при минимуме 50 000
 *     сразу превращалось бы в «50 000» под пальцами);
 *   • каждый символ сразу двигает ползунок: `onType` получает число,
 *     ограниченное диапазоном (но ещё не привязанное к шагу);
 *   • уход из поля и Enter фиксируют значение: диапазон + шаг, и черновик
 *     сменяется отформатированным значением; Esc — откат.
 *
 * Ширина поля — по тексту (невидимый двойник в той же сетке), чтобы знак
 * единицы стоял сразу за числом, как у суммы в Input.
 */
interface RangeValueFieldProps {
  value: number
  min: number
  max: number
  step?: number
  spec: RangeValueSpec
  disabled?: boolean
  describedBy?: string
  inputRef?: React.Ref<HTMLInputElement>
  /** Набрано число — ползунок едет вслед (в пределах диапазона). */
  onType: (value: number, event: Event) => void
  /** Ввод зафиксирован: в диапазоне и по шагу. */
  onCommit: (value: number, event: Event) => void
}

function RangeValueField({
  value,
  min,
  max,
  step,
  spec,
  disabled,
  describedBy,
  inputRef,
  onType,
  onCommit,
}: RangeValueFieldProps) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const formatted = formatRangeValue(spec, value)
  const text = draft ?? formatted
  const copyWithoutSeparators = useCopyWithoutSeparators(GROUP_SPACES)

  function commit(event: Event) {
    const typed = draft === null ? null : parseRangeValue(draft)
    setDraft(null)
    if (typed === null) return
    onCommit(clampToRange(typed, min, max, step), event)
  }

  return (
    <div
      data-slot="range-input-value"
      className={cn(
        "flex min-w-0 items-baseline",
        "text-p2-medium text-[var(--range-input-value-fg)] desktop:text-p1-medium",
        disabled && "!text-[var(--range-input-value-fg-disabled)]"
      )}
    >
      <span className="inline-grid min-w-0">
        {/* Двойник задаёт ширину сетке, поле растягивается ровно по ней:
            `w-0 min-w-full` снимает собственную ширину `<input>` (size=20),
            иначе знак единицы отъезжал на ~20 символов вправо. */}
        <span
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 overflow-hidden whitespace-pre"
        >
          {text || " "}
        </span>
        <IMaskInput
          {...(spec.imask as object)}
          inputRef={inputRef}
          value={text}
          // Черновик пишется только из набора: `onAccept` зовётся и на
          // смену `value` снаружи — тогда поле не в фокусе и черновика нет.
          onAccept={(next: string, _mask: unknown, event?: InputEvent) => {
            if (!event) return
            setDraft(next)
            const typed = parseRangeValue(next)
            if (typed !== null) onType(clampToRange(typed, min, max), event)
          }}
          onFocus={() => setDraft(formatted)}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => commit(event.nativeEvent)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") commit(event.nativeEvent)
            if (event.key === "Escape" && draft !== null) {
              event.stopPropagation()
              setDraft(formatted)
            }
          }}
          {...copyWithoutSeparators}
          type="text"
          inputMode={spec.scale > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          disabled={disabled}
          aria-describedby={describedBy}
          data-slot="range-input-value-field"
          className={cn(
            "col-start-1 row-start-1 w-0 min-w-full bg-transparent p-0 outline-none",
            "text-inherit [font:inherit] disabled:cursor-not-allowed"
          )}
        />
      </span>
      {spec.suffix && (
        <span aria-hidden="true" className="shrink-0 whitespace-pre">
          {spec.suffix}
        </span>
      )}
    </div>
  )
}

export { RangeValueField }
