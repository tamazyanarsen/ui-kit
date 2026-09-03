import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// AccordionList / AccordionListItem — "Content Accordion" from the spec: a
// bordered list of expandable rows (checkbox + Title/chevron + Subtitle on
// the left, Description/Button/kebab on the right), as opposed to the
// standalone card in ./accordion-card.tsx. Clicking anywhere on a row
// toggles it; the checkbox/button/kebab are real nested controls that stop
// propagation so they don't also toggle the row (same `nativeButton={false}`
// + `render={<div/>}` technique SelectTrigger uses for its nested clear
// button, since Base UI's Trigger is a real <button> by default and can't
// contain other interactive elements).

const ITEM_VALUE = "item"

type DescriptionType =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"

const DESCRIPTION_COLOR: Record<DescriptionType, string> = {
  default: "text-[var(--accordion-list-description-default-fg)]",
  success: "text-[var(--accordion-list-description-success-fg)]",
  attention: "text-[var(--accordion-list-description-attention-fg)]",
  error: "text-[var(--accordion-list-description-error-fg)]",
  information: "text-[var(--accordion-list-description-information-fg)]",
}

const TITLE_SIZE = {
  h3: "text-h3",
  h4: "text-h4",
} as const

interface AccordionListItemProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  titleAs?: "h3" | "h4"
  showCheckbox?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  description?: React.ReactNode
  descriptionType?: DescriptionType
  showButtons?: boolean
  buttonsType?: "button" | "dropdown" | "both"
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  onMoreClick?: () => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function AccordionListItem({
  title,
  subtitle,
  titleAs = "h3",
  showCheckbox = false,
  checked,
  defaultChecked,
  onCheckedChange,
  description,
  descriptionType = "default",
  showButtons = false,
  buttonsType = "both",
  buttonLabel = "Button",
  onButtonClick,
  onMoreClick,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: AccordionListItemProps) {
  const controlled = open !== undefined
  const showButton = showButtons && buttonsType !== "dropdown"
  const showMore = showButtons && buttonsType !== "button"

  return (
    <AccordionPrimitive.Root
      data-slot="accordion-list-item"
      value={controlled ? (open ? [ITEM_VALUE] : []) : undefined}
      defaultValue={defaultOpen ? [ITEM_VALUE] : []}
      onValueChange={
        onOpenChange
          ? (value: string[]) => onOpenChange(value.includes(ITEM_VALUE))
          : undefined
      }
      className={cn("w-full bg-white", className)}
    >
      <AccordionPrimitive.Item value={ITEM_VALUE}>
        <AccordionPrimitive.Header render={titleAs === "h4" ? <h4 /> : <h3 />}>
          <AccordionPrimitive.Trigger
            nativeButton={false}
            render={<div />}
            data-slot="accordion-list-trigger"
            // Без собственных отступов: в мастере строка `content
            // accordion` начинается прямо от края (Top-фрейм x=0..719,
            // дети от x=0) — отступы даёт контентный блок страницы, в
            // который компонент вкладывается.
            className="flex w-full cursor-pointer items-start gap-4 text-left outline-none focus-visible:focus-ring transition-colors [&[data-panel-open]_[data-slot=accordion-list-chevron]]:rotate-180"
          >
            {showCheckbox && (
              <span
                className="mt-0.5 shrink-0"
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <Checkbox
                  checked={checked}
                  defaultChecked={defaultChecked}
                  onCheckedChange={onCheckedChange}
                  aria-label={
                    typeof title === "string" ? `Выбрать: ${title}` : undefined
                  }
                />
              </span>
            )}

            {/* Колонка Title.Subtitle из мастера: `flex-1 flex-col gap-4`,
                внутри — строка Title (Text + Status) и под ней Subtitle
                (нода I42675:20084;50449:7206). Status («Подписано») живёт
                именно здесь, на строке заголовка, а не в группе кнопок —
                отсюда и претензия дизайн-чека №24, что он «располагается
                выше чем середина по кнопкам». */}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex w-full items-start gap-3">
                {/* Дизайн-чек №23: заголовок больше не обрезается в
                    многоточие. «Длинный текст становится многострочным, а
                    иконка шеврона ставится не по концу контейнера текста, а
                    ставится с небольшим пробелом от последнего символа в
                    конце строки, то есть располагается inline». Поэтому
                    шеврон — inline-элемент внутри самого текста, а не
                    отдельная flex-колонка: так он едет за последним словом
                    при переносе. В мастере он лежит во вложенном фрейме
                    `Text` (flex gap-12, items-end), что для одной строки
                    даёт тот же результат, а многострочный случай в
                    документации просто не нарисован.

                    Зазор до шеврона — единственная метрика, различающаяся
                    между размерами заголовка: 12px на H3 и 8px на H4
                    (Text-фрейм H3 — gap-[12px]; в H4 заголовок шириной 43
                    заканчивается на 43, а Box начинается на 51). */}
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[var(--accordion-list-title-fg)]",
                    TITLE_SIZE[titleAs]
                  )}
                >
                  {title}
                  <ChevronDownIcon
                    aria-hidden="true"
                    data-slot="accordion-list-chevron"
                    className={cn(
                      "inline-block size-4 shrink-0 align-middle text-[var(--accordion-list-icon-fg)] transition-transform duration-200",
                      titleAs === "h4" ? "ml-2" : "ml-3"
                    )}
                  />
                </span>

                {description && (
                  <span
                    className={cn(
                      // `py` из мастера (Status — `flex items-start py-[4px]`)
                      // центрирует 24px-строку в 32px-строке заголовка H3;
                      // на H4 строка заголовка 28px, поэтому 2px.
                      "shrink-0 text-right text-p1-medium",
                      titleAs === "h4" ? "py-0.5" : "py-1",
                      DESCRIPTION_COLOR[descriptionType]
                    )}
                  >
                    {description}
                  </span>
                )}
              </span>
              {subtitle && (
                // Подзаголовок в мастере тоже `w-full` без обрезки — переносится.
                <span className="text-p1-medium text-[var(--accordion-list-subtitle-fg)]">
                  {subtitle}
                </span>
              )}
            </span>

            <span className="flex shrink-0 items-start gap-4">
              {(showButton || showMore) && (
                <span className="flex items-start gap-2">
                  {showButton && (
                    <span onMouseDown={stopPropagation} onClick={stopPropagation}>
                      <Button
                        type="button"
                        variant="secondary-grey"
                        size="sm"
                        onClick={onButtonClick}
                      >
                        {buttonLabel}
                      </Button>
                    </span>
                  )}
                  {showMore && (
                    <span onMouseDown={stopPropagation} onClick={stopPropagation}>
                      <Button
                        type="button"
                        variant="secondary-grey"
                        size="sm"
                        icon={Ellipsis}
                        iconPosition="only"
                        aria-label="Ещё"
                        onClick={onMoreClick}
                      />
                    </span>
                  )}
                </span>
              )}
            </span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        {children && (
          <AccordionPrimitive.Panel
            data-slot="accordion-list-panel"
            className="h-(--accordion-panel-height) overflow-hidden text-p2-regular transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
          >
            {/* The master puts the content Slot exactly 24px below the
                header (header ends at 60, Slot starts at 84) and runs it
                the full width of the row — no bottom or side inset of its
                own, now that the trigger no longer carries padding. */}
            <div className="pt-6">
              {children}
            </div>
          </AccordionPrimitive.Panel>
        )}
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

function AccordionList({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="accordion-list"
      role="list"
      // Просто стек строк с шагом 24px, без рамки и разделителей: в Figma
      // инстансы `ELK / content accordion` стоят один под другим с зазором
      // 24 (варианты 8/7: y = 0, 84, 168, 252, 336 при высоте строки 60)
      // внутри контентного блока страницы — «Компонент располагается внутри
      // контентного блока». Рамка + divide-y были изобретением кита.
      className={cn("flex w-full flex-col gap-6", className)}
    >
      {children}
    </div>
  )
}

export { AccordionList, AccordionListItem }
