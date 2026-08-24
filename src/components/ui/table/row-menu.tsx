import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Ellipsis } from "@/icons"
import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/ui/dropdown"

// The "..." action trigger for Title Cell's Button type — a Menu built the
// same way as `ButtonMenuOverflow`, at icon-sm size and `secondary-white`
// (bg white/hover Grey114/active Grey106, pixel-confirmed against the spec's
// own Default/Hover/Active kebab swatch — no bespoke "ghost" button variant
// needed). Row actions use `SelectionButton` instead, which the spec names
// directly ("используя белый компонент Selection Button").
function TableRowMenu({
  menu,
  label = "Открыть меню строки",
}: {
  menu: React.ReactNode
  label?: string
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-white"
            size="sm"
            icon={Ellipsis}
            iconPosition="only"
            aria-label={label}
          />
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="table-row-menu-content"
            render={<Dropdown className="min-w-48 overflow-hidden" />}
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

export { TableRowMenu }
