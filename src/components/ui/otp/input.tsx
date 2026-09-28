import * as React from "react"

import { useComposedRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"

// OtpInput — один нативный <input>, а не OTPField из Base UI (шесть
// отдельных полей-позиций). Макет показывает одно непрерывное
// подчёркивание с кареткой по центру в пустом состоянии с фокусом и
// placeholder во всю ширину («Введите код из СМС»); и то и другое —
// обычное поведение одного поля, тогда как модель из шести позиций
// поставила бы каретку в первую позицию и вообще не знает о placeholder,
// растянутом на все позиции. Вставка, backspace и правка стрелками при
// таком устройстве достаются от нативного поля бесплатно.
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

  React.useEffect(() => {
    const input = inputRef.current
    if (!input) return
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
      for (const type of events) input.removeEventListener(type, snapshot, true)
      input.removeEventListener("keyup", drop)
      input.removeEventListener("blur", drop)
    }
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
      className={cn("mx-auto w-full desktop:w-[368px]", containerClassName)}
    >
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
          "w-full border-0 border-b border-[var(--otp-underline)] bg-transparent pb-3 text-center text-[28px] leading-[38px] font-medium tracking-[0.29em] indent-[0.29em] text-[var(--otp-fg)] outline-none desktop:text-h1 desktop:tracking-[0.35em] desktop:indent-[0.35em]",
          "placeholder:text-p2-medium placeholder: placeholder:tracking-normal placeholder:indent-0 placeholder:text-[var(--otp-placeholder-fg)] desktop:placeholder:text-p1-medium",
          invalid && "text-[var(--otp-error-fg)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {errorText && (
        <p
          id={captionId}
          className="mt-4 text-center text-p3-medium text-[var(--otp-error-fg)] desktop:mt-2"
        >
          {errorText}
        </p>
      )}
    </div>
  )
})

export { OtpInput }
