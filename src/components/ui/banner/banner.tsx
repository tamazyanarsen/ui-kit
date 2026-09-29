import * as React from "react"
import { Image as ImageIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  bannerBackgroundImage,
  bannerForegroundClassName,
  bannerVariants,
  type BannerColor,
  type BannerSize,
} from "./variants"

// Banner — компонент «01. Bank / banners». Один компонент покрывает все
// три размера из макета (`desktop` — крупный баннер с картинкой справа,
// `compact` — горизонтальная полоса, `mobile` — карточка в столбик),
// потому что и сам компонент в макете сделан так же: один узел, меняющий
// раскладку по свойству `size`, а не три отдельных компонента. `color`
// выбирает, с какого пастельного слоя градиента начинает проявляться фон
// (чёрный показывает все четыре слоя, синий — только нижний), см.
// variants.ts.
//
// `image`, `imageSrc` и `ctaLabel` необязательны, потому что сам макет
// показывает каждый размер и с выключенной картинкой, и с выключенной
// кнопкой (например, в мобильной строке цветного баннера кнопки нет
// вовсе).

interface BannerProps {
  size?: BannerSize
  color?: BannerColor
  title: React.ReactNode
  description?: React.ReactNode | React.ReactNode[]
  bullet?: boolean
  image?: boolean
  imageSrc?: string
  imageAlt?: string
  ctaLabel?: React.ReactNode
  onCtaClick?: () => void
  className?: string
}

function BannerBullet({ className }: { className?: string }) {
  // Ассет маркера в макете — маленький кружок 4px по центру коробки 4×20
  // (viewBox «0 0 4 20», <circle r="2" cx="2" cy="10" />), сплошная
  // заливка без прозрачности, а не высокая скруглённая полоска.
  // Литеральный цвет заливки у разных размерных инстансов разный (в
  // десктопном образце #494C4B, в мобильном — сплошной белый, то есть
  // ровно цвет окружающего текста). За образец взят мобильный: в нём нет
  // никакого затемнения, и он лучше выражает замысел «подстраиваться под
  // цвет». Поэтому здесь рисуется сплошной `currentColor`, а не
  // приглушённый вариант с прозрачностью.
  return (
    <span
      aria-hidden="true"
      className={cn("relative h-5 w-1 shrink-0", className)}
    >
      <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
    </span>
  )
}

function BannerImage({
  src,
  alt,
  className,
}: {
  src?: string
  alt?: string
  className?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className={cn("size-full object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex size-full items-center justify-center bg-white/10",
        className
      )}
    >
      <ImageIcon aria-hidden="true" className="size-8 text-white/40" />
    </div>
  )
}

/**
 * Строка описания, которую стоит рисовать. Потребитель собирает массив
 * условиями (`["До 10 млн", hasB && "Решение за день", null]`), и пустые
 * значения раньше становились пунктами — маркер без текста; пустой массив
 * давал пустой блок и лишний зазор под заголовком (аудит 18).
 */
function isFilled(line: React.ReactNode) {
  return line != null && line !== false && line !== true && line !== ""
}

function BannerDescription({
  description,
  bullet,
  className,
  itemGap = "gap-2",
}: {
  description: React.ReactNode | React.ReactNode[]
  bullet: boolean
  className?: string
  // Зазор между маркером и его строкой текста — 8px на desktop и compact,
  // но 4px на mobile по живому компоненту макета (внешний пропс
  // `className` достаёт только до зазора между строками, а не до этого).
  itemGap?: string
}) {
  const lines = (Array.isArray(description) ? description : [description]).filter(isFilled)

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-p1-medium",
        className
      )}
    >
      {lines.map((line, index) => (
        <div key={index} className={cn("flex items-start", itemGap)}>
          {bullet && <BannerBullet />}
          <p className="min-w-0 flex-1 [overflow-wrap:anywhere]">{line}</p>
        </div>
      ))}
    </div>
  )
}

