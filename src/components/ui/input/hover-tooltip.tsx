import * as React from "react"

import { useIsDesktop } from "@/lib/use-is-desktop"
import { Tooltip } from "@/components/ui/tooltip"

// Figma's Input canvas (666:12) documents two hover-Tooltip behaviours for
// the field, both rendered through the kit's real `ELK / tooltip & hint`
// component rather than a native `title`:
//   * a Lock Input explains *why* it can't be edited ("При наведении
//     отображается Tooltip с информацией о причине невозможности
//     редактирования поля") — the reason comes in via `lockedHint`;
//   * a value too long for the box is shown in full ("Если текст в поле не
//     помещается по длине, его можно увидеть полностью во всплывающей
//     подсказке (Tooltip) при наведении курсора мыши"), explicitly marked
//     "только для Desktop", hence the desktop check.

/**
 * Значение, не поместившееся в поле, — или `null`, пока оно помещается.
 *
 * `valueKey` — любая строка, которая меняется вместе со значением поля:
 * замер нужно повторять после каждой его смены снаружи.
 */
function useOverflowValue(
  inputRef: React.RefObject<HTMLInputElement | null>,
  valueKey: string
) {
  const [overflowValue, setOverflowValue] = React.useState<string | null>(null)

  React.useEffect(() => {
    const el = inputRef.current
    if (!el) return
    const check = () => {
      // +1px guard: sub-pixel text metrics make scrollWidth exceed
      // clientWidth by a fraction on values that actually fit.
      setOverflowValue(el.scrollWidth > el.clientWidth + 1 ? el.value : null)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    // The deps below only cover controlled/masked fields; an uncontrolled
    // input changes its value without re-rendering, so the element's own
    // input event is what keeps the check honest while typing.
    el.addEventListener("input", check)
    return () => {
      observer.disconnect()
      el.removeEventListener("input", check)
    }
  }, [inputRef, valueKey])

  return overflowValue
}

/** Что показать при наведении: причину блокировки или полное значение. */
function useHoverTooltip({
  inputRef,
  locked,
  lockedHint,
  valueKey,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  locked: boolean
  lockedHint?: React.ReactNode
  valueKey: string
}) {
  const overflowValue = useOverflowValue(inputRef, valueKey)
  const isDesktop = useIsDesktop()

  if (locked) return lockedHint
  return isDesktop && overflowValue ? overflowValue : null
}

/**
 * Всегда оборачивает бокс поля настоящим `Tooltip` кита и просто держит его
 * закрытым, когда объяснять нечего: условный рендер самой обёртки
 * перемонтировал бы бокс (и `<input>` внутри) ровно в тот момент, когда
 * значение переросло ширину, — фокус и каретка терялись бы посреди набора.
 *
 * "top-center" = стрелка вверх / пузырь под полем, как у подсказок,
 * привязанных под полями на канвасе Input (47463:17131).
 */
function FieldTooltip({
  content,
  children,
}: {
  content: React.ReactNode
  children: React.ReactElement
}) {
  return (
    <Tooltip content={content ?? ""} direction="top-center" disabled={!content}>
      {children}
    </Tooltip>
  )
}

export { FieldTooltip, useHoverTooltip }
