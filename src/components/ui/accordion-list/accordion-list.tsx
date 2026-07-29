import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon, Ellipsis } from "lucide-react"

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
  h3: "text-base",
  h4: "text-sm",
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
            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left outline-none transition-colors [&[data-panel-open]_[data-slot=accordion-list-chevron]]:rotate-180"
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

            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "truncate font-semibold text-[var(--accordion-list-title-fg)]",
                    TITLE_SIZE[titleAs]
                  )}
                >
                  {title}
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  data-slot="accordion-list-chevron"
                  className="size-4 shrink-0 text-[var(--accordion-list-icon-fg)] transition-transform duration-200"
                />
              </span>
              {subtitle && (
                <span className="truncate text-xs text-[var(--accordion-list-subtitle-fg)]">
                  {subtitle}
                </span>
              )}
            </span>

            <span className="flex shrink-0 items-center gap-2 self-center">
              {description && (
                <span
                  className={cn("text-sm", DESCRIPTION_COLOR[descriptionType])}
                >
                  {description}
                </span>
              )}
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
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        {children && (
          <AccordionPrimitive.Panel
            data-slot="accordion-list-panel"
            className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
          >
            <div className={cn("pb-3", showCheckbox ? "pl-11" : "pl-4", "pr-4")}>
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
      className={cn(
        "w-full divide-y divide-[var(--accordion-list-divider)] overflow-hidden rounded-2xl border border-[var(--accordion-list-border)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export { AccordionList, AccordionListItem }
