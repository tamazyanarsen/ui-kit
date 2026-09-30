import type * as React from "react"

import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock,
  ImageIcon,
} from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon, type IconName } from "@/components/ui/icon"

import { PaymentIcon } from "./payment-icon"
import { PaymentLogo } from "./payment-logo"
import {
  CARD_TYPES,
  ICON_STATUS_STYLE,
  isIconStatusType,
  SBP_TYPES,
  THUMBNAIL_ICON_BG,
  type PaymentSystem,
  type ThumbnailBackground,
  type ThumbnailSize,
  type ThumbnailType,
} from "./variants"

const ICON_STATUS_GLYPH = {
  check: CircleCheck,
  question: CircleHelp,
  clock: Clock,
  alert: CircleAlert,
  "alert-red": CircleAlert,
} as const

// Thumbnail — «Миниатюра»: небольшая плитка со значком или логотипом,
// которая отмечает платёжную систему на карте или статус объекта. Типы
// семейства карт (card, sticker, sbp-card, sbp-card-account) рисуют тёмную
// плитку со знаком платёжной системы; типы icon-status (check, question,
// clock, alert, alert-red) — светлую подкрашенную плитку с глифом;
// «picture» — слот под свою иллюстрацию; «icon» — светло-серая плитка с
// любым 24-пиксельным глифом кита.
interface ThumbnailProps {
  type?: ThumbnailType
  size?: ThumbnailSize
  /**
   * Глиф для `type="icon"`. В Figma это instance swap внутри плитки, и по
   * умолчанию туда положено «многоточие» (`icon / more`) — отсюда прежнее
   * ошибочное имя варианта `more` (дизайн-чек №3 №4).
   */
  icon?: IconName | React.ReactNode
  /**
   * Заливка квадрата у `type="icon"` — серая (по умолчанию) или белая.
   * Дизайн-чек от 13.09, замечание 5; подробности — в `./variants`.
   */
  background?: ThumbnailBackground
  disabled?: boolean
  paymentSystem?: PaymentSystem
  last4?: string
  showDot?: boolean
  count?: number
  src?: string
  alt?: string
  className?: string
}

