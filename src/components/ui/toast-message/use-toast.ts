import * as React from "react"

import type { ToastType } from "./variants"

interface ToastData {
  primaryButtonLabel?: React.ReactNode
  onPrimaryButtonClick?: () => void
  secondaryButtonLabel?: React.ReactNode
  onSecondaryButtonClick?: () => void
}

/**
 * Судьба тоста после закрытия — и, как следствие, то, КАК он исчезает.
 *
 * Дизайн-чек от 08.09, замечание 15: «В продукте есть 2 вида тостов, внешне и
 * по статусной модели одно и то же, но судьба разная. Одни скапливаются в
 * центре уведомлений, вторые нет. То есть может быть успешный тост в ЦУ,
 * может быть просто отклик системы на копирование данных. Заведи два
 * поведения и пропс для разработчиков».
 *
 * • `collected` — сообщение остаётся в центре уведомлений. Уходя, оно
 *   УЛЕТАЕТ ТУДА: сжимается и смещается вверх-вправо, к значку колокольчика
 *   в шапке. Пользователь видит, куда оно делось;
 * • `transient` — отклик системы (скопировано, ссылка отправлена). Нигде не
 *   остаётся, поэтому и улетать ему некуда: гаснет на месте, съезжая вправо
 *   за край экрана.
 */
type ToastBehavior = "collected" | "transient"

interface ToastOptions {
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  /** Дизайн-чек 3/3 №8: Show Cross — свойство компонент-сета в Figma. */
  showCross?: boolean
  timeout?: number
  data?: ToastData
  /** Судьба сообщения — см. {@link ToastBehavior}. По умолчанию `collected`:
   *  статусные сообщения продукта копятся в центре уведомлений. */
  behavior?: ToastBehavior
}

interface ToastItem extends ToastOptions {
  id: string
  /** Тост уже закрыт и доигрывает анимацию ухода. */
  closing?: boolean
}

interface ToastContextValue {
  toasts: ToastItem[]
  add: (options: ToastOptions) => string
  close: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within <ToastProvider>")
  }
  return context
}

export { ToastContext, useToast }
export type {
  ToastBehavior,
  ToastData,
  ToastOptions,
  ToastItem,
  ToastContextValue,
}
