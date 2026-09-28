import * as React from "react"
import { CircleHelp } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { TitleHeading } from "./heading"

// TitleRegistry — «Заголовок без статуса», то есть `ELK / title-page` с
// Type=Registry. Это заголовок страницы, который ставится над реестром:
// заголовок H2, необязательное описание и группа действий справа —
// фиксированная кнопка «Справка» плюс до двух действий страницы.
//
// Примечание макета к этому варианту: «Изменение в дизайне кнопки „справка“
// не допускается. Опциональные элементы: все, кроме Title». В отличие от
// Title Card, здесь нет кнопки «Назад» и нет строки статуса, а корневой
// зазор равен 8px, а не 16, — именно поэтому это отдельный компонент (см.
// примечание в title-card.tsx).

interface TitleRegistryProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** «Справка» — её оформление задано макетом, меняется только обработчик. */
  helpLabel?: React.ReactNode
  onHelp?: () => void
  /** Действия страницы, справа от «Справки». Макет рисует одно primary и
   * одно необязательное secondary-black; принимается любая сборка Button. */
  actions?: React.ReactNode
}

const TitleRegistry = React.forwardRef<HTMLDivElement, TitleRegistryProps>(function TitleRegistry({
  className,
  title,
  description,
  helpLabel = "Справка",
  onHelp,
  actions,
  ...props
}, ref) {
  const showHelp = Boolean(helpLabel)
  const showButtons = showHelp || Boolean(actions)

  return (
    <div
      data-slot="title-registry"
      className={cn("flex w-full flex-col items-start gap-2", className)}
      ref={ref}
      {...props}
    >
      <div className="flex w-full items-start gap-12">
        <TitleHeading>{title}</TitleHeading>
        {showButtons && (
          // Тот же оптический `pt-6`, что и у кнопки справки в Title Card.
          <div className="flex shrink-0 items-center gap-2 pt-1.5">
            {showHelp && (
              <Button
                variant="secondary-white"
                size="sm"
                icon={CircleHelp}
                iconPosition="left"
                onClick={onHelp}
              >
                {helpLabel}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className="w-full text-p2-medium text-[var(--title-description-fg)]">
          {description}
        </p>
      )}
    </div>
  )
})

export { TitleRegistry }
export type { TitleRegistryProps }
