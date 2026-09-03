import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "@/icons"

import { cn } from "@/lib/utils"

// AccordionCard — the standalone "card" accordion from the spec (`ELK /
// accordion`, node 70333:4508 — Title + Subtitle header, Default/Blocked
// color type, Desktop/Mobile sizes). Distinct from the plain text-row
// Accordion in `src/demo/scaffold`, which is only used for this repo's own
// docs-page chrome and has a different visual language (no card background,
// no subtitle, always-visible trailing chevron on the whole row), and from
// AccordionList (`ELK / content accordion`). Each card owns its own
// single-item Base UI Accordion.Root, so multiple cards stacked on a page
// open/close independently.
const ITEM_VALUE = "item"

interface AccordionCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  blocked?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
}

function AccordionCard({
  title,
  subtitle,
  blocked = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: AccordionCardProps) {
  const controlled = open !== undefined

  return (
    <AccordionPrimitive.Root
      data-slot="accordion-card"
      value={controlled ? (open ? [ITEM_VALUE] : []) : undefined}
      defaultValue={defaultOpen ? [ITEM_VALUE] : []}
      onValueChange={
        onOpenChange
          ? (value: string[]) => onOpenChange(value.includes(ITEM_VALUE))
          : undefined
      }
      className={cn(
        "w-full overflow-hidden rounded-[12px]",
        blocked
          ? "bg-[var(--accordion-card-blocked-bg)]"
          : "bg-[var(--accordion-card-bg)]",
        className
      )}
    >
      <AccordionPrimitive.Item value={ITEM_VALUE}>
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger
            data-slot="accordion-card-trigger"
            className={cn(
              // Mobile (`Size=Mobile`, node 70333:4514): the whole header
              // shrinks — 16px padding instead of 24, 16px between text and
              // chevron instead of 24, H4 Mobile / P1 Medium Mobile type.
              // The 4px title↔subtitle gap and the 16px chevron are the same
              // in both forms.
              "flex w-full flex-col gap-1 p-4 text-left outline-none focus-visible:focus-ring transition-colors desktop:p-6 [&[data-panel-open]_svg]:rotate-180",
              blocked
                ? "hover:bg-[var(--accordion-card-blocked-bg-hover)]"
                : "hover:bg-[var(--accordion-card-bg-hover)]"
            )}
          >
            {/* `items-start`: the chevron is pinned to the top of the title
                line (Figma puts it at y=24, i.e. exactly the card's own top
                padding), not vertically centred on the 28px line — centring
                dropped it 6px lower than the master. */}
            <span className="flex items-start justify-between gap-4 desktop:gap-6">
              <span className="text-h4-mobile text-[var(--accordion-card-title-fg)] desktop:text-h4">
                {title}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--accordion-card-icon-fg)] transition-transform duration-200"
              />
            </span>
            {subtitle && (
              <span className="text-p2-medium text-[var(--accordion-card-subtitle-fg)] desktop:text-p1-medium">
                {subtitle}
              </span>
            )}
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        {children && (
          <AccordionPrimitive.Panel
            data-slot="accordion-card-panel"
            className="h-(--accordion-panel-height) overflow-hidden text-p2-regular transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
          >
            {/* Header/content divider — confirmed against get_design_context
                literal output for the Open=True variants (both Default and
                Blocked types): "Content" carries border-t grey-134/#DEDEDE
                plus its own 24px top padding, on top of the header's own
                24px bottom padding. A prior audit pass concluded there was
                no divider based on a vector-source re-check that didn't
                hold up against this literal data. */}
            <div className="border-t border-[var(--accordion-card-divider)] p-4 desktop:p-6">
              {children}
            </div>
          </AccordionPrimitive.Panel>
        )}
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

export { AccordionCard }
