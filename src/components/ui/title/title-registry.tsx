import * as React from "react"
import { CircleHelp } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// TitleRegistry — "Заголовок без статуса", `ELK / title-page` with
// Type=Registry (node 8712:15258). The page heading used above a registry:
// the H2 title, an optional description, and an action group on the right —
// the fixed Справка button plus up to two page actions.
//
// Spec note for this variant: "Изменение в дизайне кнопки «справка» не
// допускается. Опциональные элементы: все, кроме Title." Unlike Title Card
// there is no Назад button and no status row, and the root gap is 8px rather
// than 16 — which is why this is its own component (see the note in
// title-card.tsx).

interface TitleRegistryProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** "Справка" — its design is fixed by the spec; only the handler varies. */
  helpLabel?: React.ReactNode
  onHelp?: () => void
  /** Page actions, right of Справка. Figma draws a primary and an optional
   * secondary-black one; any Button composition is accepted. */
  actions?: React.ReactNode
}

function TitleRegistry({
  className,
  title,
  description,
  helpLabel = "Справка",
  onHelp,
  actions,
  ...props
}: TitleRegistryProps) {
  const showHelp = Boolean(helpLabel)
  const showButtons = showHelp || Boolean(actions)

  return (
    <div
      data-slot="title-registry"
      className={cn("flex w-full flex-col items-start gap-2", className)}
      {...props}
    >
      <div className="flex w-full items-start gap-12">
        <h1 className="min-w-0 flex-1 truncate text-h2 text-[var(--title-fg)]">
          {title}
        </h1>
        {showButtons && (
          // Same optical `pt-6` as Title Card's help button.
          <div className="flex shrink-0 items-center gap-2 pt-1.5">
            {showHelp && (
              <Button
                variant="secondary-white"
                size="sm"
                icon={CircleHelp}
                iconPosition="left"
                onClick={onHelp}
              >
                {helpLabel}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className="w-full text-p2-medium text-[var(--title-description-fg)]">
          {description}
        </p>
      )}
    </div>
  )
}

export { TitleRegistry }
export type { TitleRegistryProps }
