import type * as React from "react"

/**
 * Растровая иллюстрация в двух форматах: AVIF, с запасным WebP.
 *
 * Иллюстрации кита — 3D-кадры с градиентами, бликами и прозрачностью
 * (Status Screen, маскоты Error Page, «спасибо за оценку» в NPS), вектором
 * они быть не могут. PNG-экспорты из Figma весили 56–350 КБ каждый; после
 * пережатия AVIF даёт ~5–22 КБ, WebP ~6–53 КБ. PNG не храним: WebP
 * поддерживается всеми браузерами, куда доезжает React 18 + Base UI.
 *
 * `display: contents` на `<picture>` — чтобы обёртка не участвовала в
 * раскладке: классы и позиционирование остаются на самом `<img>`, как было
 * до перехода на два формата.
 */
interface PictureProps extends Omit<React.ComponentProps<"img">, "src"> {
  /** URL AVIF-версии. */
  avif: string
  /** URL WebP-версии — она же значение `src` для запасного пути. */
  webp: string
}

function Picture({ avif, webp, ...img }: PictureProps) {
  return (
    <picture className="contents">
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img src={webp} {...img} />
    </picture>
  )
}

export { Picture }
export type { PictureProps }
