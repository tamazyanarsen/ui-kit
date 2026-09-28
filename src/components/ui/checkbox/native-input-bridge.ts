import * as React from "react"

import { assignRef } from "@/lib/compose-refs"

import { createChangeEvent } from "../input/change-event"

/**
 * Мост от контролов Base UI (Checkbox, Switch, Radio) к библиотекам форм.
 *
 * Base UI рисует `<span role=…>`, а настоящий `<input>` кладёт РЯДОМ,
 * скрытым. react-hook-form через `{...register("x")}` ждёт другого:
 * * `ref` — на нативном input: по нему читается `checked`/`value`, по нему
 *   ставится фокус на ошибке, и В НЕГО форма пишет значение
 *   (`defaultValues`, `setValue`, `reset` делают `ref.checked = …`);
 * * `onChange` — событие этого input с `name`: span событий `change` не
 *   получает вовсе;
 * * `onBlur` — с `target` на input: по `target.name` форма находит поле.
 *
 * Поэтому:
 * * ref потребителя уходит в `inputRef` примитива;
 * * запись `checked` мимо React перехватывается сеттером узла и отдаётся в
 *   `onExternalChecked` — иначе ближайший рендер Base UI возвращал бы
 *   флажку своё состояние, и форма хранила `true` при снятом флажке.
 *   Сеттер ставится в самом ref-колбэке, ДО ref потребителя: форма пишет
 *   значение прямо при подключении ref;
 * * `onChange` потребителя зовётся ПОСЛЕ того, как изменение применилось, и
 *   только если итоговое `checked` отличается от прежнего — отклонённое
 *   изменение (управляемый `checked`, `details.cancel()`) до формы не
 *   доходит. У Checkbox и Toggle источник — решение самого Base UI
 *   (`beginChange` из `onCheckedChange`), а не нативные события: клик по
 *   подписи браузер превращает в клик по input, React успевает применить
 *   его раньше нативного `change`, и сверка «было/стало» по нативному
 *   событию видела уже новое значение и молча глотала `onChange`;
 * * Radio (`radio`) устроена иначе: своего `onCheckedChange` у неё нет
 *   (решает группа), а обёртка при смене значения группы не
 *   перерисовывается — «применённое» значение по ней не отследить. Зато
 *   нативный `change` у радиокнопки приходит только при её выборе: `onChange`
 *   зовётся, если после применения кнопка выбрана. Запись формы в `checked`
 *   отдаётся группе целиком — она сама отличит свою запись от чужой;
 * * `onBlur` span-а отдаётся с подменённым `target`.
 */
