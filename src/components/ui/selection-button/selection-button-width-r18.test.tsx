import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NAV_POPUP_WIDTH } from "@/components/ui/button-menu/popup-width"
import { TableRowMenu } from "@/components/ui/table/row-menu"

import { SelectionButton } from "./selection-button"

// Аудит 17: списки действий SelectionButton и меню строки таблицы брали
// ширину по самой длинной подписи — на телефоне раздвигали страницу вбок, а
// на десктопе растягивались до 770px в строку. Правка r17 (предел 400px)
// до них не дошла.

const expectCapped = (list: HTMLElement) => {
  for (const cls of NAV_POPUP_WIDTH.split(" ")) expect(list).toHaveClass(cls)
}

describe("Ширина меню действий", () => {
  it("SelectionButton — не шире 400px и окна без полей", async () => {
    const user = userEvent.setup()
    render(
      <SelectionButton
        items={[{ text: "Отправить документ на согласование руководителю подразделения" }]}
      />
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expectCapped(await screen.findByRole("menu"))
  })

  it("меню строки таблицы — тоже", async () => {
    const user = userEvent.setup()
    render(<TableRowMenu menu={<div>Пункт</div>} />)
    await user.click(screen.getByRole("button", { name: "Открыть меню строки" }))
    expectCapped(await screen.findByRole("menu"))
  })
})