function Banner({
  size = "desktop",
  color = "black",
  title,
  description,
  bullet = false,
  image = true,
  imageSrc,
  imageAlt,
  ctaLabel,
  onCtaClick,
  className,
}: BannerProps) {
  const fg = bannerForegroundClassName(color)
  // Пустые строки описания отбрасываются здесь, чтобы и проверка «есть ли
  // описание», и выбор раскладки (массив или одна строка) видели одно и то же.
  const lines = Array.isArray(description) ? description.filter(isFilled) : description
  const hasDescription = Array.isArray(lines) ? lines.length > 0 : isFilled(lines)
  // По мастерам «mobile» и «desktop small» (compact): у мобильного кнопка
  // с той же синей заливкой `primary`, что и у десктопного (фон #80E3FF), и
  // только у compact кнопка белая, `secondary-white`. Размер «lg» сам по
  // себе адаптивный (h-12/px-6/text-sm ниже брейкпоинта desktop: и
  // h-14/px-8/text-base на нём и выше), поэтому один и тот же пропс размера
  // уже воспроизводит и мобильные литеральные размеры (48/24/14), и
  // десктопные вместе с compact (56/32/16) — ветвиться по size здесь не
  // нужно.
  const cta = isFilled(ctaLabel) && (
    <Button
      variant={size === "compact" ? "secondary-white" : "primary"}
      size="lg"
      onClick={onCtaClick}
      className={size === "mobile" ? "w-full" : undefined}
    >
      {ctaLabel}
    </Button>
  )

  return (
    <div
      data-slot="banner"
      data-size={size}
      data-color={color}
      className={cn(bannerVariants({ size }), fg, className)}
      style={{ backgroundImage: bannerBackgroundImage(size, color) }}
    >
      {size === "desktop" && (
        <>
          <div className="flex min-h-[380px] flex-1 flex-col justify-center gap-8 py-14 pl-14">
            <div className="flex flex-col gap-6">
              <p className="text-h2">
                {title}
              </p>
              {hasDescription && (
                <BannerDescription description={lines} bullet={bullet} />
              )}
            </div>
            {cta}
          </div>
          {image && (
            <div className="w-[538px] shrink-0 self-stretch">
              <BannerImage src={imageSrc} alt={imageAlt} />
            </div>
          )}
        </>
      )}

      {size === "compact" && (
        <>
          {image && (
            <div className="h-32 w-60 shrink-0">
              <BannerImage src={imageSrc} alt={imageAlt} />
            </div>
          )}
          <div className="flex flex-1 items-center gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-h3">{title}</p>
              {/* Массив строк раскладывается по строкам, как у desktop и
                  mobile: внутри одного `<p>` строки сливались в одну, а
                  React ругался на ключи. Строка с `bullet` идёт тем же
                  путём — иначе compact единственный терял маркер. Строка
                  без маркера остаётся простым `<p>`: её вёрстка не
                  меняется. */}
              {hasDescription &&
                (Array.isArray(lines) || bullet ? (
                  <BannerDescription description={lines} bullet={bullet} />
                ) : (
                  <p className="text-p1-medium">{lines}</p>
                ))}
            </div>
            {cta}
          </div>
        </>
      )}

      {size === "mobile" && (
        <>
          {image && (
            <div className="h-32 w-full">
              <BannerImage src={imageSrc} alt={imageAlt} />
            </div>
          )}
          <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex flex-col gap-2">
              {/* Мобильная пара десктопного заголовка H3 выше — 18/24 по
                  «Mobile. Заголовок/H3 Medium Mobile», то есть ровно то,
                  что прежняя связка text-lg и leading-6 выписывала
                  вручную. */}
              <p className="text-h3-mobile">{title}</p>
              {hasDescription && (
                // Зазор между строками остаётся общим по умолчанию (8px,
                // как на десктопе) — на мобильном по литеральному
                // компоненту макета уже только зазор между маркером и
                // текстом (itemGap). Прежний проход путал эти два зазора и
                // ужимал до 4px оба.
                <BannerDescription
                  description={lines}
                  bullet={bullet}
                  className="text-p2-medium"
                  itemGap="gap-1"
                />
              )}
            </div>
            {cta}
          </div>
        </>
      )}
    </div>
  )
}

export { Banner }
export type { BannerProps }
