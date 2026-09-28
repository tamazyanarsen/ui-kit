import * as React from "react"

import { createChangeEvent } from "./change-event"
import { formatWithMask, getMaskPlaceholder, type MaskName } from "./mask"

/** То немногое из экземпляра imask, чем пользуется поле. */
interface MaskHandle {
  value: string
  readonly displayValue: string
}

/** Экземпляр `IMaskInput` (классовый компонент react-imask). */
interface IMaskComponent {
  maskRef?: MaskHandle
}


/**
 * Состояние поля под маской.
 *
 * Как только задана маска, значением поля владеет react-imask: он
 * возвращает отображаемую маскированную строку через onAccept, а мы
 * зеркалим её в состояние, чтобы кнопка очистки коробки и логика плавающей
 * подписи (:placeholder-shown) продолжали работать так же, как для обычного
 * поля.
 *
 * Сюда же вынесен замер ширины числа для маски суммы: знак «₽» стоит рядом
 * с полем, и поле должно сжиматься по фактической ширине значения — почему
 * именно замером, а не атрибутом `size`, см. `AmountSuffix`.
 */
function useMask({
  mask,
  value,
  defaultValue,
  onChange,
  inputRef,
}: {
  mask?: MaskName
  value?: React.ComponentProps<"input">["value"]
  defaultValue?: React.ComponentProps<"input">["defaultValue"]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  const imaskRef = React.useRef<IMaskComponent>(null)
  // ⚠️ Значение, пришедшее СНАРУЖИ, кладётся в состояние уже отформатированным
  // маской. С клавиатуры маску накладывает сам imask и отдаёт готовую строку в
  // `onAccept`, а на `value`/`defaultValue` он её не зовёт — поле показывало
  // «30 000 000», а состояние держало «30000000». На состоянии висит замер
  // ширины числа, поэтому поле получалось на два пробела уже показанного
  // текста и знак «₽» садился на последнюю цифру (дизайн-чек от 13.09, №1).
  const [internalValue, setInternalValue] = React.useState(() => {
    const raw = String(value ?? defaultValue ?? "")
    return mask ? formatWithMask(mask, raw) : raw
  })

  // В управляемом режиме показывается ровно `value`, а не копия в
  // состоянии. Копия расходилась с родителем: крестик очищал её, а если
  // родитель оставлял то же `value`, эффект синхронизации не перезапускался
  // и поле так и оставалось пустым при непустом значении формы.
  const controlled = value !== undefined
  const maskValue =
    mask && controlled ? formatWithMask(mask, String(value)) : internalValue

  // Родитель, не принявший ввод (не обновивший `value`), должен вернуть
  // поле к своему значению — как у нативного управляемого `<input>`.
  // react-imask подставляет `value` на каждой перерисовке, поэтому
  // достаточно перерисоваться.
  const [, rerender] = React.useReducer((n: number) => n + 1, 0)

  // Неуправляемому полю `value` в imask НЕ передаётся — только начальное
  // `defaultValue`. Иначе react-imask при монтировании затирал бы значение,
  // которое успели записать в узел до него: react-hook-form кладёт
  // `defaultValues` через `ref.value = …` прямо в ref-колбэке.
  const [initialValue] = React.useState(internalValue)
  const valueProps = controlled
    ? { value: maskValue }
    : { defaultValue: initialValue }

  // Запись `input.value = …` снаружи (react-hook-form: `setValue`, `reset`)
  // imask не видит: поле показывало новое значение, а маска помнила старое,
  // и следующий ввод считался от него. Поэтому у узла свой сеттер `value`,
  // который отдаёт чужую запись маске. Собственную запись imask узнаём по
  // совпадению с его `displayValue` и пропускаем.
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (!mask || !input) return
    // Оборачивается дескриптор самого узла, если он есть: React вешает на
    // input свой (`value`-трекер для onChange) — его нельзя ни потерять, ни
    // удалить при снятии обёртки.
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
        const handle = imaskRef.current?.maskRef
        if (!handle || next === handle.displayValue) return
        handle.value = String(next ?? "")
      },
    })
    return () => {
      if (own) Object.defineProperty(input, "value", own)
      else delete (input as { value?: string }).value
    }
  }, [mask, inputRef])

  /**
   * Очистка крестиком. Через API маски, а не событием `input`: imask
   * считает удалённое от последней сохранённой позиции каретки, и событие
   * с пустым значением стирало только символы ДО каретки («+7 912 345-67-89»
   * с кареткой в середине превращалось в «+7 456 789»). Родителю —
   * ровно один `onChange` с опустевшим полем.
   */
  function clearMask(input: HTMLInputElement) {
    const handle = imaskRef.current?.maskRef
    if (!handle) return false
    handle.value = ""
    if (controlled) rerender()
    // Событие нужно ради `event.target` у `onChange`: imask на него не
    // реагирует — значение в узле уже совпадает с его собственным.
    const event = new Event("input", { bubbles: true })
    input.dispatchEvent(event)
    onChange?.(createChangeEvent(input, event))
    return true
  }

  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [amountWidth, setAmountWidth] = React.useState<number>()
  const showAmountSuffix = mask === "amount" && Boolean(maskValue)

  React.useLayoutEffect(() => {
    if (mask !== "amount") return
    setAmountWidth(measureRef.current?.offsetWidth)
  }, [mask, maskValue])

  // ⚠️ Повторный замер после загрузки гарнитуры. Первый проходит на
  // подменном системном шрифте, и число выходит уже реального: поле берёт
  // эту ширину, а когда приезжает Object Sans, текст в него не помещается и
  // обрезается («90 000 0(₽» вместо «90 000 000 ₽»). Ловится только на
  // первом показе поля с готовым значением — при вводе с клавиатуры шрифт
  // давно загружен, поэтому дефект и переживал прошлые проверки.
  React.useEffect(() => {
    if (mask !== "amount") return
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (!fonts?.ready) return
    let cancelled = false
    fonts.ready.then(() => {
      if (!cancelled) setAmountWidth(measureRef.current?.offsetWidth)
    })
    return () => {
      cancelled = true
    }
  }, [mask, maskValue])

  function handleAccept(next: string, _maskRef: unknown, event?: InputEvent) {
    // Без события — это imask применил `value`, пришедшее сверху: сообщать
    // родителю его же значение незачем.
    if (!event) {
      if (!controlled) setInternalValue(next)
      return
    }
    if (controlled) rerender()
    else setInternalValue(next)
    onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return {
    maskValue,
    valueProps,
    imaskRef,
    clearMask,
    handleAccept,
    /** Ширина числа в px, пока её ещё не померили — `undefined`. */
    amountWidth,
    measureRef,
    showAmountSuffix,
  }
}

/**
 * Плейсхолдер поля.
 *
 * Пробел, а не пустая строка, там где нужен `:placeholder-shown`: на нём
 * держатся и плавающая подпись, и крестик очистки — без плейсхолдера
 * браузер считает поле «показывающим плейсхолдер» всегда.
 */
function resolvePlaceholder({
  mask,
  floating,
  placeholder,
  label,
  clearable,
}: {
  mask?: MaskName
  floating: boolean
  placeholder?: string
  label?: React.ReactNode
  clearable: boolean
}): string | undefined {
  if (mask) return getMaskPlaceholder(mask)
  if (floating) return " "
  return (
    placeholder ??
    (typeof label === "string" ? label : undefined) ??
    (clearable ? " " : undefined)
  )
}

export { resolvePlaceholder, useMask }
