import * as React from "react"
import { Information } from "@/icons"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/ui/tooltip"

interface InputCaptionProps {
  id?: string
  /** Подпись — текст ошибки или комментарий (см. `resolveCaption`). */
  children: React.ReactNode
  /** Подпись — ошибка: красит текст и сдвигает зазор ряда. */
  error?: boolean
  /** Comment & Icon / Error Input & Icon: значок «i» в правом краю ряда. */
  showIcon?: boolean
  /** Текст подсказки по значку; без него значок декоративный. */
  hint?: React.ReactNode
}

/**
 * Строка подписи под полем: текст на всю ширину и, по желанию, значок «i»
 * 16×16, прижатый вправо. Ряд в макете — `flex`, `px-[16px]`, а зазор между
 * текстом и значком у Comment (ELK) 8px, у Error (ELK) 4px.
 *
 * Значок в обоих вариантах серый (#999, как подпись Comment): в Error Input &
 * Icon текст красный, а значок остаётся серым — цвет значка не следует за
 * текстом. Как и у Textarea, значок с `hint` раскрывает подсказку по клику.
 */
function InputCaption({ id, children, error, showIcon, hint }: InputCaptionProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start px-4",
        error ? "gap-1" : "gap-2"
      )}
    >
      <p
        id={id}
        className={cn(
          // `break-words`: неразрывное слово (номер договора, имя файла)
          // переносится внутри подписи, а не выходит за поле (аудит 18).
          "min-w-0 flex-1 text-p3-medium break-words",
          error
            ? "text-[var(--input-caption-error-fg)]"
            : "text-[var(--input-caption-fg)]"
        )}
      >
        {children}
      </p>
      {showIcon &&
        (hint ? (
          <Hint content={hint} direction="down-center">
            <button
              type="button"
              aria-label="Дополнительная информация"
              className="shrink-0 text-[var(--input-caption-fg)] outline-none focus-visible:focus-ring"
            >
              <Information aria-hidden="true" className="size-4" />
            </button>
          </Hint>
        ) : (
          <Information
            aria-hidden="true"
            className="size-4 shrink-0 text-[var(--input-caption-fg)]"
          />
        ))}
    </div>
  )
}

export { InputCaption }
export type { InputCaptionProps }
