import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SelectionButton } from "@/components/ui/selection-button"

import { Tooltip } from "./tooltip"

// r27: `<SelectionButton trigger={<Tooltip><Button/></Tooltip>}>` — способ
// повесить подсказку на кнопку меню. Меню клонирует trigger, отдавая ему ref
// и свои обработчики; Tooltip (функция без forwardRef) их терял, и меню не
// открывалось вовсе. Теперь пропсы и ref уходят на дочерний элемент.

describe("Tooltip как trigger чужого меню", () => {
  it("меню открывается кликом, а подсказка — наведением", async () => {
    const user = userEvent.setup()
    render(
      <SelectionButton
        items={[{ text: "Пункт меню" }]}
        trigger={
          <Tooltip content="Подсказка кнопки">
            <button type="button">Действия</button>
          </Tooltip>
        }
      />
    )
    const button = screen.getByRole("button", { name: "Действия" })
    await user.hover(button)
    await waitFor(() => expect(screen.getByText("Подсказка кнопки")).toBeInTheDocument(), {
      timeout: 2000,
    })
    await user.click(button)
    await waitFor(() => expect(screen.getByText("Пункт меню")).toBeInTheDocument())
  })

  it("ref уходит на дочерний элемент", () => {
    const ref = { current: null as HTMLElement | null }
    render(
      <Tooltip content="x" ref={ref}>
        <button type="button">Кнопка</button>
      </Tooltip>
    )
    expect(ref.current).toBe(screen.getByRole("button", { name: "Кнопка" }))
  })
})
