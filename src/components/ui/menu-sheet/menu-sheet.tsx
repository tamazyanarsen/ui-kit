import * as React from "react"

import { cn } from "@/lib/utils"
import { DropdownItem } from "@/components/ui/dropdown"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

// MenuSheet — мобильная форма выпадающего списка: штора `Modal` кита со
// строками во всю ширину вместо поповера у триггера.
//
// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“» и правило каркаса «Выпадающие списки в мобильном виде — шторы»:
// уже 1280 ни один список не раскрывается поповером. Для меню действий и
// одиночного выбора (`SelectionButton`, «…»/«Ещё» `ButtonMenuOverflow`,
// `Select`) штора одна и та же:
//   • заголовок — подпись триггера, крестик справа (крестик и затемнение —
//     от `ModalContent`);
//   • строки во всю ширину — та же строка `DropdownItem`, что в поповере
//     (`menu-row`: наведение Grey 114, нажатие Grey 124, сжатие содержимого
//     одной обёрткой); у одиночного выбора — галка у выбранного;
//   • нажатие на строку выполняет действие (применяет выбор) и закрывает
//     штору; кнопок внизу нет;
//   • выбор внутри уже открытой модалки — вторая штора поверх: это обычный
//     вложенный `Dialog` Base UI, ничего особого не нужно.
// Шторы фильтров (чекбоксы, «Применить»/«Сбросить») собраны в
// `FilterShell` — у них подвал с кнопками и черновик выбора.
//
// Строки берут `close` из контекста: так оболочки (`ButtonMenuOverflowItem`,
// `SelectItem`) рисуют строку шторы вместо пункта примитива, не зная, кто
// именно их открыл.

interface MenuSheetContextValue {
  close: () => void
}

const MenuSheetContext = React.createContext<MenuSheetContextValue | null>(null)

/** Внутри ли шторы `MenuSheet` — оболочки пунктов рисуют тогда строку шторы. */
function useMenuSheet() {
  return React.useContext(MenuSheetContext)
}

interface MenuSheetProps {
  /** Заголовок шторы — подпись триггера или название списка. */
  title: React.ReactNode
  /** Элемент триггера. Без него штора открывается только через `open`. */
  trigger?: React.ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Роль списка: `menu` — действия (умолчание), `listbox` — поле выбора. */
  role?: "menu" | "listbox"
  /** Строки — `MenuSheetItem` (или оболочки, которые его рисуют). */
  children?: React.ReactNode
  className?: string
}

function focusableRows(list: HTMLElement) {
  return Array.from(
    list.querySelectorAll<HTMLElement>(
      '[data-menu-sheet-item]:not([aria-disabled="true"])'
    )
  )
}

function MenuSheet({
  title,
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  role = "menu",
  children,
  className,
}: MenuSheetProps) {
  const [ownOpen, setOwnOpen] = React.useState(defaultOpen)
  const isOpen = open ?? ownOpen
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setOwnOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )
  const context = React.useMemo(() => ({ close: () => setOpen(false) }), [setOpen])

  // Стрелки ходят по строкам, Home/End — к крайним: как в поповере.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"]
    if (!keys.includes(event.key)) return
    const rows = focusableRows(event.currentTarget)
    if (rows.length === 0) return
    event.preventDefault()
    const index = rows.indexOf(document.activeElement as HTMLElement)
    let next = 0
    if (event.key === "End") next = rows.length - 1
    else if (event.key === "ArrowDown") next = index < 0 ? 0 : (index + 1) % rows.length
    else if (event.key === "ArrowUp")
      next = index < 0 ? rows.length - 1 : (index - 1 + rows.length) % rows.length
    rows[next]?.focus()
  }

  return (
    <Modal open={isOpen} onOpenChange={setOpen}>
      {trigger && <ModalTrigger render={trigger} />}
      <ModalContent size="m" data-slot="menu-sheet" className={className}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        {/* Строки — от края до края шторы: поля 16 у самой строки. Снизу
            запас 16, чтобы последняя строка не прилипала к краю экрана. */}
        <ModalBody className="p-0 pb-4">
          <MenuSheetContext.Provider value={context}>
            <div
              role={role}
              data-slot="menu-sheet-list"
              className="flex flex-col"
              onKeyDown={handleKeyDown}
            >
              {children}
            </div>
          </MenuSheetContext.Provider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface MenuSheetItemProps
  extends Omit<React.ComponentProps<"div">, "children" | "onSelect"> {
  text: React.ReactNode
  description?: React.ReactNode
  /**
   * Отметка одиночного выбора: не задано — строка действия (`menuitem`) без
   * галки; `true`/`false` — `menuitemradio` (или `option` в `listbox`) с
   * местом под галку, галка у выбранной.
   */
  checked?: boolean
  disabled?: boolean
  /** Действие строки; штора закрывается после него. */
  onSelect?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  /** Роль строки, если она не следует из `checked` (например, `option`). */
  role?: string
  /** Закрывать штору после нажатия (умолчание). `false` — множественный выбор. */
  closeOnSelect?: boolean
}

function isFocusVisible(element: Element) {
  try {
    return element.matches(":focus-visible")
  } catch {
    return true
  }
}

/** Строка шторы `MenuSheet`: нажатие выполняет `onSelect` и закрывает штору. */
const MenuSheetItem = React.forwardRef<HTMLDivElement, MenuSheetItemProps>(
  function MenuSheetItem(
    {
      text,
      description,
      checked,
      disabled = false,
      onSelect,
      role,
      closeOnSelect = true,
      className,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) {
    const sheet = useMenuSheet()
    // Подсветка с клавиатуры — та же, что даёт Base UI пунктам поповера
    // (`data-highlighted`); открытие пальцем фокус на строку не ставит.
    const [highlighted, setHighlighted] = React.useState(false)
    const resolvedRole = role ?? (checked === undefined ? "menuitem" : "menuitemradio")

    function activate(
      event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) {
      if (disabled) return
      onSelect?.(event)
      if (closeOnSelect) sheet?.close()
    }

    return (
      <DropdownItem
        ref={ref}
        data-slot="menu-sheet-item"
        {...props}
        text={text}
        description={description}
        checked={checked}
        role={resolvedRole}
        aria-checked={checked === undefined || resolvedRole === "option" ? undefined : checked}
        aria-selected={resolvedRole === "option" ? Boolean(checked) : undefined}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? "" : undefined}
        data-highlighted={highlighted ? "" : undefined}
        data-menu-sheet-item=""
        tabIndex={disabled ? -1 : 0}
        className={cn("w-full", className)}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) activate(event)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            activate(event)
          }
        }}
        onFocus={(event) => {
          onFocus?.(event)
          if (isFocusVisible(event.currentTarget)) setHighlighted(true)
        }}
        onBlur={(event) => {
          onBlur?.(event)
          setHighlighted(false)
        }}
      />
    )
  }
)

export { MenuSheet, MenuSheetItem, useMenuSheet }
export type { MenuSheetProps, MenuSheetItemProps }
