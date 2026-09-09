import type * as React from "react"

import { ArrowBackChevron, ArrowNextChevron } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// MenuBanner — «Баннер в меню ЕЛК» (нода 70303:53228): промо-карточка в
// последней колонке раскрытого меню навигации. Карточка 240px высотой с
// заголовком H4, подзаголовком P2 и тёмной кнопкой действия; поверх заливки
// лежит размытое пятно-градиент.
//
// В макете это пятно — SVG-ассет (круг r=160 с линейным градиентом от
// светлого оттенка заливки к белому и `feGaussianBlur stdDeviation=64`).
// Здесь оно собрано теми же числами на CSS, а не «на глаз»: `size-80` —
// это те же 320px диаметра, `blur-[64px]` — та же сигма (CSS `blur()`
// принимает именно стандартное отклонение), смещение центра взято из
// макета (left calc(50% + 70.5px), top calc(50% + 140px)).
type MenuBannerColor = "blue" | "lilac" | "green"

const COLOR_STYLES: Record<MenuBannerColor, { bg: string; glow: string }> = {
  blue: {
    bg: "bg-[var(--menu-banner-blue-bg)]",
    glow: "from-[var(--menu-banner-blue-glow)]",
  },
  lilac: {
    bg: "bg-[var(--menu-banner-lilac-bg)]",
    glow: "from-[var(--menu-banner-lilac-glow)]",
  },
  green: {
    bg: "bg-[var(--menu-banner-green-bg)]",
    glow: "from-[var(--menu-banner-green-glow)]",
  },
}

interface MenuBannerProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  color?: MenuBannerColor
  /**
   * Перелистывание — `Banner Switch Button` слева и справа (нода
   * 70303:53219). Не заданы — стрелок нет вовсе: у одиночного баннера
   * листать нечего.
   */
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

function MenuBanner({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  color = "blue",
  onPrev,
  onNext,
  className,
}: MenuBannerProps) {
  const style = COLOR_STYLES[color]

  return (
    <div
      data-slot="menu-banner"
      data-color={color}
      // ⚠️ `px-10` больше нет: сорок пикселей поля слева и справа — это НЕ
      // паддинг карточки, а ширина кнопок перелистывания (32) плюс зазор
      // ряда (8). Так собран мастер (нода 70303:58491), и без кнопок текст
      // просто встал бы туда же — отсюда `px-10` в старой вёрстке. Как
      // только кнопки появились, паддинг стал бы вторым отступом.
      className={cn(
        "group/banner relative flex items-start gap-2 overflow-hidden rounded-[24px]",
        !onPrev && "pl-10",
        !onNext && "pr-10",
        style.bg,
        className
      )}
    >
      {onPrev && (
        <BannerSwitchButton side="prev" onClick={onPrev} label="Предыдущий баннер" />
      )}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-[calc(50%+140px)] left-[calc(50%+70.5px)] size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r to-white blur-[64px]",
          style.glow
        )}
      />
      <div className="relative flex h-60 min-w-0 flex-1 flex-col gap-6 py-10">
        {/* Тексты переносятся, а не обрезаются в одну строку: в макете
            (нода 70303:58477) заголовки баннеров занимают до двух строк, а
            `overflow-hidden` стоит только страховкой — карточка ровно 240px
            и рассчитана на 2 + 2 строки. */}
        <div className="flex w-full flex-col gap-2 overflow-hidden text-[var(--header-fg)]">
          <p className="w-full text-h4">{title}</p>
          {subtitle && <p className="w-full text-p2-medium">{subtitle}</p>}
        </div>
        {buttonLabel && (
          <Button
            variant="secondary-black"
            size="sm"
            className="w-fit"
            onClick={onButtonClick}
          >
            {buttonLabel}
          </Button>
        )}
      </div>

      {onNext && (
        <BannerSwitchButton side="next" onClick={onNext} label="Следующий баннер" />
      )}
    </div>
  )
}

/**
 * `Banner Switch Button` (нода 70303:53219) — стрелка перелистывания.
 *
 * Числа из мастера: коробка во всю высоту баннера, поля `pl-12 pr-4` у левой
 * и `pl-4 pr-12` у правой, глиф 16 — то есть ровно 32px области нажатия от
 * края, как и сказано в комментарии макета («область клика — во всю высоту,
 * 32 пикселя от края баннера»).
 *
 * Видимость: «при наведении на баннер становятся видны элементы
 * перелистывания». Гасится ПРОЗРАЧНОСТЬЮ, а не `hidden`, — иначе кнопка
 * пропадала бы из обхода табом, и листать баннеры с клавиатуры стало бы
 * нечем. По той же причине она проявляется и на своём фокусе, а не только
 * на наведении на карточку.
 *
 * Цвет: Grey 284 в покое, Grey 1514 под курсором («при наведении на
 * конкретную стрелку меняется её цвет на Grey 1514»).
 */
function BannerSwitchButton({
  side,
  onClick,
  label,
}: {
  side: "prev" | "next"
  onClick: () => void
  label: string
}) {
  const Glyph = side === "prev" ? ArrowBackChevron : ArrowNextChevron

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-slot="menu-banner-switch"
      data-side={side}
      className={cn(
        "relative z-10 flex shrink-0 cursor-pointer flex-col items-start justify-center self-stretch py-2 outline-none transition-[opacity,color]",
        side === "prev" ? "pr-1 pl-3" : "pr-3 pl-1",
        "text-[var(--menu-banner-switch-fg)] hover:text-[var(--menu-banner-switch-fg-hover)]",
        "opacity-0 group-hover/banner:opacity-100 focus-visible:opacity-100 focus-visible:focus-ring-inset"
      )}
    >
      <Glyph size={16} aria-hidden="true" className="size-4 shrink-0" />
    </button>
  )
}

export { MenuBanner }
export type { MenuBannerProps, MenuBannerColor }
