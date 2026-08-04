import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
import { useOverflowCount } from "@/lib/use-overflow-count"

// Tabs — "Табы": underline-style tab bar. Large is a 1st-level tab, Medium
// a 2nd-level one (per the spec's own "Использование" note). Value is a
// literal item count (2–12) — that's a content constraint, not something
// this component enforces; it just renders however many `items` it's given.
//
// Overflow ("Show More"): once the row doesn't fit, the trailing tabs move
// behind a "..." trigger that opens a dropdown (spec: "часть табов может
// скрываться в многоточие. При клике на иконку многоточия открывается
// Dropdown"). Reuses ButtonMenuOverflowItem for the list rows — same
// component `button-menu/overflow.tsx` already built for exactly this
// "Text / Text" popup — but the trigger itself is custom-styled here since
// Tabs' own anatomy calls for a plain inline ellipsis, not ButtonMenu's
// bordered secondary-grey button.
interface TabItem {
  value: string
  label: React.ReactNode
  badge?: number
  status?: boolean
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: "lg" | "md"
  showMore?: boolean
  className?: string
}

const GAP = { lg: 32, md: 24 }
const ELLIPSIS_RESERVED = { lg: 44, md: 32 }
const ELLIPSIS_ICON_SIZE = { lg: "size-6", md: "size-4" }
const TEXT_SIZE = { lg: "text-p1-medium", md: "text-p2-medium" }

function TabButton({
  item,
  size,
  active,
  onClick,
  innerRef,
}: {
  item: TabItem
  size: "lg" | "md"
  active: boolean
  onClick?: () => void
  innerRef?: (el: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={innerRef}
      type="button"
      disabled={item.disabled}
      onClick={onClick}
      data-slot="tabs-item"
      data-active={active || undefined}
      className="group flex shrink-0 cursor-pointer flex-col items-center gap-4 outline-none disabled:cursor-not-allowed"
    >
      <span
        className={cn(
          // Weight lives in TEXT_SIZE's text-pN-medium below, not here.
          "flex items-center whitespace-nowrap transition-colors",
          item.badge !== undefined ? "gap-2" : "gap-1",
          "text-[var(--tabs-fg)] group-hover:text-[var(--tabs-fg)]",
          "group-data-active:text-[var(--tabs-fg-active)]",
          "group-disabled:text-[var(--tabs-fg-disabled)]",
          TEXT_SIZE[size]
        )}
      >
        {item.label}
        {item.badge !== undefined && (
          <Badge type="counter" value={item.badge} color="black" disabled={!active} />
        )}
        {item.status && <Badge type="point" color="red" disabled={item.disabled} />}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "h-1 w-full shrink-0 rounded-t-[4px] transition-colors",
          active
            ? "bg-[var(--tabs-underline-active)]"
            : "bg-transparent group-hover:bg-[var(--tabs-underline-hover)] group-disabled:bg-transparent"
        )}
      />
    </button>
  )
}

function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "lg",
  showMore = true,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.value
  )
  const activeValue = value ?? internalValue

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    items.length,
    ELLIPSIS_RESERVED[size]
  )

  const effectiveVisible = showMore ? visibleCount : items.length
  const visibleItems = items.slice(0, effectiveVisible)
  const hiddenItems = items.slice(effectiveVisible)
  const hasOverflow = hiddenItems.length > 0

  return (
    <div
      ref={containerRef}
      data-slot="tabs"
      className={cn(
        "relative flex items-center border-b border-[var(--tabs-border)]",
        className
      )}
      style={{ gap: GAP[size] }}
    >
      {visibleItems.map((item) => (
        <TabButton
          key={item.value}
          item={item}
          size={size}
          active={item.value === activeValue}
          onClick={() => !item.disabled && setValue(item.value)}
        />
      ))}

      {hasOverflow && (
        <MenuPrimitive.Root modal={false}>
          <MenuPrimitive.Trigger
            render={
              <button
                type="button"
                aria-label="Ещё"
                data-slot="tabs-overflow-trigger"
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-4 text-[var(--tabs-fg)] outline-none"
              />
            }
          >
            <Ellipsis aria-hidden="true" className={ELLIPSIS_ICON_SIZE[size]} />
            <span
              aria-hidden="true"
              className="h-1 w-full shrink-0 rounded-t-[4px] bg-transparent transition-colors group-hover:bg-[var(--tabs-underline-hover)]"
            />
          </MenuPrimitive.Trigger>
          <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
              side="bottom"
              align="start"
              sideOffset={8}
              className="isolate z-50"
            >
              <MenuPrimitive.Popup
                data-slot="tabs-overflow-content"
                render={<Dropdown className="min-w-48 overflow-hidden" />}
              >
                {hiddenItems.map((item) => (
                  <ButtonMenuOverflowItem
                    key={item.value}
                    text={item.label}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && setValue(item.value)}
                  />
                ))}
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        </MenuPrimitive.Root>
      )}

      {/* Off-screen measurement copy — always renders every item (unlike
          the visible row, which drops items behind the overflow trigger)
          so useOverflowCount always has a real width to measure, even for
          items currently tucked away in the dropdown. */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 flex"
        style={{ gap: GAP[size] }}
      >
        {items.map((item, index) => (
          <TabButton
            key={item.value}
            item={item}
            size={size}
            active={item.value === activeValue}
            innerRef={(el) => {
              itemRefs.current[index] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { Tabs }
export type { TabsProps, TabItem }