function useNativeInputBridge({
  ref,
  inputRef,
  name,
  onChange,
  onBlur,
  onExternalChecked,
  radio = false,
}: {
  ref: React.ForwardedRef<HTMLInputElement>
  inputRef?: React.Ref<HTMLInputElement>
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLElement>
  /** `checked` записан в узел снаружи и отличается от применённого. */
  onExternalChecked?: (checked: boolean) => void
  /** Радиокнопка: изменение из нативного `change`, без сверки с применённым. */
  radio?: boolean
}) {
  const [input, setInput] = React.useState<HTMLInputElement | null>(null)
  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange
  const onExternalRef = React.useRef(onExternalChecked)
  onExternalRef.current = onExternalChecked
  // Применённое (закоммиченное) `checked` — то, что React отрисовал.
  const committedRef = React.useRef<boolean | null>(null)
  // Изменение, которое Base UI принял к рассмотрению, но React ещё не
  // применил: `before` — значение до него.
  const pendingRef = React.useRef<{ before: boolean | null; event?: Event } | null>(null)

  React.useLayoutEffect(() => {
    if (!input) return
    const pending = pendingRef.current
    pendingRef.current = null
    if (pending && input.checked !== pending.before) {
      onChangeRef.current?.(createChangeEvent(input, pending.event ?? new Event("change")))
    }
    committedRef.current = input.checked
  })

  const beginChange = React.useCallback((event?: Event) => {
    if (pendingRef.current) return
    const pending = { before: committedRef.current, event }
    pendingRef.current = pending
    // Отклонённое изменение рендера не вызывает — снимаем его после события
    // (дискретные события React применяет синхронно, до микрозадач), чтобы
    // оно не сработало при постороннем рендере позже.
    queueMicrotask(() => {
      if (pendingRef.current === pending) pendingRef.current = null
    })
  }, [])

  React.useEffect(() => {
    if (!input || !radio) return
    let pending: Event | null = null
    const handle = (event: Event) => {
      if (pending) return
      pending = event
      // Микрозадача выполняется, когда React уже применил выбор (или вернул
      // управляемой группе прежнее значение — тогда кнопка снова не выбрана).
      queueMicrotask(() => {
        const done = pending
        pending = null
        if (done && input.checked) onChangeRef.current?.(createChangeEvent(input, done))
      })
    }
    input.addEventListener("change", handle)
    return () => input.removeEventListener("change", handle)
  }, [input, radio])

  // Radio получает `name` только от RadioGroup; `name` из `register()`,
  // переданный самой радиокнопке, до input иначе не доходит — а без него
  // форма не узнаёт поле по событию.
  React.useLayoutEffect(() => {
    if (input && name && !input.name) input.name = name
  }, [input, name])

  const restoreRef = React.useRef<(() => void) | null>(null)
  const composedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      restoreRef.current?.()
      restoreRef.current = node
        ? interceptChecked(node, radio ? null : committedRef, onExternalRef)
        : null
      setInput(node)
      assignRef(ref, node)
      assignRef(inputRef, node)
    },
    [ref, inputRef, radio]
  )

  function handleBlur(event: React.FocusEvent<HTMLElement>) {
    if (!onBlur) return
    onBlur(
      input
        ? (Object.create(event, { target: { value: input } }) as React.FocusEvent<HTMLElement>)
        : event
    )
  }

  return { inputRef: composedRef, onBlur: onBlur ? handleBlur : undefined, beginChange }
}

/**
 * Сеттер `checked` на самом узле: пропускает запись в браузер и сообщает о
 * значениях, которые расходятся с применённым. Записи самого React совпадают
 * с состоянием контрола, и обработчик на них ничего не меняет. Без
 * `committedRef` (Radio) сообщается о каждой записи.
 */
function interceptChecked(
  input: HTMLInputElement,
  committedRef: React.MutableRefObject<boolean | null> | null,
  onExternalRef: React.MutableRefObject<((checked: boolean) => void) | undefined>
) {
  const own = Object.getOwnPropertyDescriptor(input, "checked")
  const native = own ?? Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked")
  if (!native?.get || !native.set) return null
  const { get, set } = native
  Object.defineProperty(input, "checked", {
    configurable: true,
    get() {
      return get.call(this)
    },
    set(next: boolean) {
      set.call(this, next)
      const value = Boolean(next)
      if (committedRef && value === committedRef.current) return
      onExternalRef.current?.(value)
    },
  })
  return () => {
    if (own) Object.defineProperty(input, "checked", own)
    else delete (input as { checked?: boolean }).checked
  }
}

/**
 * Состояние флажка для Checkbox и Toggle: управляемое, если передан
 * `checked`, иначе своё. Своё нужно ради записи формы в узел — Base UI
 * получает `checked` всегда, а запись снаружи попадает в это состояние.
 */
function useBridgedChecked<Details extends { isCanceled: boolean }>({
  checked,
  defaultChecked,
  onCheckedChange,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean, details: Details) => void
}) {
  const [own, setOwn] = React.useState(Boolean(defaultChecked))
  const controlled = checked !== undefined
  return {
    checked: controlled ? checked : own,
    onCheckedChange(next: boolean, details: Details) {
      onCheckedChange?.(next, details)
      if (!controlled && !details.isCanceled) setOwn(next)
    },
    onExternalChecked: controlled ? undefined : setOwn,
  }
}

export { useBridgedChecked, useNativeInputBridge }
