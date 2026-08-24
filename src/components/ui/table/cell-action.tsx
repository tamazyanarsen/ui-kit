import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  SelectionButton,
  type SelectionButtonItem,
} from "@/components/ui/selection-button"
import { Tooltip } from "@/components/ui/tooltip"

import { TableRowMenu } from "./row-menu"

/** The single-action form: "Для строк с единственным действием допускается
 * замена на кнопку с пиктограммой и обязательной текстовой подсказкой при
 * наведении, поясняющей её назначение" — hence `label` is required, it is
 * both the tooltip and the accessible name. */
interface TableRowAction {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  onClick?: () => void
}

interface TableCellActionProps {
  /** Одиночное действие. Выигрывает у `actions` и у `menu`. */
  action?: TableRowAction
  /** Набор действий — спековая форма, белый `SelectionButton`. */
  actions?: SelectionButtonItem[]
  /** Escape hatch для своего попапа (`ButtonMenuOverflowItem` детьми). */
  menu?: React.ReactNode
}

/** Действия строки: одиночная кнопка, набор действий или своё меню. */
function TableCellAction({ action, actions, menu }: TableCellActionProps) {
  if (action) {
    return (
      <Tooltip content={action.label}>
        <Button
          variant="secondary-white"
          size="sm"
          icon={action.icon}
          iconPosition="only"
          aria-label={action.label}
          onClick={(event) => {
            event.stopPropagation()
            action.onClick?.()
          }}
        />
      </Tooltip>
    )
  }

  if (actions && actions.length > 0) {
    return (
      <SelectionButton
        items={actions}
        size="sm"
        direction="down-left"
        triggerLabel="Действия со строкой"
      />
    )
  }

  return menu ? <TableRowMenu menu={menu} /> : null
}

export { TableCellAction }
export type { TableCellActionProps, TableRowAction }
