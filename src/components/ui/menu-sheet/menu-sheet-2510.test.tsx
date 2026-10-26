import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectionButton } from "@/components/ui/selection-button"
import { TableRowMenu } from "@/components/ui/table/row-menu"

// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (jsdom — всегда мобильный) SelectionButton, «…»
// ButtonMenuOverflow и Select открывают штору Modal, а не поповер.

const ITEMS = [
  { id: "list", text: "Списком" },
  { id: "cards", text: "Карточками" },
]

function sheet() {
  return screen.getByRole("dialog")
}

describe("SelectionButton: мобильная штора", () => {
  it("нажатие открывает штору с заголовком-подписью, без поповера; строка выполняет действие и закрывает", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onRowClick = vi.fn()
    render(
      <div onClick={onRowClick}>
        <SelectionButton items={[{ id: "a", text: "Скачать", onSelect }]} />
      </div>
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))

    expect(sheet()).toHaveAttribute("data-slot", "menu-sheet")
    expect(within(sheet()).getByRole("heading", { name: "Ещё" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="selection-button-content"]')).toBeNull()
    // Кнопок внизу нет — только крестик.
    expect(document.querySelector('[data-slot="modal-footer"]')).toBeNull()

    const row = within(sheet()).getByRole("menuitem", { name: "Скачать" })
    expect(row).toHaveClass("menu-row", "w-full")
    await user.click(row)
    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    // Ни нажатие триггера, ни строка шторы не провалились в строку-родителя.
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("с value — галка у выбранного; sheetTitle задаёт заголовок; текстовый триггер даёт заголовок сам", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <SelectionButton items={ITEMS} value="cards" sheetTitle="Вид списка" />
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(within(sheet()).getByRole("heading", { name: "Вид списка" })).toBeInTheDocument()
    const radios = within(sheet()).getAllByRole("menuitemradio")
    expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual(["false", "true"])
    expect(radios[1].querySelector('[data-slot="dropdown-item-check"]')).not.toBeNull()
    unmount()

    render(
      <SelectionButton items={ITEMS} trigger={<Button variant="secondary-grey">Режим</Button>} />
    )
    await user.click(screen.getByRole("button", { name: "Режим" }))
    expect(within(sheet()).getByRole("heading", { name: "Режим" })).toBeInTheDocument()
  })

  it("внутри открытой модалки — вторая штора поверх первой", async () => {
    const user = userEvent.setup()
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Реквизиты</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <SelectionButton items={ITEMS} />
          </ModalBody>
        </ModalContent>
      </Modal>
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    // Первая модалка остаётся открытой под шторой (Base UI прячет её от
    // вспомогательных технологий, пока сверху вложенная).
    const dialogs = await screen.findAllByRole("dialog", { hidden: true })
    expect(dialogs).toHaveLength(2)
    const nested = document.querySelector('[data-slot="menu-sheet"]') as HTMLElement
    expect(nested).not.toBeNull()
    expect(within(nested).getByRole("menuitem", { name: "Списком" })).toBeInTheDocument()
  })
})

describe("ButtonMenuOverflow: мобильная штора", () => {
  it("«…» открывает штору «Ещё», пункты — строки шторы; sheetTitle меняет заголовок", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <ButtonMenuOverflow sheetTitle="Действия">
        <ButtonMenuOverflowItem text="Удалить" onClick={onDelete} />
        <ButtonMenuOverflowItem text="Архив" disabled />
      </ButtonMenuOverflow>
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(within(sheet()).getByRole("heading", { name: "Действия" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="button-menu-overflow-content"]')).toBeNull()
    const disabled = within(sheet()).getByRole("menuitem", { name: "Архив" })
    expect(disabled).toHaveAttribute("aria-disabled", "true")
    await user.click(within(sheet()).getByRole("menuitem", { name: "Удалить" }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})

const FRUITS = [
  { value: "apple", label: "Яблоко" },
  { value: "pear", label: "Груша" },
]

function FruitSelect({ onValueChange }: { onValueChange?: (v: string | null) => void }) {
  const [value, setValue] = useState<string | null>("apple")
  return (
    <form data-testid="form">
      <Select
        items={FRUITS}
        name="fruit"
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onValueChange?.(next)
        }}
      >
        <SelectTrigger label="Фрукт">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FRUITS.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  )
}

describe("Select: мобильная штора", () => {
  it("штора с заголовком-подписью поля, галка у выбранного, выбор применяется и закрывает", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FruitSelect onValueChange={onValueChange} />)
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveTextContent("Яблоко")

    await user.click(trigger)
    expect(within(sheet()).getByRole("heading", { name: "Фрукт" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="select-content"]')).toBeNull()
    expect(trigger).toHaveAttribute("data-popup-open")
    const options = within(sheet()).getAllByRole("option")
    expect(options.map((o) => o.getAttribute("aria-selected"))).toEqual(["true", "false"])
    expect(options[0].querySelector('[data-slot="dropdown-item-check"]')).not.toBeNull()

    await user.click(within(sheet()).getByRole("option", { name: "Груша" }))
    expect(onValueChange).toHaveBeenCalledWith("pear")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(trigger).toHaveTextContent("Груша")
    // Значение уходит в форму под тем же `name`.
    const form = screen.getByTestId("form") as HTMLFormElement
    expect(new FormData(form).get("fruit")).toBe("pear")
  })

  it("выключенное поле штору не открывает", async () => {
    const user = userEvent.setup()
    render(
      <Select items={FRUITS} disabled>
        <SelectTrigger label="Фрукт">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Яблоко</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

describe("TableRowMenu: мобильная штора", () => {
  it("«…» строки открывает штору «Действия», нажатие пункта не всплывает к строке", async () => {
    const user = userEvent.setup()
    const onRow = vi.fn()
    const onEdit = vi.fn()
    render(
      <div onClick={onRow}>
        <TableRowMenu menu={<ButtonMenuOverflowItem text="Изменить" onClick={onEdit} />} />
      </div>
    )
    await user.click(screen.getByRole("button", { name: "Открыть меню строки" }))
    expect(within(sheet()).getByRole("heading", { name: "Действия" })).toBeInTheDocument()
    await user.click(within(sheet()).getByRole("menuitem", { name: "Изменить" }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(onRow).not.toHaveBeenCalled()
  })
})
