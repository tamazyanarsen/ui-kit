import { cva } from "class-variance-authority"

// Banner tokens. Gradient stops measured directly from ui/banner/banners.svg
// (Figma export) — rgb(37,38,40)=#252628, rgb(255,201,181)=#FFC9B5,
// rgb(163,213,98)=#A3D562, rgb(154,195,255)=#9AC3FF, rgb(248,248,248)=#F8F8F8,
// all exact design-token colors. Each size has its own gradient angles (the
// spec redraws the same 4-color stack at a different angle per aspect
// ratio); layer ORDER (dark -> pink -> green -> blue, each color revealing
// itself + everything beneath it) is kept consistent across sizes even
// though a couple of raw instances in the file swap green/blue — that
// swap isn't a deliberate variant, just inconsistent duplication between
// separately-authored instances.
export type BannerSize = "desktop" | "compact" | "mobile"
export type BannerColor = "black" | "pink" | "green" | "blue"

type Layer = "dark" | "pink" | "green" | "blue" | "flat"

const GRADIENT_LAYERS: Record<BannerSize, Partial<Record<Layer, string>>> = {
  desktop: {
    dark: "linear-gradient(59.11982202810347deg, rgb(37, 38, 40) 8.0996%, rgb(52, 53, 54) 13.698%, rgb(66, 66, 66) 23.415%, rgb(37, 38, 40) 34.877%)",
    pink: "linear-gradient(-23.836338655091353deg, rgb(255, 201, 181) 6.9643%, rgb(248, 248, 248) 103.57%)",
    green:
      "linear-gradient(-23.836338655091353deg, rgb(163, 213, 98) 6.9643%, rgb(248, 248, 248) 103.57%)",
    blue: "linear-gradient(-23.836338655091353deg, rgb(154, 195, 255) 6.9643%, rgb(248, 248, 248) 103.57%)",
    flat: "linear-gradient(90deg, rgb(248, 248, 248) 0%, rgb(248, 248, 248) 100%)",
  },
  compact: {
    dark: "linear-gradient(29.391007407561382deg, rgb(37, 38, 40) 8.0996%, rgb(52, 53, 54) 13.698%, rgb(66, 66, 66) 23.415%, rgb(37, 38, 40) 34.877%)",
    pink: "linear-gradient(-8.464651650710692deg, rgb(255, 201, 181) 6.9643%, rgb(248, 248, 248) 103.57%)",
    green:
      "linear-gradient(-8.464651650710692deg, rgb(163, 213, 98) 6.9643%, rgb(248, 248, 248) 103.57%)",
    blue: "linear-gradient(-8.464651650710692deg, rgb(154, 195, 255) 6.9643%, rgb(248, 248, 248) 103.57%)",
  },
  mobile: {
    dark: "linear-gradient(26.446733882400935deg, rgb(37, 38, 40) 19.195%, rgb(37, 38, 40) 40.73%, rgb(41, 42, 44) 50.65%, rgb(59, 60, 62) 70.534%, rgb(248, 248, 248) 163.43%)",
    pink: "linear-gradient(-61.084576932599504deg, rgb(255, 201, 181) 6.9643%, rgb(248, 248, 248) 103.57%)",
    green:
      "linear-gradient(-61.084576932599504deg, rgb(163, 213, 98) 6.9643%, rgb(248, 248, 248) 103.57%)",
    blue: "linear-gradient(-61.084576932599504deg, rgb(154, 195, 255) 6.9643%, rgb(248, 248, 248) 103.57%)",
    flat: "linear-gradient(90deg, rgb(248, 248, 248) 0%, rgb(248, 248, 248) 100%)",
  },
}

const COLOR_STACK: Record<BannerColor, Layer[]> = {
  black: ["dark", "pink", "green", "blue"],
  pink: ["pink", "green", "blue"],
  green: ["green", "blue"],
  blue: ["blue"],
}

export function bannerBackgroundImage(size: BannerSize, color: BannerColor) {
  const layers = GRADIENT_LAYERS[size]
  const stack = COLOR_STACK[color]
    .map((layer) => layers[layer])
    .filter((value): value is string => Boolean(value))

  if (layers.flat) stack.push(layers.flat)

  return stack.join(", ")
}

// Colored (pink/green/blue) backgrounds are pale, so only the "black"
// variant needs light text — matches the four color-row instances in the
// "Colored banner" spec section exactly.
export function bannerForegroundClassName(color: BannerColor) {
  return color === "black" ? "text-white" : "text-[#252628]"
}

export const bannerVariants = cva("relative flex bg-cover", {
  variants: {
    size: {
      desktop: "w-full items-stretch overflow-hidden rounded-[56px]",
      compact:
        "h-32 w-full items-center gap-8 overflow-hidden rounded-[32px] px-14",
      mobile:
        "w-full max-w-[328px] flex-col overflow-hidden rounded-[24px]",
    },
  },
  defaultVariants: { size: "desktop" },
})
