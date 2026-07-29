import * as React from "react"
import { Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  bannerBackgroundImage,
  bannerForegroundClassName,
  bannerVariants,
  type BannerColor,
  type BannerSize,
} from "./variants"

// Banner — the "01. Bank / banners" component. One component covers all
// three spec sizes (`desktop` = hero with image right, `compact` = the
// horizontal bar, `mobile` = the stacked card) since that's how the Figma
// component itself is authored: a single node switching layout on a `size`
// property, not three separate components. `color` picks which pastel
// gradient layer the background starts revealing from (black shows all
// four stacked layers, blue shows only the bottom one) — see variants.ts.
//
// `image`/`imageSrc` and `ctaLabel` are optional because the spec itself
// demos every size with the image and/or button turned off (e.g. the
// colored-banner mobile row has no button at all).

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
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 h-5 w-1 shrink-0 rounded-full bg-current opacity-40",
        className
      )}
    />
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

function BannerDescription({
  description,
  bullet,
  className,
}: {
  description: React.ReactNode | React.ReactNode[]
  bullet: boolean
  className?: string
}) {
  const lines = Array.isArray(description) ? description : [description]

  return (
    <div
      className={cn("flex flex-col gap-2 text-base leading-6", className)}
    >
      {lines.map((line, index) => (
        <div key={index} className="flex items-start gap-2">
          {bullet && <BannerBullet />}
          <p className="flex-1">{line}</p>
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
  const cta = ctaLabel && (
    <Button
      variant={size === "desktop" ? "primary" : "secondary-white"}
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
              <p className="text-[32px] leading-[44px] font-medium">
                {title}
              </p>
              {description && (
                <BannerDescription description={description} bullet={bullet} />
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
              <p className="text-2xl leading-8 font-medium">{title}</p>
              {description && (
                <p className="text-base leading-6">{description}</p>
              )}
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
              <p className="text-lg leading-6 font-medium">{title}</p>
              {description && (
                <BannerDescription
                  description={description}
                  bullet={bullet}
                  className="gap-1 text-sm leading-5"
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
