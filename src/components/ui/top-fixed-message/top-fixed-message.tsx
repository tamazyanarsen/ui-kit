import * as React from "react"
import { Alert } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"
import { useIsDesktop } from "@/lib/use-is-desktop"

import {
  TOP_FIXED_MESSAGE_BG,
  TOP_FIXED_MESSAGE_ICON_COLOR,
  type TopFixedMessageType,
} from "./variants"
import { CloseCross } from "@/components/ui/close-cross"

// Top Fixed Message — "Закреплённое сообщение". Full-width, sits flush
// under the header (0px offset) and scrolls together with the page
// content rather than staying pinned to the viewport (per spec: "Сообщение
// скролируеться вместе с контентом" — the name is about visual anchoring
// to the top of the content, not CSS position:fixed).
//
// Мастер: сет `ELK / top fixed message` 70441:14927 (Version 1.0.1,
// Release 68.34) в доступной копии `lSQi6Xn5HHrt1yvGCIFPZb`. Оси сета —
// `Size` (Desktop | Mobile) × `Type` (Red (Error) | Blue (System)).
//
// Ось `Size` в ките появилась вместе с релизом 68.34, и мобильная форма —
// это НЕ десктопная в узкой коробке: она перестраивается целиком.
//
//   Desktop (70441:14945)      Mobile (70441:14935/14940)
//   ─────────────────────      ──────────────────────────
//   высота 56, px 40, py 12    высота по содержимому, p 16
//   одна строка: значок,       значок 16 сверху + колонка
//   текст, кнопка, крестик     «текст / ряд кнопок», зазор 16
//   зазор значок→текст 16      зазор значок→колонка 12
//   значок 24                  значок 16
//   текст в одну строку,       текст ПЕРЕНОСИТСЯ (`word-break`),
//   многоточие + тултип        многоточия и тултипа нет
//   закрытие — крестик 24      закрытие — кнопка «Закрыть»
//
// Ряд кнопок мобильной формы — отдельный сет `Buttons Top Fix (ELK)`
// (70441:14952) с осью `Type`: Two Buttons | Main | Close. Это ровно три
// сочетания наших булевых слотов, поэтому отдельным пропом он не стал:
//
//   showButton && showIconClose → Two Buttons
//   showButton                  → Main
//   showIconClose               → Close
//
// ⚠️ Крестика на мобильной форме нет вовсе: `showIconClose` там рисует
// вторую кнопку ряда («Закрыть», `secondary-white`). Имя пропа оставлено
// как в панели свойств Figma — оно описывает СЛОТ («закрыть»), а не глиф.
//
// ⚠️ Значок — `icon / alert` (`Alert`), а не `CircleAlert`: так нода
// называется в обоих символах мастера. Рисунки этих двух глифов в ките
// совпадают до пути и на 16, и на 24, так что замена чисто именная.
interface TopFixedMessageProps {
  type?: TopFixedMessageType
  showIcon?: boolean
  text: React.ReactNode
  showButton?: boolean
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  showIconClose?: boolean
  /**
   * Подпись кнопки закрытия мобильной формы. На десктопе закрытие —
   * крестик без подписи, поэтому проп там ни на что не влияет.
   */
  closeLabel?: React.ReactNode
  onClose?: () => void
  className?: string
}

function TopFixedMessage({
  type = "blue",
  showIcon = true,
  text,
  showButton = false,
  buttonLabel,
  onButtonClick,
  showIconClose = true,
  closeLabel = "Закрыть",
  onClose,
  className,
}: TopFixedMessageProps) {
  // Форма выбирается в JS, а не медиазапросом: значок берёт РАЗНЫЕ рисунки
  // (16 и 24 — самостоятельные начертания мастера), тултип живёт в портале,
  // а крестик и кнопка «Закрыть» — разные узлы. CSS ни одного из трёх не
  // выражает. `<ViewportScope>` перебивает ширину окна — на этом стоят
  // колонки Desktop/Mobile в матрице.
  const isDesktop = useIsDesktop()

  const icon = showIcon && (
    <Alert
      size={isDesktop ? 24 : 16}
      aria-hidden="true"
      className={cn("shrink-0", isDesktop ? "size-6" : "size-4")}
      style={{ color: TOP_FIXED_MESSAGE_ICON_COLOR[type] }}
    />
  )

  return (
    <div
      data-slot="top-fixed-message"
      className={cn(
        "flex w-full",
        isDesktop
          ? "h-14 items-center gap-6 px-10 py-3"
          : "items-start gap-3 px-4 py-4",
        className
      )}
      style={{ backgroundColor: TOP_FIXED_MESSAGE_BG[type] }}
    >
      {isDesktop ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {icon}

            <Tooltip content={text}>
              <span className="min-w-0 truncate text-p2-medium text-[var(--top-fixed-message-title-fg)]">
                {text}
              </span>
            </Tooltip>

            {showButton && (
              <Button
                type="button"
                variant="secondary-black"
                size="sm"
                className="shrink-0"
                onClick={onButtonClick}
              >
                {buttonLabel}
              </Button>
            )}
          </div>

          {showIconClose && (
            /* Дизайн-чек №3 №9: «Некорректное начертание крестика».
               Коробка 24px — значит и рисунок 24px (`icon / close cross`,
               нода 263:6442), а не 16px, растянутый в полтора раза. */
            <CloseCross
              size={24}
              onClick={onClose}
              className="text-[var(--top-fixed-message-close-fg)]"
            />
          )}
        </>
      ) : (
        <>
          {icon}

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Мобильный текст переносится, а не обрезается: у мастера
                `word-break: break-word` и высота коробки по содержимому.
                Тултипа здесь нет намеренно — наведения на телефоне тоже. */}
            <p className="w-full [word-break:break-word] text-p2-medium text-[var(--top-fixed-message-title-fg)]">
              {text}
            </p>

            {/* Пустой ряд не рисуем: зазор 16 объявлен МЕЖДУ текстом и
                рядом, и пустой flex-контейнер оставил бы от него полосу. */}
            {(showButton || showIconClose) && (
              <div className="flex flex-wrap content-start items-start gap-2">
                {showButton && (
                  <Button
                    type="button"
                    variant="secondary-black"
                    size="sm"
                    onClick={onButtonClick}
                  >
                    {buttonLabel}
                  </Button>
                )}

                {showIconClose && (
                  <Button
                    type="button"
                    variant="secondary-white"
                    size="sm"
                    onClick={onClose}
                  >
                    {closeLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export { TopFixedMessage }
export type { TopFixedMessageProps }
