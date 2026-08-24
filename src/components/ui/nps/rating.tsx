import * as React from "react"

import { Star } from "@/icons"
import { cn } from "@/lib/utils"

const RATING_LABELS: Record<number, string> = {
  1: "Очень плохо",
  2: "Плохо",
  3: "Нормально",
  4: "Хорошо",
  5: "Отлично",
}

const STARS = [1, 2, 3, 4, 5]

/** Пять звёзд и подпись оценки под ними. */
function StarRating({
  value,
  onChange,
}: {
  value: number | null
  onChange: (value: number) => void
}) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
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

      {/* Design-check #42: always rendered (with a reserved-space
          placeholder when empty) instead of conditionally mounting — the
          conditional version collapsed to 0 height between hovers, so the
          card kept growing/shrinking as the cursor moved across the stars.

          Дизайн-чек №35: подпись читает выбранное значение, а не наведённое
          — «надпись должна появляться только по факту выбора конкретной
          оценки». Раньше она бежала за курсором по звёздам ещё до выбора.
          Звёзды по наведению подсвечиваться продолжают: это обычная
          обратная связь на ховер, и к ней замечаний не было. */}
      <p
        className={cn(
          "text-center text-p1-medium text-[var(--nps-subtitle-fg)]",
          !value && "invisible"
        )}
      >
        {value ? RATING_LABELS[value] : " "}
      </p>
    </div>
  )
}

export { RATING_LABELS, StarRating }
