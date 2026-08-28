import * as React from "react"
import { CircleAlert } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Thumbnail } from "@/components/ui/thumbnail"

// EmptySearchResults — «Пустая страница» (`ELK / empty-page`, node
// 70333:270): a centered info block for "nothing found" / "couldn't load"
// states. Per spec it's not search-specific in practice ("Блок может
// использоваться без иконки и/или без дополнительного текста") —
// icon/description/button are all independently optional, so this doubles as
// a generic empty-state block.
//
// Both forms come from the master's `Size` axis: Desktop is 40/64 padding
// with H4 + P1 Medium, Mobile drops the horizontal padding entirely (24px
// vertical only) and steps the type down to H4/P1 Medium Mobile. The 24px
// gap between icon → text → button and the 4px gap inside the text block are
// the same in both.
interface EmptySearchResultsProps {
  icon?: React.ReactNode
  /**
   * Размер плитки под иконку — свойство `Large Icon` мастера. Плитка в
   * макете это инстанс `ELK / thumbnail`, поэтому значения совпадают с его
   * размерами: `true` → L (48px на десктопе, 40 на мобайле), `false` → M
   * (40px всегда). Сам глиф в обоих случаях 24px — тонкая 16px-плитка из
   * старой версии макета больше не существует.
   */
  largeIcon?: boolean
  title: React.ReactNode
  description?: React.ReactNode
  /**
   * Показывать ли кнопку. Дизайн-чек №27: раньше кнопка появлялась и
   * пропадала по факту заполнения `buttonLabel`, то есть «включалась
   * текстовой строчкой» — в Storybook её нельзя было выключить иначе, чем
   * стерев подпись. Теперь это отдельное булево свойство; по умолчанию —
   * как раньше, чтобы не ломать существующие вызовы.
   */
  showButton?: boolean
  buttonLabel?: React.ReactNode
  /** «Нам здесь может понадобиться либо брендовая кнопка, либо серая». */
  buttonVariant?: "primary" | "secondary-grey"
  /**
   * Иконка в кнопке. Дизайн-чек 3/3 №27: у кейса «нулевой результат
   * фильтрации» кнопка «Сбросить фильтры» несёт тот же значок
   * `icon / clear filter`, что и одноимённая кнопка в шапке таблицы, —
   * «чтобы два способа сбросить фильтры читались как одно действие»
   * (пакет дизайнера, EmptySearchResults/empty-cases.tsx).
   */
  buttonIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onButtonClick?: () => void
  className?: string
}

function EmptySearchResults({
  icon,
  largeIcon = true,
  title,
  description,
  showButton,
  buttonLabel,
  buttonVariant = "secondary-grey",
  buttonIcon,
  onButtonClick,
  className,
}: EmptySearchResultsProps) {
  const isButtonVisible = showButton ?? buttonLabel != null
  const resolvedIcon =
    icon === undefined ? (
      <CircleAlert size={24} aria-hidden="true" />
    ) : (
      icon
    )

  return (
    <div
      data-slot="empty-search-results"
      className={cn(
        "flex flex-col items-center gap-6 py-6 text-center desktop:px-10 desktop:py-16",
        className
      )}
    >
      {resolvedIcon && (
        // Плитка — не локальная вёрстка, а инстанс Thumbnail (в макете это
        // буквально `ELK / thumbnail` с типом «иконка»): 8px радиус, фон
        // Grey 106, глиф 24px.
        <Thumbnail
          type="icon"
          size={largeIcon ? "l" : "m"}
          icon={
            <span className="flex items-center justify-center text-[var(--empty-search-icon-fg)] [&_svg]:size-6">
              {resolvedIcon}
            </span>
          }
        />
      )}
      {/* Text-блок целиком во всю ширину (в мастере колонка Text — `w-full`
          внутри карточки 680px), без отдельного ограничения в 384px: оно
          заставляло длинные описания переноситься на строку раньше макета. */}
      <div className="flex w-full flex-col gap-1">
        <h3 className="text-h4-mobile text-[var(--empty-search-title-fg)] desktop:text-h4">
          {title}
        </h3>
        {description && (
          <p className="text-p2-medium text-[var(--empty-search-description-fg)] desktop:text-p1-medium">
            {description}
          </p>
        )}
      </div>
      {isButtonVisible && (
        <Button
          type="button"
          variant={buttonVariant}
          size="sm"
          icon={buttonIcon}
          iconPosition={buttonIcon ? "left" : undefined}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptySearchResults }
export type { EmptySearchResultsProps }
