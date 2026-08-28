import * as React from "react"
import { ArrowLeftSmall, CircleHelp } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tag, type TagColor } from "@/components/ui/tag"

import { TitleHeading } from "./heading"
import { TitleInformationText } from "./information-text"

// TitleCard — "Заголовок со статусом", `ELK / title-page` with Type=Title
// Card (node 7593:18875). The page heading used on an entity card: a Назад
// button, the H2 title with an optional Справка button opposite it, a
// description, and a status row of Tag + link/label-value pairs.
//
// Per the spec's own note on this variant: "Изменение в дизайне кнопки
// «справка» не допускается. Кнопка «Назад» выводит на предыдущий экран
// (страница откуда пришли или же шаг, откуда пришли — когда сценарий имеет
// Progress Bar). Опциональные элементы: все, кроме Title и Button" — so the
// help button's look is fixed here rather than exposed as a prop, and every
// slot except the title is optional.
//
// This is a separate component from `TitleRegistry` (Type=Registry) rather
// than one component behind a `type` prop: the two differ in root gap (16 vs
// 8), in which slots exist at all, and in what the right-hand side holds
// (one fixed help button vs a free action group), so a single component
// would be a union of two disjoint prop sets.

interface TitleCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** "Назад" — omit to drop the button entirely. */
  backLabel?: React.ReactNode
  onBack?: () => void
  /** "Справка" — its design is fixed by the spec; only the handler varies. */
  helpLabel?: React.ReactNode
  onHelp?: () => void
  /** The status Tag. */
  tag?: React.ReactNode
  tagColor?: TagColor
  /** The `Information Text (ELK)` slot next to the tag: a link or pairs. */
  information?: React.ReactNode
}

function TitleCard({
  className,
  title,
  description,
  backLabel = "Назад",
  onBack,
  helpLabel = "Справка",
  onHelp,
  tag,
  tagColor = "green",
  information,
  ...props
}: TitleCardProps) {
  const showBack = Boolean(onBack || backLabel === null ? onBack : backLabel)
  const showHelp = Boolean(helpLabel)

  return (
    <div
      data-slot="title-card"
      className={cn("flex w-full flex-col items-start gap-4", className)}
      {...props}
    >
      {showBack && (
        <Button
          variant="secondary-white"
          size="sm"
          icon={ArrowLeftSmall}
          iconPosition="left"
          onClick={onBack}
        >
          {backLabel}
        </Button>
      )}

      {/* Title + description are one 8px-gapped group; the 16px root gap sits
          between that group, the Назад button and the status row. */}
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-start gap-12">
          <TitleHeading>{title}</TitleHeading>
          {showHelp && (
            // `pt-6` on the wrapper, not on the button: Figma aligns the
            // 32px button optically against the 44px title line rather than
            // to its top edge.
            <div className="flex shrink-0 flex-col items-start pt-1.5">
              <Button
                variant="secondary-white"
                size="sm"
                icon={CircleHelp}
                iconPosition="left"
                onClick={onHelp}
              >
                {helpLabel}
              </Button>
            </div>
          )}
        </div>
        {description && (
          <p className="w-full text-p2-medium text-[var(--title-description-fg)]">
            {description}
          </p>
        )}
      </div>

      {(tag || information) && (
        <div
          data-slot="title-card-status"
          className="flex w-full items-center gap-4"
        >
          {tag && <Tag color={tagColor}>{tag}</Tag>}
          {information}
        </div>
      )}
    </div>
  )
}

export { TitleCard, TitleInformationText }
export type { TitleCardProps }
