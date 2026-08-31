import * as React from "react"

import { Star } from "@/icons"
import { cn } from "@/lib/utils"

import type { NpsEstimateType } from "./nps"

const RATING_LABELS: Record<number, string> = {
  1: "Очень плохо",
  2: "Плохо",
  3: "Нормально",
  4: "Хорошо",
  5: "Отлично",
}

const STARS: NpsEstimateType[] = [1, 2, 3, 4, 5]

/** Пять звёзд и подпись оценки под ними. */
function StarRating({
  value,
  onChange,
}: {
  value: NpsEstimateType | null
  onChange: (value: NpsEstimateType) => void
}) {
  const [hoverValue, setHoverValue] = React.useState<NpsEstimateType | null>(null)
  const displayValue = hoverValue ?? value

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Оценка"
        className="flex items-center justify-center gap-3"
        onMouseLeave={() => setHoverValue(null)}
      >
        {STARS.map((star) => {
          const filled = displayValue !== null && star <= displayValue
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} из 5, ${RATING_LABELS[star]}`}
              onMouseEnter={() => setHoverValue(star)}
              onClick={() => onChange(star)}
              className="cursor-pointer outline-none"
            >
              <Star
                aria-hidden="true"
                filled={filled}
                className={cn(
                  "size-8",
                  filled
                    ? "text-[var(--nps-star-fg)]"
                    : "text-[var(--nps-star-empty-fg)]"
                )}
              />
            </button>
          )
        })}
      </div>

      {/* Дизайн-чек №35: подпись читает выбранное значение, а не наведённое
          — «надпись должна появляться только по факту выбора конкретной
          оценки». Раньше она бежала за курсором по звёздам ещё до выбора.
          Звёзды по наведению подсвечиваться продолжают: это обычная
          обратная связь на ховер, и к ней замечаний не было.

          Дизайн-чек №4 №9: «убрать лишний отступ в 12px под звёздами». В
          пустом состоянии подпись не рендерится вовсе — спрятанный
          placeholder (design-check #42) высоты не давал, но оставлял зазор
          `gap-3` под звёздами, из-за которого карточка была 246px вместо
          232px по макету. Прыжков при наведении это не вернёт: подпись
          зависит от выбранной оценки, а не от ховера. */}
      {value && (
        <p className="text-center text-p1-medium text-[var(--nps-subtitle-fg)]">
          {RATING_LABELS[value]}
        </p>
      )}
    </div>
  )
}

export { RATING_LABELS, StarRating }
