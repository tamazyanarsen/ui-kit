import * as React from "react"

import { cn } from "@/lib/utils"

// TitleInformationText — "Information Text (ELK)" (node 60519:35006), the
// secondary line that sits next to the status Tag under a page title. Figma
// gives it two types:
//
//   • `Link` — a single underlined P2 Link Medium in the standard dark text
//     colour (NOT the kit's link blue — the master is #252628 underlined);
//   • `Text` — one or more `label: value` pairs, the label in Grey 284 and
//     the value in Grey 1514, 4px apart inside a pair and 16px between pairs
//     (the master ships a `showDublicate` flag purely to draw a second pair,
//     which as a component is just "render the list you were given").
//
// Both live in the same slot of `ELK / title-page`, so they are one component
// switched by `type` rather than two exports the caller has to choose between.

interface TitleInformationTextPair {
  label: React.ReactNode
  value: React.ReactNode
}

interface TitleInformationTextProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  type?: "link" | "text"
  /** `type="link"`: the link's own text. */
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
          className="shrink-0 text-link text-[var(--title-fg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
