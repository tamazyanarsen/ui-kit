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

import logo131 from "./logo-131bank.svg"
import { MiniCard } from "./mini-card"
import { PaymentIcon } from "./payment-icon"
import {
  CARD_TYPES,
  ICON_STATUS_STYLE,
  isIconStatusType,
  MINI_TYPES,
  SBP_TYPES,
  THUMBNAIL_ICON_BG,
  THUMBNAIL_ICON_FG,
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
  /**
   * Знак для `type="logo"` — 24×24 внутри светло-серой плитки. В мастере это
   * instance swap (по умолчанию `Logo/131Bank`), поэтому принимается узел.
   */
  logo?: React.ReactNode
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
  logo,
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
  const isLogo = type === "logo"
  const isMini = MINI_TYPES.has(type)

  // Мастер: значок у всех типов на top −4, right −8; у миниатюры карты
  // (Card, Sticker) — на top 4: она ниже плитки (34 из 48), и значок
  // сидит на её верхнем крае. Type=Image — ровно то же, что и у прочих:
  // картинка заполняет плитку целиком, особого положения у неё больше нет.
  const badgeOffset = isMini ? "top-1 right-[-8px]" : "top-[-4px] right-[-8px]"
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
  } else if (isLogo) {
    bg = THUMBNAIL_ICON_BG.grey
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
              className={cn("size-6", THUMBNAIL_ICON_FG[background])}
            />
          ) : (
            icon
          ))}

        {isMini && (
          <MiniCard
            kind={type as "card" | "sticker"}
            compact={size === "m"}
            system={paymentSystem}
            last4={last4Text}
            disabled={disabled}
          />
        )}

        {/* Type=Logo — знак 24×24 по центру светло-серой плитки. */}
        {isLogo &&
          (logo ?? <img src={logo131} alt="" className="size-6" />)}

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
