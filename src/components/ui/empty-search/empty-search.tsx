import * as React from "react"
import { CircleAlert } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Thumbnail, type ThumbnailType } from "@/components/ui/thumbnail"

// EmptySearchResults — «Пустая страница» (`ELK / empty-page`):
// центрированный информационный блок для состояний «ничего не найдено» и
// «не удалось загрузить». На практике по макету он не привязан к поиску
// («Блок может использоваться без иконки и/или без дополнительного
// текста»): значок, описание и кнопка независимо необязательны, поэтому
// компонент заодно служит обычным блоком пустого состояния.
//
// Обе формы идут от оси `Size` мастера: Desktop — это отступы 40/64 с H4 и
// P1 Medium, а Mobile убирает горизонтальные отступы совсем (остаются
// только 24px по вертикали) и опускает шрифты на ступень до H4 Mobile и
// P1 Medium Mobile. Зазор 24px между значком, текстом и кнопкой и зазор 4px
// внутри текстового блока в обеих формах одинаковы.
interface EmptySearchResultsProps {
  icon?: React.ReactNode
  /**
   * Тип плитки — тот же `Type`, что у компонента `Thumbnail`.
   *
   * Дизайн-чек от 07.09, замечание 13: «Для Empty Page пиктограмма должна
   * быть просто компонентом Thumbnail. Правки в ДС уже внесены». Плитка и
   * раньше была инстансом `Thumbnail`, но тип был ЗАШИТ в `icon`, поэтому
   * все статусные плитки миниатюры (check / question / clock / alert /
   * alert-red) и картиночная `picture` пустой странице были недоступны — с
   * точки зрения дизайнера пиктограмма была своя, а не компонент.
   */
  thumbnailType?: ThumbnailType
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

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

function EmptySearchResults({
  icon,
  thumbnailType = "icon",
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
  // Глиф нужен только плитке `icon`: у статусных типов Thumbnail рисует
  // свой собственный, а у `picture` его нет вовсе.
  const isIconTile = thumbnailType === "icon"
  const resolvedIcon =
    icon === undefined ? <CircleAlert size={24} aria-hidden="true" /> : icon
  const showThumbnail = isIconTile ? Boolean(resolvedIcon) : true

  return (
    <div
      data-slot="empty-search-results"
      className={cn(
        "flex flex-col items-center gap-6 py-6 text-center desktop:px-10 desktop:py-16",
        className
      )}
    >
      {showThumbnail && (
        // Плитка — не локальная вёрстка, а инстанс Thumbnail (в макете это
        // буквально `ELK / thumbnail`): 8px радиус, фон Grey 106, глиф 24px.
        <Thumbnail
          type={thumbnailType}
          size={largeIcon ? "l" : "m"}
          icon={
            isIconTile ? (
              <span className="flex items-center justify-center text-[var(--empty-search-icon-fg)] [&_svg]:size-6">
                {resolvedIcon}
              </span>
            ) : undefined
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
        {hasValue(description) && (
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
