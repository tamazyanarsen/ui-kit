import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, ChevronUpIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { POPUP_COLLISION } from "@/lib/popup-position"
import { Dropdown } from "@/components/ui/dropdown"
import { MenuSheet } from "@/components/ui/menu-sheet"

import { useSelectSheet } from "./sheet"

/**
 * Окно списка. В мобильном виде (Правки UI-Kit от 25.10) — штора
 * `MenuSheet` вместо поповера: заголовок — `sheetTitle`, иначе подпись поля
 * (`label` у `SelectTrigger`); строки во всю ширину, у выбранной галка,
 * нажатие применяет выбор и закрывает штору.
 */
export function SelectContent({
  className,
  children,
  sheetTitle,
  side = "bottom",
  // По макету: зазор 8px между триггером и выпадающим списком.
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  // Якорь под триггером, как у обычного поповера, а не наложение поверх
  // него с выравниванием по выбранному пункту (как у нативного <select>):
  // дизайн всегда открывает список ниже (или выше у края вьюпорта) и
  // никогда не перекрывает триггер.
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    /** Заголовок мобильной шторы. Не задан — подпись поля. */
    sheetTitle?: React.ReactNode
  }) {
  const sheet = useSelectSheet()
  if (sheet) {
    return (
      <MenuSheet
        role="listbox"
        title={sheetTitle ?? sheet.titleRef.current}
        open={sheet.open}
        // `className` окна (ширина поповера) к шторе не относится.
        onOpenChange={(next) => sheet.setOpen(next)}
      >
        {children}
      </MenuSheet>
    )
  }
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={POPUP_COLLISION}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          render={
            <Dropdown
              className={cn(
                // themed-scrollbar: выпадающий список в макете несёт
                // внутри своего перечня `ELK / scrollbar`. Здесь областью
                // прокрутки служит само всплывающее окно, поэтому класс
                // достаётся ему, а не вкладывается компонент Scrollbar.
                "themed-scrollbar relative z-50 w-(--anchor-width) min-w-36 overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
              )}
            />
          }
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export { SelectScrollUpButton, SelectScrollDownButton }
