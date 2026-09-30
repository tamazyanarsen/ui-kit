import * as React from "react"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"
import { OtpCells } from "./code-cells"

// До первой отрисовки в браузере, без предупреждения при рендере на сервере.
const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

// OtpInput — один нативный <input>, а не OTPField из Base UI (шесть
// отдельных полей-позиций). Макет показывает одно непрерывное
// подчёркивание с кареткой по центру в пустом состоянии с фокусом и
// placeholder во всю ширину («Введите код из СМС»); и то и другое —
// обычное поведение одного поля, тогда как модель из шести позиций
// поставила бы каретку в первую позицию и вообще не знает о placeholder,
// растянутом на все позиции. Вставка, backspace и правка стрелками при
// таком устройстве достаются от нативного поля бесплатно.
//
// Цифры при этом рисует слой `OtpCells` — по ячейкам 40px, как в мастере
// (пропорциональные цифры Object Sans не уложить в такой ритм через
// letter-spacing поля). Текст и каретка самого поля прозрачны.
interface OtpInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "size" | "onChange"> {
  length?: number
  error?: React.ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onComplete?: (value: string) => void
  containerClassName?: string
}

/** Значение из пропа приводим к тем же правилам, что и ввод с клавиатуры:
 *  только цифры и не длиннее `length`. С клавиатуры лишнее не ввести
 *  (handleChange), а переданное программно значение рисовалось
 *  целиком — в матрице колонка «4 знака» показывала шестизначный код. */
function clampCode(
  raw: React.ComponentProps<"input">["value"],
  length: number
) {
  return raw === undefined
    ? undefined
    : String(raw).replace(/\D/g, "").slice(0, length)
}

