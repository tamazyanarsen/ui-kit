import * as React from "react"
import { Copy } from "@/icons"

import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-message"

import type { FieldType } from "./item-information-field"

// Верхний отступ значка копирования по типам, прямо из кадров «Copy (…,
// ELK)» макета: pt-18 у Label Left (его содержимое и так опущено на 16px,
// то есть собственных 2px), pt-2 у Line, pt-30 у Label Top и pt-33 у
// большого. Сам глиф сохраняет точную коробку 16 или 24px, а область
// нажатия растягивается прозрачным псевдоэлементом — так её увеличение не
// может сдвинуть выравнивание.
// На мобильном все типы укладываются вертикально, поэтому глиф всегда
// оказывается прямо под строкой подписи: на 26px ниже (27 у большого, где
// значок 24px стоит на строке значения высотой 30px) — то же правило «+2px
// ниже верха значения».
const COPY_OFFSET: Record<FieldType, string> = {
  // ⚠️ У «Label Left» и «Line» отступ ОДИН на оба брейкпоинта, и это прямое
  // следствие правки по замечанию 1 (см. разметку ниже): значок переехал
  // внутрь колонки значения, а там его точка отсчёта — верх самого значения,
  // а не верх строки. Мобильные 26 были «20 подписи + 4 зазора + 2» и теперь
  // отсчитывались бы второй раз, уводя значок под вторую строку.
  "label-left": "mt-[2px]",
  "label-line": "mt-[2px]",
  "label-top": "mt-[26px] desktop:mt-[30px]",
  "large-value": "mt-[27px] desktop:mt-[33px]",
}

/**
 * Текст значения, как он нарисован: для `value`, которое не строка (JSX,
 * число с разметкой), без явного `copyValue`. Раньше в этом случае в буфер
 * уходила пустая строка — под тостом «Скопировано».
 */
function readRenderedValue(button: HTMLElement): string {
  const field = button.closest("[data-slot='item-information-field']")
  const value = field?.querySelector("[data-slot='item-information-field-value']")
  return value?.textContent?.trim() ?? ""
}

function CopyButton({
  copyValue,
  type,
}: {
  /** Не задано — копируется видимый текст значения. */
  copyValue?: string
  type: FieldType
}) {
  const toast = useToast()
  const large = type === "large-value"

  // Тост показывается по РЕЗУЛЬТАТУ записи, а не рядом с её вызовом.
  //
  // `writeText` возвращает промис и штатно отклоняется: небезопасный
  // контекст (http), отказ в разрешении, документ не в фокусе. Раньше
  // промис не обрабатывался вовсе — и это давало сразу два дефекта:
  // необработанное отклонение в консоли и тост «Скопировано в буфер
  // обмена» в тот момент, когда не скопировалось ничего. Поймано сплошным
  // прогоном историй: копирование в неактивном кадре отклонялось молча.
  // `behavior: "transient"` — отклик системы, а не сообщение продукта: в
  // центре уведомлений «Скопировано в буфер обмена» не остаётся, поэтому и
  // улетать ему туда не следует (дизайн-чек от 08.09, замечание 15).
  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    try {
      // Вне безопасного контекста `navigator.clipboard` нет вовсе, и
      // `clipboard?.writeText` молча давал `undefined` — то есть «успех».
      if (!navigator.clipboard) throw new Error("Clipboard API недоступен")
      const text = copyValue ?? readRenderedValue(event.currentTarget)
      // Значение — разметка без текста: копировать нечего, и «Скопировано»
      // было бы ложью.
      if (!text) throw new Error("Нечего копировать")
      await navigator.clipboard.writeText(text)
      toast.add({
        type: "checked",
        title: "Скопировано в буфер обмена",
        behavior: "transient",
      })
    } catch {
      toast.add({
        type: "error",
        title: "Не удалось скопировать",
        behavior: "transient",
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Копировать"
      className={cn(
        "relative flex shrink-0 items-center justify-center text-[var(--ifield-copy-fg)] outline-none focus-visible:focus-ring transition-colors before:absolute before:-inset-2 before:content-[''] hover:text-[var(--ifield-copy-fg-hover)]",
        large ? "size-6" : "size-4",
        COPY_OFFSET[type]
      )}
    >
      <Copy aria-hidden="true" className={large ? "size-6" : "size-4"} />
    </button>
  )
}

export { CopyButton }
