import * as React from "react"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { Button, type ButtonProps } from "@/components/ui/button"

// PromoBanner — небольшой баннер витрины предложений: заголовок, описание,
// кнопка и картинка в правом нижнем углу. Листается каруселью
// `PromoCarousel` (два в кадре на десктопе, один в мобильном виде).
//
// Крупный `Banner` («01. Bank / banners») сюда не подходит: у него H2/H3,
// кнопка lg и картинка во всю высоту (десктоп) или сверху (mobile), а у
// баннера витрины текст P1/P2, кнопка sm и картинка, вписанная в угол.
//
// Правки UI-Kit от 25.10, пункт «Карусель баннеров в мобильном виде» —
// ограничения мобильного вида:
//   • поля 16 со всех сторон у текста и кнопки; картинка — в правом нижнем
//     углу без полей, тянется на высоту блока под заголовком и вписывается в
//     неё;
//   • заголовок (P1 мобильный, 14/20) — одна строка, не влезает — многоточие;
//   • описание (P2 мобильный, 12/16) сразу под заголовком через 4 — не больше
//     двух строк с многоточием, и место под него всегда две строки (32), чтобы
//     баннеры ленты были одной высоты при любом тексте;
//   • от описания до кнопки 24, кнопка (sm, 32) прижата к низу;
//   • высота по содержимому, без десктопных минимумов:
//     16 + 20 + 4 + 32 + 24 + 32 + 16 = 144.
// Десктоп — та же раскладка на десктопной ступени: поля 24, заголовок P1
// 16/24 (переносится), описание P2 14/20, две строки (40).

type PromoBannerColor = "blue" | "lavender" | "mint" | "grey"

const COLOR_BG: Record<PromoBannerColor, string> = {
  blue: "bg-[var(--promo-banner-blue-bg)]",
  lavender: "bg-[var(--promo-banner-lavender-bg)]",
  mint: "bg-[var(--promo-banner-mint-bg)]",
  grey: "bg-[var(--promo-banner-grey-bg)]",
}

interface PromoBannerProps
  extends Omit<React.ComponentProps<"div">, "title" | "color"> {
  title: React.ReactNode
  description?: React.ReactNode
  color?: PromoBannerColor
  /** Картинка: адрес растра… */
  imageSrc?: string
  imageAlt?: string
  /** …или готовый узел (SVG-иллюстрация). Вписывается в правый нижний угол. */
  image?: React.ReactNode
  actionLabel?: React.ReactNode
  onAction?: () => void
  /** Вариант кнопки. По умолчанию — secondary-black. */
  actionVariant?: ButtonProps["variant"]
}

const PromoBanner = React.forwardRef<HTMLDivElement, PromoBannerProps>(
  function PromoBanner(
    {
      title,
      description,
      color = "blue",
      imageSrc,
      imageAlt,
      image,
      actionLabel,
      onAction,
      actionVariant = "secondary-black",
      className,
      ...props
    },
    ref
  ) {
    const picture =
      image ??
      (imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt ?? ""}
          className="size-full object-contain object-right-bottom"
        />
      ) : null)

    return (
      <div
        ref={ref}
        data-slot="promo-banner"
        data-color={color}
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-[16px] text-[var(--promo-banner-fg)] desktop:rounded-[24px]",
          COLOR_BG[color],
          className
        )}
        {...props}
      >
        <p
          data-slot="promo-banner-title"
          className={cn(
            "mb-1 truncate px-4 pt-4 text-p1-medium-adaptive",
            "desktop:px-6 desktop:pt-6 desktop:[overflow-wrap:anywhere] desktop:whitespace-normal"
          )}
        >
          {title}
        </p>
        <div className="flex min-h-0 flex-1">
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col pb-4 pl-4 desktop:pb-6 desktop:pl-6">
            <p
              data-slot="promo-banner-description"
              className="line-clamp-2 h-8 text-p2-medium-adaptive text-[var(--promo-banner-muted-fg)] desktop:h-10"
            >
              {description}
            </p>
            {hasNode(actionLabel) && (
              <Button
                variant={actionVariant}
                size="sm"
                onClick={onAction}
                className="mt-6 w-fit"
              >
                {actionLabel}
              </Button>
            )}
          </div>
          {picture && (
            // Колонка держит ширину картинки, а высоту строки задаёт только
            // текст: картинка внутри — абсолютом, вписана в высоту блока под
            // заголовком (104 в мобильном виде). В потоке растянутая SVG с
            // `size-full` сама раздувала строку по своим пропорциям (баннер
            // 159 вместо 144).
            <div className="relative w-[40%] max-w-[180px] shrink-0">
              <div
                data-slot="promo-banner-image"
                aria-hidden={imageAlt ? undefined : true}
                className="absolute inset-0 flex items-end justify-end [&>img]:max-h-full [&>img]:max-w-full [&>svg]:size-full"
              >
                {picture}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export { PromoBanner }
export type { PromoBannerProps, PromoBannerColor }
