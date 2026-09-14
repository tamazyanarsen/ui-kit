import * as React from "react"

import {
  ToastContext,
  type ToastItem,
  type ToastOptions,
} from "./use-toast"

/**
 * Время жизни тоста.
 *
 * Дизайн-чек от 13.09, замечание 20: «Время жизни всех тостов скорректировать
 * до 4000ms». Раньше здесь стояло 8000 — из более раннего описания кита
 * («Время отображения всплывающего сообщения 8 сек»); новое описание
 * жизненного цикла его отменяет.
 */
const TOAST_TIMEOUT = 4000

/**
 * Сколько длится уход. Держится в паре с длительностью кадров `toast-out-*` в
 * styles/base.css и с переходом обёртки строки: узел снимается ПОСЛЕ того, как
 * анимация доиграла, иначе он пропадал бы кадром.
 *
 * 300, а не 260, — из документации: «уходят вверх на 200px в течение 300ms» и
 * «уходят вправо на 520 px в течение 300ms».
 */
const TOAST_EXIT_MS = 300

/**
 * ToastProvider — очередь сообщений и их таймеры.
 *
 * ⚠️ Предела количеству НЕТ. Дизайн-чек от 08.09, замечание 14: «Нажал
 * копирование несколько раз (7), но тостов предельно возникает три. Такого
 * быть не должно, новые просто должны продолжать появляться ниже. Предел
 * нужно убрать». Колонка и без предела не растянет страницу: она ограничена
 * высотой вьюпорта и подрезает СТАРЫЕ карточки сверху (см. `Toaster`).
 *
 * ⚠️ Время жизни СТОИТ, пока курсор в области уведомлений. Дизайн-чек от
 * 13.09, замечание 20: «Отображение — 4 секунды (4000ms) или неограничено,
 * если под ховером. По ховеру на область уведомлений (включая отступы между) —
 * пауза по времени жизни на все уведомления». Отсюда две особенности:
 *
 *   • пауза общая, а не на карточку под курсором: `pause()` останавливает всю
 *     очередь разом;
 *   • у каждого тоста хранится ОСТАТОК, а не момент истечения. После паузы
 *     таймер заводится заново на остаток — иначе сообщение, до которого
 *     дочитали, умирало бы сразу после увода курсора.
 */
function ToastProvider({
  timeout = TOAST_TIMEOUT,
  children,
}: {
  timeout?: number
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const [paused, setPaused] = React.useState(false)

  // Таймеры ухода (снятие узла после анимации) — отдельно от таймеров жизни:
  // уход пауза не останавливает, он уже начался.
  const exitTimers = React.useRef(new Map<string, number>())
  // Время жизни: сколько осталось каждому и когда отсчёт был запущен.
  const lifeTimers = React.useRef(new Map<string, number>())
  const remaining = React.useRef(new Map<string, number>())
  const startedAt = React.useRef(new Map<string, number>())

  const forget = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const exit = exitTimers.current.get(id)
    if (exit !== undefined) window.clearTimeout(exit)
    exitTimers.current.delete(id)
    remaining.current.delete(id)
    startedAt.current.delete(id)
  }, [])

  const clearLife = React.useCallback((id: string) => {
    const timer = lifeTimers.current.get(id)
    if (timer !== undefined) window.clearTimeout(timer)
    lifeTimers.current.delete(id)
  }, [])

  // Закрытие идёт в два шага: сначала карточка помечается уходящей и
  // доигрывает свою анимацию, и только потом снимается. Одним шагом она
  // исчезала кадром — дизайн-чек от 08.09, замечание 15.
  const close = React.useCallback(
    (id: string) => {
      clearLife(id)
      let alreadyClosing = false
      setToasts((prev) =>
        prev.map((toast) => {
          if (toast.id !== id) return toast
          alreadyClosing = Boolean(toast.closing)
          return { ...toast, closing: true }
        })
      )
      if (alreadyClosing) return
      exitTimers.current.set(
        id,
        window.setTimeout(() => forget(id), TOAST_EXIT_MS)
      )
    },
    [clearLife, forget]
  )

  const startLife = React.useCallback(
    (id: string, ms: number) => {
      if (ms <= 0) return
      remaining.current.set(id, ms)
      startedAt.current.set(id, performance.now())
      lifeTimers.current.set(id, window.setTimeout(() => close(id), ms))
    },
    [close]
  )

  const add = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).slice(2, 10)}`
      // В КОНЕЦ: «новые просто должны продолжать появляться ниже».
      setToasts((prev) => [...prev, { ...options, id }])
      const duration = options.timeout ?? timeout
      // Пока курсор в области уведомлений, новое сообщение тоже не тикает:
      // иначе оно умерло бы «под рукой» у читающего.
      if (paused) remaining.current.set(id, duration)
      else startLife(id, duration)
      return id
    },
    [paused, startLife, timeout]
  )

  const pause = React.useCallback(() => {
    setPaused(true)
    const now = performance.now()
    lifeTimers.current.forEach((timer, id) => {
      window.clearTimeout(timer)
      const left = (remaining.current.get(id) ?? 0) - (now - (startedAt.current.get(id) ?? now))
      remaining.current.set(id, Math.max(0, left))
    })
    lifeTimers.current.clear()
  }, [])

  const resume = React.useCallback(() => {
    setPaused(false)
    remaining.current.forEach((left, id) => {
      if (lifeTimers.current.has(id)) return
      startLife(id, left)
    })
  }, [startLife])

  React.useEffect(() => {
    const life = lifeTimers.current
    const exit = exitTimers.current
    return () => {
      life.forEach((timer) => window.clearTimeout(timer))
      exit.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const value = React.useMemo(
    () => ({ toasts, add, close, pause, resume }),
    [toasts, add, close, pause, resume]
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

export { ToastProvider, TOAST_EXIT_MS, TOAST_TIMEOUT }
