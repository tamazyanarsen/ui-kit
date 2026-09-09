import * as React from "react"
import { CloseCross } from "@/components/ui/close-cross"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon as KitIcon, type IconName } from "@/components/ui/icon"

import {
  ICON_COLOR,
  ICON_COMPONENT,
  SOLID_BG,
  type InformerIcon,
  type InformerSolid,
} from "./variants"

// Informer — "Уведомление": a notification for use inside a content
// block. Noticeable but doesn't block the user's work; its size auto-fits
// the text. Width: min 360px, max unlimited (min drops to 240px for the
// link-only variant used in modals, per the spec's own exception note —
// callers control that via `className`, this component doesn't clamp
// width itself). Date/description/buttons/cross are all optional — the
// spec's minimal form is just icon + Title.
interface InformerProps {
  icon?: InformerIcon
  /**
   * Любая иконка кита вместо пяти штатных — дизайн-чек от 08.09, замечание
   * 12: «В информер добавить возможность проброса нестандартной иконки…
   * доработать компонент и сделать там возможность ставить любую иконку из
   * кита».
   *
   * Отдельным пропом, а не расширением `icon`: у штатных пяти вместе с
   * глифом приезжает и цвет (красный «внимание», зелёная «галочка»), а
   * произвольная иконка сама по себе ничего о статусе не сообщает — цвет ей
   * задаётся `customIconColor`, по умолчанию тем же серым, что у
   * `information`.
   *
   * Принимает имя из набора (молния в ките зовётся `"lghtning-fill"`) или
   * готовый узел, если нужен нестандартный размер или своя обёртка.
   */
  customIcon?: IconName | React.ReactNode
  /** Цвет произвольной иконки. Любое валидное значение CSS `color`. */
  customIconColor?: string
  title: React.ReactNode
  date?: React.ReactNode
  description?: React.ReactNode
  solid?: InformerSolid
  showCross?: boolean
  onClose?: () => void
  mainButtonLabel?: React.ReactNode
  onMainButtonClick?: () => void
  additionalButtonLabel?: React.ReactNode
  onAdditionalButtonClick?: () => void
  className?: string
}

function Informer({
  icon = "attention-red",
  customIcon,
  customIconColor = "var(--informer-icon-grey)",
  title,
  date,
  description,
  solid = "white",
  showCross = true,
  onClose,
  mainButtonLabel,
  onMainButtonClick,
  additionalButtonLabel,
  onAdditionalButtonClick,
  className,
}: InformerProps) {
  const Icon = ICON_COMPONENT[icon]

  return (
    <div
      data-slot="informer"
      // Design-check #27: padding/icon-gap read directly off the anatomy
      // sheet (ui/message/informer) — 24px padding (was 16, p-4) and a 16px
      // gap between the icon and the text column (was 12, gap-3).
      // Size=Mobile is a 328px card with 16px padding, Size=Desktop a
      // 592px one (min 400) with 24px — the min-width was 360 and the
      // padding was desktop-only.
      // ⚠️ Минимум взят `min(400px, 100%)`, а не голыми 400px. Дизайн-чек от
      // 07.09, замечание 28: «Информер не должен вылезать за пределы блока…
      // у информера не должно быть макс ширины, он должен встроиться в
      // правила содержащего его блока». Жёсткие 400 — это именно то, что
      // мешало: в узком виджете (перевод между счетами) карточка отказывалась
      // сжиматься и вылезала за скруглённый край блока. `min()` оставляет
      // спецификационный минимум там, где место есть, и снимает его там, где
      // его нет.
      className={cn(
        "rounded-[16px] p-4 desktop:min-w-[min(400px,100%)] desktop:p-6",
        className
      )}
      style={{ backgroundColor: SOLID_BG[solid] }}
    >
      <div className="flex items-start gap-4">
        {customIcon === undefined ? (
          <Icon
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0"
            style={{ color: ICON_COLOR[icon] }}
          />
        ) : typeof customIcon === "string" ? (
          // `size={24}` — не то же самое, что `className="size-6"`: у части
          // иконок кита 16 и 24 нарисованы отдельно, и масштабирование
          // шестнадцатого до двадцати четырёх даёт слишком жирный штрих
          // (дизайн-чек от 08.09, замечание 31).
          <KitIcon
            name={customIcon}
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0"
            style={{ color: customIconColor }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center"
            style={{ color: customIconColor }}
          >
            {customIcon}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {/* Mobile steps the whole text block down one notch:
                  Title 14/20 and date/description 12/16 (Size=Mobile,
                  node 70240:35984), against 16/24 and 14/20 on desktop. */}
              <span className="text-p2-medium text-[var(--informer-title-fg)] desktop:text-p1-medium">
                {title}
              </span>
              {date && (
                <span className="text-p3-medium text-[var(--informer-meta-fg)] desktop:text-p2-medium">
                  {date}
                </span>
              )}
            </div>
            {description && (
              <span className="text-p3-medium text-[var(--informer-description-fg)] desktop:text-p2-medium">
                {description}
              </span>
            )}
          </div>
          {(mainButtonLabel || additionalButtonLabel) && (
            <div className="flex items-center gap-2">
              {mainButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-black"
                  size="sm"
                  onClick={onMainButtonClick}
                >
                  {mainButtonLabel}
                </Button>
              )}
              {additionalButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-grey"
                  size="sm"
                  onClick={onAdditionalButtonClick}
                >
                  {additionalButtonLabel}
                </Button>
              )}
            </div>
          )}
        </div>
        {/* The cross is a sibling of the whole text Box in the master
            (v2.0.5, node 70240:35984) — one 16px-gap row of
            [icon 24][Box][cross] — not a child of the title line. Its
            `py-1` wrapper is what centres the 16px glyph against the 24px
            status icon; nested in the title row it sat 4px high, and the
            gap was 12px instead of 16. */}
        {showCross && (
          <span className="flex shrink-0 items-center py-1">
            <CloseCross
              onClick={onClose}
              className="text-[var(--informer-title-fg)]"
            />
          </span>
        )}
      </div>
    </div>
  )
}

export { Informer }
export type { InformerProps }
