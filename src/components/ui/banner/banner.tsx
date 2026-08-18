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
  // Figma's bullet asset is a small 4px circle centered in a 4x20 box
  // (viewBox "0 0 4 20", <circle r="2" cx="2" cy="10" />), solid fill with
  // no alpha — not a tall rounded bar. The literal fill color is
  // inconsistent between size instances (desktop sample: #494C4B; mobile
  // sample: solid white, i.e. exactly the surrounding text color) — the
  // mobile sample is treated as authoritative for the color-adaptive
  // intent since it has no dimming at all, so this renders solid
  // `currentColor`, not a muted/opacity variant.
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

function BannerDescription({
  description,
  bullet,
  className,
  itemGap = "gap-2",
}: {
  description: React.ReactNode | React.ReactNode[]
  bullet: boolean
  className?: string
  // Gap between the bullet and its line of text — 8px on desktop/compact,
  // but 4px on mobile per the live Figma component (the outer `className`
  // prop only reaches the line-stack gap, not this one).
  itemGap?: string
}) {
  const lines = Array.isArray(description) ? description : [description]

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
  // get_design_context on the "mobile" and "desktop small" (compact) master
  // components: mobile's CTA is the same blue `primary` fill as desktop
  // (bg #80E3FF); only compact's CTA is white/`secondary-white`. Size "lg"
  // is itself responsive (h-12/px-6/text-sm below the desktop: breakpoint,
  // h-14/px-8/text-base at/above it) so the same size prop already
  // reproduces both the mobile (48/24/14) and desktop+compact (56/32/16)
  // literal dimensions without branching on size here.
  const cta = ctaLabel && (
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
              <p className="text-h3">{title}</p>
              {description && (
                <p className="text-p1-medium">{description}</p>
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
              {/* Mobile counterpart of the desktop H3 title above — 18/24 per
                  "Mobile. Заголовок/H3 Medium Mobile" (node 29445:37296),
                  which is what the old text-lg/leading-6 pair spelled out by
                  hand. */}
              <p className="text-h3-mobile">{title}</p>
              {description && (
                // Line-to-line gap stays the shared default (8px, same as
                // desktop) — only the bullet-to-text gap (itemGap) is
                // narrower on mobile per the literal Figma component; an
                // earlier pass had conflated the two and shrunk both to 4px.
                <BannerDescription
                  description={description}
                  bullet={bullet}
                  className="text-p2-regular"
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
