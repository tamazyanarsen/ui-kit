import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"

// SelectionButton — "Кнопка выбора": a trigger paired with a Select/Dropdown
// -style popup list, used to hide overflow functionality that doesn't fit
// the visible UI. Per the spec, the trigger and the list are configured
// independently ("настройки кнопки указаны в разделе Button, а настройки
// списка — в этом разделе"): the default trigger is just `Button` sized by
// `size` (L = 56px icon-lg, S = 32px icon-sm, both `secondary-white`), but
// any trigger element can be passed in (e.g. a labeled Button with a
// trailing chevron, as shown in the "Использование в макете" example).
// `direction` is the popup's open corner relative to the trigger — the spec
// names it by which way the list expands (e.g. "Top Right" = expands
// up-and-right, so the trigger sits at the list's bottom-left corner).
export type SelectionButtonSize = "lg" | "sm"
export type SelectionButtonDirection =
  | "top-left"
  | "top-right"
  | "down-left"
  | "down-right"

interface SelectionButtonItem {
  text: React.ReactNode
  description?: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
}

interface SelectionButtonProps {
  items: SelectionButtonItem[]
  size?: SelectionButtonSize
  direction?: SelectionButtonDirection
  showDropdown?: boolean
  trigger?: React.ReactElement
  triggerLabel?: string
  modal?: boolean
  className?: string
}

const PLACEMENT: Record<
  SelectionButtonDirection,
  { side: "top" | "bottom"; align: "start" | "end" }
> = {
  "top-right": { side: "top", align: "start" },
  "top-left": { side: "top", align: "end" },
  "down-right": { side: "bottom", align: "start" },
  "down-left": { side: "bottom", align: "end" },
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function SelectionButton({
  items,
  size = "lg",
  direction = "down-right",
  showDropdown = true,
  trigger,
  triggerLabel = "Ещё",
  modal = false,
  className,
}: SelectionButtonProps) {
  const resolvedTrigger = trigger ?? (
    <Button
      variant="secondary-white"
      size={size === "lg" ? "lg" : "sm"}
      icon={Ellipsis}
      iconPosition="only"
      aria-label={triggerLabel}
    />
  )

  if (!showDropdown) {
    return resolvedTrigger
  }

  const { side, align } = PLACEMENT[direction]

  return (
    <MenuPrimitive.Root modal={modal}>
      <span onMouseDown={stopPropagation} onClick={stopPropagation}>
        <MenuPrimitive.Trigger render={resolvedTrigger} />
      </span>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="selection-button-content"
            render={<Dropdown className={cn("min-w-56 p-2", className)} />}
          >
            {items.map((item, index) => (
              <MenuPrimitive.Item
                key={index}
                disabled={item.disabled}
                onClick={item.onSelect}
                data-slot="selection-button-item"
                render={<DropdownItem text={item.text} description={item.description} />}
              />
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { SelectionButton }
export type { SelectionButtonProps, SelectionButtonItem }
