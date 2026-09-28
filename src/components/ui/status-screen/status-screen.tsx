import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { StatusIllustration } from "./illustration"
import { STATUS_TYPES, type StatusType } from "./variants"

// Status Screen — «Экран результата операции»: 3D-иллюстрация статуса +
// Title + Subtitle + кнопки.
//
// Дизайн-чек 3/3 №16: плоская плашка с иконкой заменена настоящими
// объёмными кадрами из макета — см. illustration.tsx.
//
// Дизайн-чек 3/3 №17: «есть поля для ввода текстов для кнопок, но тогла для
// отображения кнопок и тогла для отображения подзаголовка — нет. Так же
// неочевидное наименование контролов для текста кнопок». Раньше видимость
// выводилась из наличия подписи (`primaryLabel && ...`) — «конвенция
// EmptySearchResults/ErrorPage». Для этого компонента она неверна: в Figma
// `Show Buttons` и `Show Subtitle` — самостоятельные булевы свойства
// компонент-сета, и их надо уметь выключать, не стирая тексты. Поэтому оба
// заведены явными пропами, а подписи кнопок переименованы в понятные
// `primaryButtonLabel` / `secondaryButtonLabel`.
interface StatusScreenProps {
  status?: StatusType
  title: React.ReactNode
  /** `Show Subtitle` — подзаголовок под заголовком. */
  showSubtitle?: boolean
  subtitle?: React.ReactNode
  /** `Show Buttons` — блок кнопок целиком. */
  showButtons?: boolean
  primaryButtonLabel?: React.ReactNode
  onPrimaryClick?: () => void
  secondaryButtonLabel?: React.ReactNode
  onSecondaryClick?: () => void
  className?: string
}

function StatusScreen({
  status = "success",
  title,
  showSubtitle = true,
  subtitle,
  showButtons = true,
  primaryButtonLabel,
  onPrimaryClick,
  secondaryButtonLabel,
  onSecondaryClick,
  className,
}: StatusScreenProps) {
  const withSubtitle = showSubtitle && Boolean(subtitle)
  const withButtons =
    showButtons && Boolean(primaryButtonLabel || secondaryButtonLabel)

  return (
    <div
      data-slot="status-screen"
      // Корневой блок макета: max-w 768, колонка с gap-32.
      className={cn(
        "flex max-w-[768px] flex-col items-center gap-8 text-center",
        className
      )}
    >
      <StatusIllustration status={status} />

      <div className="flex w-full flex-col gap-4">
        <h2 className="text-h3 text-[var(--status-screen-title-fg)]">
          {title}
        </h2>

        {withSubtitle && (
          // Колонка Title/Subtitle в макете `w-full` внутри 768px-экрана —
          // ограничение в 384px переносило подзаголовок на строку раньше.
          <p className="w-full text-p1-medium text-[var(--status-screen-title-fg)]">
            {subtitle}
          </p>
        )}
      </div>

      {withButtons && (
        // Кнопки, которые не помещаются рядом, переносятся на свою строку:
        // без переноса «В центр уведомлений» + «Прочитать все (23)» на 375
        // уходили за край на 35px. Только в мобильной форме: на десктопе ряд
        // задаёт минимальную ширину экрана в контейнере по содержимому.
        <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 desktop:flex-nowrap">
          {primaryButtonLabel && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onPrimaryClick}
            >
              {primaryButtonLabel}
            </Button>
          )}
          {secondaryButtonLabel && (
            <Button
              type="button"
              variant="secondary-grey"
              size="lg"
              onClick={onSecondaryClick}
            >
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { StatusScreen, STATUS_TYPES }
export type { StatusScreenProps, StatusType }