// `forwardRef` — ref потребителя доезжает до нативного поля (фокус при
// открытии карточки, react-hook-form).
const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput({
  length = 6,
  error,
  className,
  containerClassName,
  onChange,
  onComplete,
  disabled,
  id,
  placeholder = "Введите код из СМС",
  value,
  defaultValue,
  ...props
}, ref) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  // `error={true}` — только красный цвет кода, без пустой строки подписи.
  const { errorText } = resolveCaption(error, undefined)
  const captionId = errorText ? `${inputId}-caption` : undefined
  // Отдаём инпуту ровно один из value/defaultValue — иначе React ругается на
  // одновременно контролируемое и неконтролируемое поле.
  const codeProps =
    value !== undefined
      ? { value: clampCode(value, length) }
      : { defaultValue: clampCode(defaultValue, length) }

  // Последний код, уже отданный в `onComplete`. Сбрасывается, как только
  // код стал неполным — в том числе когда его сбросил родитель (управляемый
  // `value=""` после ошибки сервера) или форма записала `ref.value = ""`:
  // иначе тот же код, введённый повторно, `onComplete` уже не вызывал.
  const completedRef = React.useRef<string | null>(null)
  if (value !== undefined && (clampCode(value, length) ?? "").length < length) {
    completedRef.current = null
  }

  // Снимок поля ДО изменения: значение и выделение. Берётся из самого узла
  // на `beforeinput`/`paste`/`keydown`, а не из того, что компонент видел
  // последним: неуправляемое поле форма переписывает мимо React
  // (`reset()` в react-hook-form пишет `ref.value`), и старый код из
  // памяти компонента отклонял бы новый ввод, возвращая в поле прежний.
  const inputRef = React.useRef<HTMLInputElement>(null)
  const setRef = useComposedRefs(inputRef, ref)
  const beforeRef = React.useRef<{ value: string; start: number; end: number } | null>(null)
  // Запасной вариант, когда снимка нет (изменение без клавиатуры и вставки —
  // например, программное событие): последний принятый код.
  const lastRef = React.useRef(clampCode(value ?? defaultValue, length) ?? "")
  if (value !== undefined) lastRef.current = clampCode(value, length) ?? ""

  // Что показывает слой ячеек: цифры, выделение и фокус берутся ИЗ УЗЛА, а не
  // из пропсов — неуправляемое поле форма переписывает мимо React.
  const [view, setView] = React.useState({ digits: "", start: 0, end: 0, focused: false })
  const sync = React.useCallback(() => {
    const input = inputRef.current
    if (!input) return
    const digits = input.value.replace(/D/g, "")
    const start = Math.min(input.selectionStart ?? digits.length, digits.length)
    const end = Math.min(input.selectionEnd ?? start, digits.length)
    const focused = document.activeElement === input
    setView((prev) =>
      prev.digits === digits && prev.start === start && prev.end === end && prev.focused === focused
        ? prev
        : { digits, start, end, focused }
    )
  }, [])
  // Значение пришло сверху (управляемое поле) — слой перерисовывается сразу.
  useIsoLayoutEffect(sync, [sync, value])

  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return

    // Запись `input.value = …` мимо React (`reset()` форм, `ref.value = ""`)
    // событий не даёт — слой узнаёт о ней через обёртку над свойством.
    // Дескриптор берём у самого узла: там уже стоит трекер значения React.
    const hadOwn = Object.prototype.hasOwnProperty.call(input, "value")
    const desc =
      Object.getOwnPropertyDescriptor(input, "value") ??
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
    if (desc?.get && desc.set) {
      Object.defineProperty(input, "value", {
        configurable: true,
        enumerable: desc.enumerable,
        get() {
          return desc.get!.call(this)
        },
        set(next: string) {
          desc.set!.call(this, next)
          sync()
        },
      })
    }
    // Выделение и фокус: стрелки, Shift+стрелки, мышь, вставка.
    const onSelection = () => {
      if (document.activeElement === input) sync()
    }
    const watch = ["focus", "blur", "select", "keyup", "mouseup", "paste"] as const
    for (const type of watch) input.addEventListener(type, sync)
    document.addEventListener("selectionchange", onSelection)
    // Щелчок ставит каретку по ЯЧЕЙКАМ: у поля своя раскладка текста, и
    // нативное положение каретки не совпало бы с нарисованными цифрами.
    const onClick = (event: MouseEvent) => {
      if (input.selectionStart !== input.selectionEnd) return
      const cells = input.parentElement?.querySelectorAll("[data-otp-cell]")
      if (!cells?.length) return
      let index = 0
      cells.forEach((cell, i) => {
        const rect = cell.getBoundingClientRect()
        if (rect.width && event.clientX > rect.left + rect.width / 2) index = i + 1
      })
      input.setSelectionRange(index, index)
      sync()
    }
    input.addEventListener("click", onClick)
    sync()

    const snapshot = () => {
      beforeRef.current = {
        value: input.value,
        start: input.selectionStart ?? input.value.length,
        end: input.selectionEnd ?? input.value.length,
      }
    }
    // Снимок живёт до ближайшего изменения: клавиша без ввода (стрелка) не
    // должна оставить устаревший снимок следующему изменению без клавиатуры.
    const drop = () => {
      beforeRef.current = null
    }
    const events = ["beforeinput", "paste", "keydown"] as const
    for (const type of events) input.addEventListener(type, snapshot, true)
    input.addEventListener("keyup", drop)
    input.addEventListener("blur", drop)
    return () => {
      if (desc?.get && desc.set) {
        if (hadOwn) Object.defineProperty(input, "value", desc)
        else delete (input as { value?: unknown }).value
      }
      for (const type of watch) input.removeEventListener(type, sync)
      document.removeEventListener("selectionchange", onSelection)
      input.removeEventListener("click", onClick)
      for (const type of events) input.removeEventListener(type, snapshot, true)
      input.removeEventListener("keyup", drop)
      input.removeEventListener("blur", drop)
    }
  }, [sync])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    applyChange(event)
    // Значение и каретка после чистки — уже окончательные.
    sync()
  }

  function applyChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const raw = input.value
    const all = raw.replace(/\D/g, "")
    const before = beforeRef.current
    beforeRef.current = null
    const previous = before ? before.value.replace(/\D/g, "") : lastRef.current
    const replacedSelection = before ? before.end > before.start : false

    // Цифра, дописанная в УЖЕ заполненное поле без выделения, отклоняется,
    // как это делал `maxLength`. Резать по длине здесь нельзя: дописанная в
    // конец цифра отрезалась бы и повторно вызывала `onComplete` тем же
    // кодом, а вставленная в середину молча выталкивала бы последнюю цифру.
    // Вставка поверх выделения — замена, её режем по длине, как в пустом
    // поле.
    if (all.length > length && previous.length === length && !replacedSelection) {
      const caret = before
        ? before.start
        : (input.selectionStart ?? raw.length) - (raw.length - previous.length)
      input.value = before?.value ?? previous
      input.setSelectionRange(Math.max(0, caret), Math.max(0, caret))
      return
    }

    // Вставка длиннее кода («Код: 123-456-7») — берутся первые `length` цифр.
    const digits = all.slice(0, length)
    if (digits !== raw) {
      // Каретка остаётся за теми же цифрами, что и до вычистки: запись
      // `value` сама по себе уводит её в конец поля, и правка посередине
      // продолжалась бы уже не там.
      const caret = input.selectionStart ?? raw.length
      const kept = Math.min(raw.slice(0, caret).replace(/\D/g, "").length, digits.length)
      input.value = digits
      input.setSelectionRange(kept, kept)
    }
    lastRef.current = digits
    if (previous.length < length) completedRef.current = null
    onChange?.(event)

    // `onComplete` — один раз на каждый новый полный код: не повторяется на
    // том же коде, но срабатывает, если человек исправил цифру в полном.
    if (digits.length < length) completedRef.current = null
    else if (digits !== completedRef.current) {
      completedRef.current = digits
      onComplete?.(digits)
    }
  }

  return (
    <div
      // `desktop:@container/otp` — только в десктопной форме: там у поля
      // своя ширина 368, а в колонке уже неё крупные цифры не помещались
      // (8 знаков в 288 — «1234567», аудит 23). В узкой колонке поле берёт
      // мобильный кегль и разрядку. В мобильной форме контейнера нет,
      // ширина по содержимому не обнуляется.
      className={cn(
        "mx-auto w-full max-w-full desktop:w-[368px] desktop:@container/otp",
        containerClassName
      )}
    >
      <div className="relative">
        <input
          ref={setRef}
          id={inputId}
          data-slot="otp-input"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          // ⚠️ Без `maxLength`: браузер режет вставку по нему ДО `onChange`,
          // то есть до чистки от нецифр, — «123-456» превращалось в «12345»,
          // а «Код: 123456» в «1». Длину ограничивает `handleChange`.
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          onChange={handleChange}
          {...codeProps}
          className={cn(
            // Дизайн-чек от 07.09, замечание 23: «Фокус на поле сделать
            // невидимым — по умолчанию поле кода в фокусе имеет синюю рамку,
            // её не нужно выводить». Поэтому здесь нет `focus-visible:focus-ring`.
            //
            // Доступность от этого не страдает: поле в карточке ОДНО и
            // получает фокус само при открытии, а признак фокуса у него —
            // мигающая каретка по центру подчёркивания (ровно так состояние
            // Focus нарисовано в мастере). Рамка вокруг 368-пиксельной строки
            // была бы не «кольцом вокруг контрола», а рамкой вокруг половины
            // окна.
            //
            // Геометрия — кадр Code мастера: высота 56 (десктоп, цифры H1
            // 44/56) и 48 (мобильная, 28/38), подчёркивание входит в высоту.
            // Собственная высота задана явно, иначе поле выходило 71px: у
            // input строка равна максимуму из line-height и естественной
            // высоты шрифта. Нижние отступы подобраны замером чернил
            // против формулы Figma (цифры: десктоп центр строки на 24 при
            // высоте 56, мобильная 19 при 48). У пустого поля отступ иной:
            // placeholder в Chrome ложится на базовую линию строки поля
            // (44px или 28px), поэтому иначе он оказывался на 11 и 6px ниже
            // центра, а в мастере стоит по центру (y=16 при 56, y=8 при 48).
            // Текст и каретка поля прозрачны: цифры, каретку и выделение рисует
            // слой `OtpCells` (см. code-cells.tsx). Высота и нижний отступ те
            // же, что у слоя, — от них зависит положение placeholder.
            "box-border h-12 w-full border-0 border-b border-[var(--otp-underline)] bg-transparent pb-[10px] text-center text-h1-mobile text-transparent caret-transparent outline-none selection:bg-transparent selection:text-transparent placeholder-shown:pb-[23px] desktop:h-14 desktop:pb-[7px] desktop:text-h1 desktop:placeholder-shown:pb-[21px]",
            "desktop:@max-[367px]/otp:h-12 desktop:@max-[367px]/otp:pb-[10px] desktop:@max-[367px]/otp:text-h1-mobile desktop:@max-[367px]/otp:placeholder-shown:pb-[23px]",
            // В состоянии Focused мастера («Input Code» Focused) текста нет —
            // только каретка и линия; подсказка «Введите код из СМС» есть
            // лишь у Default. Поэтому в фокусе placeholder прозрачный, а
            // каретка по центру не лежит поверх букв.
            "placeholder:text-p2-medium placeholder:text-[var(--otp-placeholder-fg)] focus:placeholder:text-transparent desktop:placeholder:text-p1-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <OtpCells
          digits={view.digits}
          start={view.start}
          end={view.end}
          focused={view.focused}
          invalid={invalid}
          disabled={Boolean(disabled)}
        />
      </div>
      {errorText && (
        <p
          id={captionId}
          // `break-words`: неразрывное слово в тексте ошибки переносится,
          // а не выходит за ячейки (аудит 18).
          //
          // Мастер (Regular 12/16): подпись стоит абсолютно, на 8px ниже
          // линии (на мобильной форме на 16px) и раскладку не двигает —
          // зазор до кнопок остаётся 48. Здесь она в потоке, но `-mb-6`
          // (мобильная форма: `-mb-8`) гасит её отступ и строку (8 + 16 /
          // 16 + 16), так что высота поля с ошибкой в одну строку прежняя. Абсолютной её не
          // делаем: в две-три строки текст наехал бы на «Отправить повторно»,
          // а так лишняя высота только сдвигает форму вниз.
          className="mt-4 text-center text-p3-regular break-words text-[var(--otp-error-fg)] -mb-8 desktop:mt-2 desktop:-mb-6"
        >
          {errorText}
        </p>
      )}
    </div>
  )
})

export { OtpInput }
