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
  valueKey: string,
  masked: boolean
) {
  const [overflowValue, setOverflowValue] = React.useState<string | null>(null)

  // Защита в +1px: субпиксельные метрики текста делают scrollWidth больше
  // clientWidth на доли пикселя даже у значений, которые помещаются.
  const check = React.useCallback(() => {
    const el = inputRef.current
    if (!el) return
    setOverflowValue(el.scrollWidth > el.clientWidth + 1 ? el.value : null)
  }, [inputRef])

  // Запись `input.value = …` снаружи (react-hook-form: `setValue`, `reset`)
  // не порождает ни события input, ни перерисовки: подсказка показывала
  // прежнее значение у уже очищенного поля, а длинное записанное значение
  // оставалось без подсказки. Поэтому у узла свой сеттер `value`, который
  // повторяет замер. Поле с маской так не оборачивается: его сеттер уже
  // держит use-mask (две обёртки сняли бы друг друга не в том порядке), а
  // чужая запись доходит сюда через `maskValue` в `valueKey`.
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (masked || !input) return
    const own = Object.getOwnPropertyDescriptor(input, "value")
    const native =
      own ?? Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
    if (!native?.get || !native.set) return
    const { get, set } = native
    Object.defineProperty(input, "value", {
      configurable: true,
      get() {
        return get.call(this)
      },
      set(next: string) {
        set.call(this, next)
        check()
      },
    })
    return () => {
      if (own) Object.defineProperty(input, "value", own)
      else delete (input as { value?: string }).value
    }
  }, [inputRef, masked, check])

  // Нативный сброс формы (`form.reset()`, `<button type="reset">`) браузер
  // делает мимо JS-сеттера, а событие `reset` приходит ДО сброса значений —
  // замер повторяется в следующей задаче.
  React.useEffect(() => {
    const form = inputRef.current?.form
    if (!form) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const onReset = () => {
      clearTimeout(timer)
      timer = setTimeout(check)
    }
    form.addEventListener("reset", onReset)
    return () => {
      clearTimeout(timer)
      form.removeEventListener("reset", onReset)
    }
  }, [inputRef, check])

  React.useEffect(() => {
    const el = inputRef.current
    if (!el) return
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
  }, [inputRef, valueKey, check])

  return overflowValue
}

/** Что показать при наведении: причину блокировки или полное значение. */
function useHoverTooltip({
  inputRef,
  locked,
  lockedHint,
  valueKey,
  secret = false,
  masked = false,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  locked: boolean
  lockedHint?: React.ReactNode
  valueKey: string
  /**
   * Значение секретное (поле пароля): полным текстом его не показываем
   * никогда. Иначе длинный пароль, не влезший в коробку, всплывал бы
   * открытым текстом в подсказке при наведении — ровно то, что прячут точки.
   */
  secret?: boolean
  /** У поля маска: чужую запись значения ловит use-mask, а не этот хук. */
  masked?: boolean
}) {
  const overflowValue = useOverflowValue(inputRef, valueKey, masked)
  const isDesktop = useIsDesktop()

  if (locked) return lockedHint
  if (secret) return null
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
