import type * as React from "react"

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
  className?: string
}

function MenuBanner({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  color = "blue",
  className,
}: MenuBannerProps) {
  const style = COLOR_STYLES[color]

  return (
    <div
      data-slot="menu-banner"
      data-color={color}
      className={cn(
        "relative flex items-start gap-2 overflow-hidden rounded-[24px] px-10",
        style.bg,
        className
      )}
    >
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
    </div>
  )
}

export { MenuBanner }
export type { MenuBannerProps, MenuBannerColor }
