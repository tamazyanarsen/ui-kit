import * as React from "react"

import { Check, ChevronRight, ChevronUp, Info } from "@/icons"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip } from "@/components/ui/tooltip"

// Области нажатия у правых элементов (по разделу макета «Активные
// области»): у Navigation, Accordion (Select), Check, Text и None
// отдельной области НЕТ — целью клика служит вся строка. А у Information,
// Toggle и Checkbox собственная изолированная область ЕСТЬ, и они не
// должны заодно вызывать onClick строки, поэтому эти три идут через
// `IsolatedControl` (тот же приём, что и у вложенных Button и Checkbox в
// AccordionListItem).

type RightElementType =
  | "none"
  | "navigation"
  | "information"
  | "select"
  | "check"
  | "text"
  | "toggle"
  | "checkbox"

interface RightElementProps {
  type: RightElementType
  disabled?: boolean
  /** Панель, которую раскрывает строка, сейчас открыта (тип `select`). */
  open?: boolean
  informationText?: React.ReactNode
  rightText?: React.ReactNode
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  checkboxChecked?: boolean
  onCheckboxChange?: (checked: boolean) => void
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

/** Собственная зона нажатия — щелчок по ней не проваливается в строку. */
function IsolatedControl({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn("flex shrink-0 items-center", className)}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
    >
      {children}
    </span>
  )
}

function RightElement({
  type,
  disabled,
  open = false,
  informationText,
  rightText,
  toggleChecked,
  onToggleChange,
  checkboxChecked,
  onCheckboxChange,
}: RightElementProps) {
  // Второй проход: у выключенного ассета «icon / arrow next chevron» на
  // мастере «ELK / item» своя собственная заливка (#C8C8CB, та же, что у
  // --item-value-fg-disabled), а не приглушённый прозрачностью #999999 из
  // умолчания. Это совпадает с той же схемой «литеральная перекраска, а не
  // затухание прозрачностью», которая уже применена к тексту значения и
  // комментария чуть выше.
  const iconColorClass = disabled
    ? "text-[var(--item-value-fg-disabled)]"
    : "text-[var(--item-icon-fg)]"

  switch (type) {
    case "navigation":
      return (
        <ChevronRight
          aria-hidden="true"
          className={cn("size-4 shrink-0", iconColorClass)}
        />
      )

    case "select":
      return (
        // Свёрнуто — вниз, развёрнуто — вверх: сквозное правило кита. Знать
        // о раскрытии строка обязана сама (проп `open`), иначе шеврон
        // «не переворачивается» — и это не проблема CSS.
        //
        // ⚠️ `navigation` выше остаётся шевроном ВБОК намеренно: это переход
        // на карточку, а не разворачивание, и правило про вверх/вниз к нему
        // не относится.
        <ChevronUp
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 transition-transform duration-150 ease-out",
            !open && "rotate-180",
            iconColorClass
          )}
        />
      )

    case "check":
      return (
        <Check
          aria-hidden="true"
          className="size-4 shrink-0 text-[var(--item-check-fg)]"
          strokeWidth={2.5}
        />
      )

    case "text":
      return (
        // Мобильная форма — ступенью ниже, как и весь текст строки
        // (дизайн-чек от 13.09, замечание 4).
        <span className="max-w-[70%] min-w-0 text-right text-p2-medium [overflow-wrap:anywhere] text-[var(--item-right-text-fg)] desktop:text-p1-medium">
          {rightText}
        </span>
      )

    case "information":
      return (
        <IsolatedControl className="justify-center">
          <Tooltip content={informationText}>
            <button
              type="button"
              disabled={disabled}
              aria-label="Информация"
              className={cn(
                // «активная область иконки справа 16х44 px» — достаточно
                // высокая, чтобы попадать удобно, но шириной ровно со
                // значок, чтобы не съедать 28px у правого края строки.
                "flex h-11 w-4 shrink-0 items-center justify-center outline-none focus-visible:focus-ring",
                iconColorClass
              )}
            >
              <Info aria-hidden="true" className="size-4" />
            </button>
          </Tooltip>
        </IsolatedControl>
      )

    case "toggle":
      return (
        <IsolatedControl>
          <Toggle
            checked={toggleChecked}
            onCheckedChange={onToggleChange}
            disabled={disabled}
            aria-label="Переключить"
          />
        </IsolatedControl>
      )

    case "checkbox":
      return (
        <IsolatedControl>
          <Checkbox
            checked={checkboxChecked}
            onCheckedChange={onCheckboxChange}
            disabled={disabled}
            aria-label="Выбрать"
          />
        </IsolatedControl>
      )

    case "none":
    default:
      return null
  }
}

export { RightElement }
export type { RightElementProps, RightElementType }