function Thumbnail({
  type = "card",
  size = "l",
  icon = "ellipsis",
  background = "grey",
  disabled = false,
  paymentSystem = "mir",
  last4,
  showDot = false,
  count,
  src,
  alt = "",
  className,
}: ThumbnailProps) {
  // Цифры карты: не заданные — заглушка «0000», пустая строка — без цифр, числа (слабо типизированный
  // вызов) приводятся к строке, а не роняют рендер.
  const last4Text = last4 == null ? "0000" : String(last4).trim()
  const isCardFamily = CARD_TYPES.has(type)
  const isSbp = SBP_TYPES.has(type)
  const isIconStatus = isIconStatusType(type)
  const isIconTile = type === "icon"

  // Type=Image: значок сидит внутри картинки, а не на углу. По мастеру: на 48px
  // (L / Desktop) правый край 4, верх 28; на 40px (M и L-M / Mobile) — правый
  // край 0, верх 12. Проценты давали 3.84/27.84 и 3.2/23.2, то есть на 40px
  // значок стоял на 11px ниже мастера.
  const pictureOffset =
    size === "l" ? "top-3 right-0 desktop:top-7 desktop:right-1" : "top-3 right-0"
  const badgeOffset = type === "picture" ? pictureOffset : "top-[-4px] right-[-8px]"
  const badge =
    count !== undefined ? (
      <Badge
        type="counter"
        value={count}
        disabled={disabled}
        className={cn("absolute z-10", badgeOffset)}
      />
    ) : showDot ? (
      <Badge type="point" disabled={disabled} className={cn("absolute z-10", badgeOffset)} />
    ) : null

  // Выключенное состояние — плоский opacity-50 на всей плитке для любого
  // типа (совпадает с образцами Disabled в макете), без подмены цвета фона
  // по типам.
  const containerClassName = disabled ? "opacity-50" : ""

  let bg: string | undefined
  if (isCardFamily) {
    bg = "var(--tag-black-bg)"
  } else if (isIconTile) {
    bg = THUMBNAIL_ICON_BG[background]
  } else if (isIconStatus) {
    bg = ICON_STATUS_STYLE[type].bg
  }
  // isSbp: оставлено неопределённым — его тёмная плитка рисуется
  // внутренними абсолютно спозиционированными слоями ниже, а не внешней
  // заливкой (см. блок isSbp).

  return (
    <span
      data-slot="thumbnail"
      data-type={type}
      data-size={size}
      data-background={isIconTile ? background : undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-[8px]",
        // Size в мастере — три значения: `L / Desktop` (48), `M / Desktop`
        // (40) и `L-M / Mobile` (40), то есть на мобиле L и M совпадают.
        // Поэтому L отзывчив, а M одинаков всегда.
        size === "l" ? "size-10 desktop:size-12" : "size-10",
        containerClassName,
        className
      )}
      style={{ backgroundColor: bg }}
    >
      <span className="flex size-full items-center justify-center overflow-hidden rounded-[8px]">
        {isIconTile &&
          (typeof icon === "string" ? (
            <Icon
              name={icon}
              size={24}
              aria-hidden="true"
              className="size-6 text-[var(--tag-grey-secondary-fg)]"
            />
          ) : (
            icon
          ))}

        {/* Type=Card — значок 24×24 из макета по центру плитки; у Sticker
            мастер — целиком картинка плитки, её здесь нет, остаётся знак. */}
        {type === "card" && (
          <PaymentIcon system={paymentSystem} size="24" disabled={disabled} />
        )}
        {type === "sticker" && (
          <PaymentLogo system={paymentSystem} disabled={disabled} />
        )}

        {type === "picture" &&
          (src ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : (
            <ImageIcon size={24} aria-hidden="true" className="size-6 text-white/90" />
          ))}

        {isIconStatus && (() => {
          const Glyph = ICON_STATUS_GLYPH[type]
          return (
            <Glyph
              size={24}
              aria-hidden="true"
              className="size-6"
              style={{ color: ICON_STATUS_STYLE[type].fg }}
            />
          )
        })()}
      </span>

      {isSbp && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 overflow-hidden rounded-[4px]",
            type === "sbp-card-account" ? "bottom-[10%]" : "inset-y-0"
          )}
          style={{ backgroundColor: "var(--tag-black-bg)" }}
        >
          {/* Мастер SBP Card: значок 24×6 и цифры прижаты к правому краю
              на 4px, отсчёт от НИЗА плитки — значок стоит на 24px выше
              низа, цифры на 8px (`bottom-20` + `translate-y-full` при
              высоте строки 12). У SBP Card Account плитка короче на 10%,
              и те же отступы там 22.2 и 6.2. Цифры — P4 Regular. */}
          <PaymentIcon
            system={paymentSystem}
            size="24x6"
            disabled={disabled}
            className={cn(
              "absolute right-1",
              type === "sbp-card-account" ? "bottom-[22.2px]" : "bottom-6"
            )}
          />
          {/* Пустые цифры — «·» без числа; не заданные — заглушка. */}
          {last4Text !== "" && (
            <span
              className={cn(
                "absolute right-1 text-p4-regular whitespace-nowrap text-white",
                type === "sbp-card-account" ? "bottom-[6.2px]" : "bottom-2"
              )}
            >
              · {last4Text}
            </span>
          )}
        </span>
      )}

      {type === "sbp-card-account" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-[2.5%] top-[92.5%] bottom-0 rounded-b-[4px]"
          style={{ backgroundColor: "var(--tag-black-bg)" }}
        />
      )}

      {type === "sticker" && (
        <svg
          aria-hidden="true"
          viewBox="0 0 11 11"
          className="absolute right-0 bottom-0 size-[11px]"
        >
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H11V4C11 7.86599 7.86599 11 4 11H0V4Z"
            fill="var(--badge-dark-grey-bg)"
          />
        </svg>
      )}

      {badge}
    </span>
  )
}

export { Thumbnail }
export type { ThumbnailProps }
