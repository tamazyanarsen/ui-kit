import * as React from "react"

import { useIsDesktop } from "@/lib/use-is-desktop"
import { Tooltip } from "@/components/ui/tooltip"

// Канвас Input в макете описывает два поведения подсказки по наведению для
// поля, и оба рисуются настоящим компонентом кита
// `ELK / tooltip & hint`, а не нативным `title`:
//   * заблокированное поле объясняет, *почему* его нельзя править («При
//     наведении отображается Tooltip с информацией о причине невозможности
//     редактирования поля») — причина приходит через `lockedHint`;
//   * значение, не поместившееся в коробку, показывается целиком («Если
//     текст в поле не помещается по длине, его можно увидеть полностью во
//     всплывающей подсказке (Tooltip) при наведении курсора мыши») — с
//     явной пометкой «только для Desktop», отсюда и проверка на десктоп.

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
      // Защита в +1px: субпиксельные метрики текста делают scrollWidth
      // больше clientWidth на доли пикселя даже у значений, которые
      // помещаются.
      setOverflowValue(el.scrollWidth > el.clientWidth + 1 ? el.value : null)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    // Зависимости ниже покрывают только управляемые поля и поля с маской, а
    // неуправляемое поле меняет значение без повторной отрисовки, поэтому
    // честной проверку во время набора держит собственное событие input у
    // элемента.
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
 * привязанных под полями на канвасе Input.
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
