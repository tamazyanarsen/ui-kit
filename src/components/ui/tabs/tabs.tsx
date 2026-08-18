import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon, type IconName } from "@/components/ui/icon"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Dropdown } from "@/components/ui/dropdown"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { useIsDesktop } from "@/lib/use-is-desktop"

// Tabs — "Табы": underline-style tab bar. Value is a literal item count
// (2–12) — that's a content constraint, not something this component
// enforces; it just renders however many `items` it's given.
//
// `ELK / tabs` v1.2.0 replaced the old Large/Medium *level* property with a
// responsive Size=Desktop/Mobile pair, so the bar now switches with the
// viewport instead of a prop: 44px tall with a 32px gap, 16/24 labels and a
// 24px overflow glyph from `desktop:` up; 40px / 24px / 14/20 / 16px below it.
// (The two old sizes happened to hold exactly these two sets of numbers.)
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
  /**
   * `Type=Icon` компонент-сета `Tabs (ELK)` — иконка перед подписью.
   * Имя из набора кита либо готовый узел.
   */
  icon?: IconName | React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  showMore?: boolean
  className?: string
}

// The gap and the room reserved for the "…" trigger feed the JS overflow
// measurement, so they can't be CSS-only like the type sizes below.
const GAP = { desktop: 32, mobile: 24 }
const ELLIPSIS_RESERVED = { desktop: 44, mobile: 32 }

function TabButton({
  item,
  active,
  onClick,
  innerRef,
}: {
  item: TabItem
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
          "text-p2-medium desktop:text-p1-medium"
        )}
      >
        {typeof item.icon === "string" ? (
          <Icon name={item.icon} aria-hidden="true" className="size-4 shrink-0" />
        ) : (
          item.icon
        )}
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
  showMore = true,
  className,
}: TabsProps) {
  const isDesktop = useIsDesktop()
  const sizeKey = isDesktop ? "desktop" : "mobile"
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
    ELLIPSIS_RESERVED[sizeKey]
  )

  const effectiveVisible = showMore ? visibleCount : items.length
  const visibleItems = items.slice(0, effectiveVisible)
  const hiddenItems = items.slice(effectiveVisible)
  const hasOverflow = hiddenItems.length > 0

  return (
    <div
      ref={containerRef}
      data-slot="tabs"
      // ⚠️ Разделитель — ВНУТРЕННЯЯ тень, а не `border-bottom`. Разделитель
      // 1px и линия активного таба 4px лежат в макете на одном месте: в
      // Figma stroke фрейма не занимает layout, а `border` при
      // `box-sizing: border-box` добавляет свой пиксель сверху. Замер до
      // правки: обёртка 45 при табе 44 — то есть весь ряд разъезжался с
      // соседними блоками на пиксель, и всё, что центрируется, вставало на
      // полпикселя выше. Та же грабля, что с линией под шапкой таблицы.
      className={cn(
        "relative flex items-center shadow-[inset_0_-1px_0_0_var(--tabs-border)]",
        className
      )}
      style={{ gap: GAP[sizeKey] }}
    >
      {visibleItems.map((item) => (
        <TabButton
          key={item.value}
          item={item}
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
                // The mobile glyph is 16px against a 20px label line, so
                // Figma pads it 2px and widens the gap to 18px to keep the
                // trigger the full 40px — otherwise its underline floats
                // above the bar's bottom border.
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-[18px] pt-0.5 text-[var(--tabs-fg)] outline-none desktop:gap-4 desktop:pt-0"
              />
            }
          >
            <Ellipsis aria-hidden="true" className="size-4 desktop:size-6" />
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
        style={{ gap: GAP[sizeKey] }}
      >
        {items.map((item, index) => (
          <TabButton
            key={item.value}
            item={item}
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
