import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
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
const TEXT_SIZE = { lg: "text-base", md: "text-sm" }

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
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 border-transparent pb-2 font-medium whitespace-nowrap outline-none transition-colors",
        "text-[var(--tabs-fg)] hover:border-[var(--tabs-underline-hover)]",
        "data-active:border-[var(--tabs-underline-active)] data-active:font-semibold data-active:text-[var(--tabs-fg-active)]",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:text-[var(--tabs-fg-disabled)]",
        TEXT_SIZE[size]
      )}
    >
      {item.label}
      {item.badge !== undefined && (
        <Badge type="counter" value={item.badge} color="light-grey" disabled={item.disabled} />
      )}
      {item.status && <Badge type="point" color="red" disabled={item.disabled} />}
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
      className={cn("relative flex items-center", className)}
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
                className={cn(
                  "flex shrink-0 cursor-pointer items-center justify-center border-b-2 border-transparent pb-2 text-[var(--tabs-fg)] outline-none transition-colors hover:border-[var(--tabs-underline-hover)]"
                )}
              />
            }
          >
            <Ellipsis aria-hidden="true" className={ELLIPSIS_ICON_SIZE[size]} />
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
                className="min-w-48 origin-(--transform-origin) rounded-2xl bg-white p-2 shadow-lg ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
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
