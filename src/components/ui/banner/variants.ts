import { cva } from "class-variance-authority"

// Токены Banner. Точки градиента сняты прямо с вектора макета —
// rgb(37,38,40)=#252628, rgb(255,201,181)=#FFC9B5, rgb(163,213,98)=#A3D562,
// rgb(154,195,255)=#9AC3FF, rgb(248,248,248)=#F8F8F8, — и все это точные
// цвета дизайн-токенов. У каждого размера свои углы градиента (макет
// перерисовывает ту же стопку из четырёх цветов под своим углом для каждого
// соотношения сторон), а вот ПОРЯДОК слоёв (тёмный → розовый → зелёный →
// синий, где каждый цвет проявляет себя и всё, что под ним) выдержан
// одинаково для всех размеров, хотя пара отдельных инстансов в файле меняет
// зелёный и синий местами. Эта перестановка — не намеренный вариант, а
// разнобой между инстансами, которые рисовали порознь.
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

// Цветные фоны (розовый, зелёный, синий) бледные, поэтому светлый текст
// нужен только варианту «black» — в точности как в четырёх цветовых строках
// инстансов из раздела «Colored banner» макета.
export function bannerForegroundClassName(color: BannerColor) {
  return color === "black"
    ? "text-[var(--banner-fg-inverse)]"
    : "text-[var(--banner-fg)]"
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
