import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { useOverflowCount } from "@/lib/use-overflow-count"

// Switcher — "Cell Switcher / Переключатель": a segmented control (pill
// container + a sliding active pill), as opposed to Tabs' underline style.
// Same usage split as Tabs: Large for a 1st-level switcher, Medium for a
// 2nd-level one. `greyBackground` is the spec's own "Grey Background"
// property — Grey Solid (true, active segment goes white) vs White Solid
// (false, white container needs a border + a grey active segment for
// contrast). `activeVariant="black"` is the separate "Active Black" variant
// (a dark active pill, independent of the container background).
//
// Overflow behaves identically to Tabs (same "Show More" property, same
// dropdown-of-hidden-items mockup in the spec) — see tabs.tsx's own comment
// for why the trigger is hand-styled here rather than reusing
// ButtonMenuOverflow's trigger outright.
interface SwitcherItem {
  value: string
  label: React.ReactNode
  badge?: number
  disabled?: boolean
}

interface SwitcherProps {
  items: SwitcherItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: "lg" | "md"
  greyBackground?: boolean
  activeVariant?: "surface" | "black"
  disabled?: boolean
  showMore?: boolean
  className?: string
}

const GAP_PX = { lg: 8, md: 4 }
const GAP_CLASS = { lg: "gap-2", md: "gap-1" }
const SEGMENT_PADDING = { lg: "px-4 py-2 text-sm", md: "px-3 py-1.5 text-xs" }
const ELLIPSIS_RESERVED = { lg: 56, md: 40 }
const ELLIPSIS_ICON_SIZE = { lg: "size-6", md: "size-4" }

function SegmentButton({
  item,
  active,
  greyBackground,
  activeVariant,
  onClick,
  innerRef,
  className,
}: {
  item: SwitcherItem
  active: boolean
  greyBackground: boolean
  activeVariant: "surface" | "black"
  onClick?: () => void
  innerRef?: (el: HTMLButtonElement | null) => void
  className: string
}) {
  const activeBg =
    activeVariant === "black"
      ? "data-active:bg-[var(--switcher-active-black-bg)] data-active:text-[var(--switcher-active-black-fg)]"
      : greyBackground
        ? "data-active:bg-[var(--switcher-active-bg)] data-active:text-[var(--switcher-fg)]"
        : "data-active:bg-[var(--switcher-active-bg-on-white)] data-active:text-[var(--switcher-fg)]"

  return (
    <button
      ref={innerRef}
      type="button"
      disabled={item.disabled}
      onClick={onClick}
      data-slot="switcher-item"
      data-active={active || undefined}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap text-[var(--switcher-fg-inactive)] outline-none transition-colors not-data-active:hover:bg-[var(--switcher-hover-bg)] data-active:font-semibold disabled:cursor-not-allowed disabled:text-[var(--switcher-disabled-fg)] disabled:hover:bg-transparent",
        activeBg,
        className
      )}
    >
      {item.label}
      {item.badge !== undefined && (
        <Badge type="counter" value={item.badge} color="light-grey" disabled={item.disabled} />
      )}
    </button>
  )
}

function Switcher({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "lg",
  greyBackground = true,
  activeVariant = "surface",
  disabled = false,
  showMore = true,
  className,
}: SwitcherProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.value
  )
  const activeValue = value ?? internalValue

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  // A whole-switcher `disabled` (per the spec's own "Disabled" example,
  // which greys out every segment at once) layers on top of any item's own
  // `disabled` rather than replacing it.
  const resolvedItems = disabled ? items.map((item) => ({ ...item, disabled: true })) : items

  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    resolvedItems.length,
    ELLIPSIS_RESERVED[size]
  )

  const effectiveVisible = showMore ? visibleCount : resolvedItems.length
  const visibleItems = resolvedItems.slice(0, effectiveVisible)
  const hiddenItems = resolvedItems.slice(effectiveVisible)
  const hasOverflow = hiddenItems.length > 0

  return (
    <div
      ref={containerRef}
      data-slot="switcher"
      className={cn(
        "relative inline-flex items-center rounded-full p-1",
        greyBackground
          ? "bg-[var(--switcher-grey-bg)]"
          : "border border-[var(--switcher-border)] bg-[var(--switcher-white-bg)]",
        GAP_CLASS[size],
        className
      )}
    >
      {visibleItems.map((item) => (
        <SegmentButton
          key={item.value}
          item={item}
          active={item.value === activeValue}
          greyBackground={greyBackground}
          activeVariant={activeVariant}
          onClick={() => !item.disabled && setValue(item.value)}
          className={SEGMENT_PADDING[size]}
        />
      ))}

      {hasOverflow && (
        <MenuPrimitive.Root modal={false}>
          <MenuPrimitive.Trigger
            render={
              <button
                type="button"
                aria-label="Ещё"
                data-slot="switcher-overflow-trigger"
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-full px-2 py-2 text-[var(--switcher-fg-inactive)] outline-none transition-colors hover:bg-[var(--switcher-hover-bg)]"
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
                data-slot="switcher-overflow-content"
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

      {/* Off-screen measurement copy — see tabs.tsx's own comment; same
          reasoning applies here (items hidden behind the overflow trigger
          would otherwise report 0 width on the next recompute). */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 flex"
        style={{ gap: GAP_PX[size] }}
      >
        {resolvedItems.map((item, index) => (
          <SegmentButton
            key={item.value}
            item={item}
            active={item.value === activeValue}
            greyBackground={greyBackground}
            activeVariant={activeVariant}
            className={SEGMENT_PADDING[size]}
            innerRef={(el) => {
              itemRefs.current[index] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { Switcher }
export type { SwitcherProps, SwitcherItem }
