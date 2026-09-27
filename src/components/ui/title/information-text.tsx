import * as React from "react"

import { cn } from "@/lib/utils"

// TitleInformationText — «Information Text (ELK)», второстепенная строка,
// которая стоит рядом с тегом статуса под заголовком страницы. Макет даёт
// ей два типа:
//
//   • `Link` — одна подчёркнутая P2 Link Medium стандартным тёмным цветом
//     текста (НЕ синим цветом ссылок кита: в мастере это подчёркнутый
//     #252628);
//   • `Text` — одна или несколько пар «подпись: значение», подпись цветом
//     Grey 284, значение — Grey 1514, 4px внутри пары и 16px между парами
//     (в мастере есть флаг `showDublicate` исключительно ради отрисовки
//     второй пары, а для компонента это просто «нарисуй список, который
//     тебе дали»).
//
// Оба живут в одном и том же слоте `ELK / title-page`, поэтому здесь это
// один компонент, переключаемый пропсом `type`, а не два экспорта, между
// которыми вызывающему коду пришлось бы выбирать.

interface TitleInformationTextPair {
  label: React.ReactNode
  value: React.ReactNode
}

interface TitleInformationTextProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  type?: "link" | "text"
  /** При `type="link"` — собственный текст ссылки. */
  children?: React.ReactNode
  href?: string
  onLinkClick?: () => void
  /** `type="text"`: the label/value pairs. */
  items?: TitleInformationTextPair[]
}

function TitleInformationText({
  className,
  type = "link",
  children,
  href,
  onLinkClick,
  items = [],
  ...props
}: TitleInformationTextProps) {
  return (
    <div
      data-slot="title-information-text"
      data-type={type}
      className={cn(
        "flex items-start text-p2-medium",
        type === "text" && "gap-4 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {type === "link" ? (
        <a
          href={href}
          onClick={onLinkClick}
          className="shrink-0 text-link text-[var(--title-fg)] outline-none focus-visible:focus-ring"
        >
          {children}
        </a>
      ) : (
        items.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-1">
            <span className="text-[var(--title-muted-fg)]">{item.label}</span>
            <span className="text-[var(--title-fg)]">{item.value}</span>
          </span>
        ))
      )}
    </div>
  )
}

export { TitleInformationText }
export type { TitleInformationTextProps, TitleInformationTextPair }
