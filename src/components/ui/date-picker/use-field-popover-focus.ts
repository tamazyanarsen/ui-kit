import * as React from "react"
import { flushSync } from "react-dom"
import type { Popover as PopoverPrimitive } from "@base-ui/react/popover"

/** Почему закрылся календарь — от этого зависит, куда вернуть фокус. */
type CloseReason = "return" | "leave"

/**
 * Фокус между полем DatePicker и его календарём.
 *
 * Триггер поповера — значок календаря в поле (он и даёт Base UI опору для
 * защитных span: Tab с последней кнопки календаря уходит к элементу после
 * пикера, и календарь закрывается). Само поле — обычное текстовое поле:
 * клик по нему открывает календарь, а фокус остаётся в поле, в нём печатают.
 *
 * Правила простые:
 * * открытие с клавиатуры (стрелка вниз) и нажатием на значок уводит фокус
 *   в календарь, клик по полю — нет (`initialFocus`);
 * * фокус в календаре встаёт на день-остановку Tab сетки (`data-roving`,
 *   её выбирает `useDayFocus`: выбранный день или начало диапазона, иначе
 *   сегодня, иначе первый доступный) — и при открытии с клавиатуры или
 *   значком, и по стрелке вниз при УЖЕ открытом календаре. Искать по
 *   `data-selected` нельзя: у диапазона его нет ни у одного дня;
 * * фокус возвращается в поле только после Escape, «Применить» и нажатия
 *   на значок. Закрытие уходом (клик в другое поле, уход фокуса, Tab)
 *   фокус не трогает: человек уже там, куда шёл;
 * * Tab из поля при открытом календаре закрывает его синхронно
 *   (`flushSync`), чтобы защитные span исчезли до того, как браузер
 *   передвинет фокус, — иначе первый Tab попадал на такой span.
 *
 * Поле — обычное текстовое поле, а не часть кнопки-триггера: раньше вся
 * строка была `div role=button tabindex=0` с textbox внутри — лишняя
 * остановка Tab и вложенный интерактив, а клик уводил фокус в календарь, и
 * набирать дату было некуда.
 */
function useFieldPopoverFocus({
  open,
  setOpen,
  disabled,
  single,
  popupRef,
  anchorRef,
  fieldRef,
  onClose,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  disabled?: boolean
  /** Однострочное поле даты — в нём печатают, остальные только для чтения. */
  single: boolean
  popupRef: React.RefObject<HTMLDivElement | null>
  /** Обёртка поля вместе со значком. */
  anchorRef: React.RefObject<HTMLDivElement | null>
  fieldRef: React.RefObject<HTMLInputElement | null>
  /** Конец ввода при закрытии (нормализация текста поля). */
  onClose: () => void
}) {
  const focusCalendarRef = React.useRef(false)
  const closeReasonRef = React.useRef<CloseReason>("leave")
  // Значок-триггер в обходе по Tab, пока календарь открыт (на него опирают
  // защитные span Base UI). Из обхода он выпадает КАДРОМ ПОЗЖЕ закрытия:
  // защитный span сначала закрывает поповер и лишь потом ищет «следующий
  // после триггера» — выпади значок сразу, фокус упал бы на body.
  const [triggerTabbable, setTriggerTabbable] = React.useState(false)
  React.useEffect(() => {
    if (open) {
      setTriggerTabbable(true)
      return
    }
    const frame = requestAnimationFrame(() => setTriggerTabbable(false))
    return () => cancelAnimationFrame(frame)
  }, [open])

  /**
   * День-остановка Tab сетки (`data-roving`). Не по `tabindex`: Base UI, пока
   * фокус вне поповера, переписывает его у всех кнопок внутри на -1. У
   * месяцев и лет сетки дней нет — `null`.
   */
  function rovingDay() {
    return (
      popupRef.current?.querySelector<HTMLElement>(
        '[data-slot="calendar-day"][data-roving]:not(:disabled)'
      ) ?? null
    )
  }

  function focusDayInPopup() {
    const target =
      rovingDay() ?? popupRef.current?.querySelector<HTMLElement>("button:not(:disabled)")
    target?.focus()
  }

  function openPopover(focusCalendar: boolean) {
    focusCalendarRef.current = focusCalendar
    setOpen(true)
  }

  function openFromField(focusCalendar: boolean) {
    if (disabled) return
    if (open) {
      if (focusCalendar) focusDayInPopup()
      return
    }
    openPopover(focusCalendar)
  }

  function close(reason: CloseReason, sync = false) {
    closeReasonRef.current = reason
    onClose()
    if (!sync) {
      setOpen(false)
      return
    }
    // Tab из поля: значок выпадает из обхода в том же коммите, до того как
    // браузер передвинет фокус, — иначе он стал бы лишней остановкой.
    flushSync(() => {
      setOpen(false)
      setTriggerTabbable(false)
    })
  }

  // Уход фокуса в собственный календарь или на значок — не конец ввода:
  // набранное сохраняется до выбора дня, «Применить» или ухода из пикера
  // целиком. Поле не Trigger, поэтому уход из него дальше по странице Base UI
  // сам не заметил бы — календарь закрывается здесь.
  function handleFieldBlur(event: React.FocusEvent<HTMLInputElement>) {
    const next = event.relatedTarget
    const inside = (node: Node) =>
      popupRef.current?.contains(node) || anchorRef.current?.contains(node)
    if (next instanceof Node && inside(next)) return
    if (next instanceof Node && open) close("leave")
    else onClose()
  }

  function handleOpenChange(next: boolean, details: PopoverPrimitive.Root.ChangeEventDetails) {
    if (next) {
      // Нажатие на значок — фокус в календарь, как с клавиатуры.
      openPopover(details.reason === "trigger-press")
      return
    }
    // Нажатие мышью на само поле при открытом календаре — не «нажатие
    // снаружи»: поле не Trigger, и без этой проверки календарь закрывался бы
    // и тут же открывался снова. Только для нажатий: Escape из поля тоже
    // приходит с целью в поле, и его отбрасывать нельзя.
    const target = details.event?.target
    const onField = target instanceof Node && anchorRef.current?.contains(target)
    if (details.reason === "outside-press" && onField) return
    close(details.reason === "escape-key" || details.reason === "trigger-press" ? "return" : "leave")
  }

  const fieldProps = {
    onClick: () => openFromField(false),
    onBlur: handleFieldBlur,
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab" && open) {
        close("leave", true)
        return
      }
      if (event.key === "ArrowDown" || (!single && (event.key === "Enter" || event.key === " "))) {
        event.preventDefault()
        openFromField(true)
      }
    },
    "aria-haspopup": "dialog" as const,
    "aria-expanded": open,
  }

  return {
    fieldProps,
    handleOpenChange,
    /** Закрыть с возвратом фокуса в поле («Применить») или без него. */
    close,
    triggerTabIndex: open || triggerTabbable ? 0 : -1,
    // Однострочное поле после клика остаётся в фокусе — в нём печатают; в
    // календарь фокус уходит при открытии с клавиатуры, значком и у полей
    // только для чтения — на день-остановку сетки (APG «Date Picker
    // Dialog»), а не на первую кнопку шапки. У месяцев и лет сетки дней нет:
    // там фокус по-прежнему на первом доступном элементе (`true`).
    initialFocus: () => {
      if (single && !focusCalendarRef.current) return false
      return rovingDay() ?? true
    },
    finalFocus: () => (closeReasonRef.current === "return" ? fieldRef.current : false),
  }
}

export { useFieldPopoverFocus }
export type { CloseReason }
