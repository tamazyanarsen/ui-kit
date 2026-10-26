import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { BlockWidgetHead } from "@/components/ui/block-widget"
import { Item } from "@/components/ui/item"
import { ItemInformationField } from "@/components/ui/item-information-field"

// Правки UI-Kit от 25.10, правило каркаса «Значок „Информация“ (i) в
// мобильном виде — штора с текстом, а не подсказка». jsdom — мобильный вид.

const TEXT = "Ставка меняется вслед за ключевой ставкой ЦБ РФ"

describe("Значок «i» в мобильном виде", () => {
  it("наведение подсказку не показывает; нажатие открывает штору «Информация» без кнопок и не всплывает к карточке", async () => {
    const user = userEvent.setup()
    const onCard = vi.fn()
    render(
      <div onClick={onCard}>
        <ItemInformationField label="Ставка" value="12%" valueInfo={TEXT} />
      </div>
    )
    const icon = screen.getByRole("button", { name: "Информация" })

    await user.hover(icon)
    await new Promise((r) => setTimeout(r, 200))
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull()
    expect(screen.queryByText(TEXT)).toBeNull()

    await user.click(icon)
    const sheet = screen.getByRole("dialog")
    expect(sheet).toHaveAttribute("data-slot", "info-hint-sheet")
    expect(within(sheet).getByRole("heading", { name: "Информация" })).toBeInTheDocument()
    expect(within(sheet).getByText(TEXT)).toHaveClass("text-p1-regular-mobile")
    // Кнопок нет — только крестик.
    expect(within(sheet).getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual([
      "Закрыть",
    ])
    expect(document.querySelector('[data-slot="modal-footer"]')).toBeNull()

    await user.click(within(sheet).getByRole("button", { name: "Закрыть" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(onCard).not.toHaveBeenCalled()
  })

  it("значок 16, зона нажатия 32 × 32 (вынос ::before на 8)", () => {
    render(<ItemInformationField label="Ставка" value="12%" labelInfo={TEXT} />)
    const icon = screen.getByRole("button", { name: "Информация" })
    expect(icon).toHaveClass("size-4", "relative", "before:absolute", "before:-inset-2")
    expect(icon).not.toHaveClass("hover:text-[var(--ifield-icon-fg-hover)]")
  })

  it("особый заголовок шторы — пропом", async () => {
    const user = userEvent.setup()
    render(
      <ItemInformationField
        label="Ставка"
        value="12%"
        valueInfo={TEXT}
        valueInfoTitle="Плавающая ставка"
      />
    )
    await user.click(screen.getByRole("button", { name: "Информация" }))
    expect(
      within(screen.getByRole("dialog")).getByRole("heading", { name: "Плавающая ставка" })
    ).toBeInTheDocument()
  })

  it("шапка блока и строка Item тоже открывают штору, строка при этом не нажимается", async () => {
    const user = userEvent.setup()
    const onRow = vi.fn()
    const { unmount } = render(
      <BlockWidgetHead title="Заявка" info={TEXT} infoTitle="О заявке" />
    )
    await user.click(screen.getByRole("button", { name: "Информация" }))
    expect(
      within(screen.getByRole("dialog")).getByRole("heading", { name: "О заявке" })
    ).toBeInTheDocument()
    unmount()

    render(
      <Item value="Операция" rightElement="information" informationText={TEXT} onClick={onRow} />
    )
    await user.click(screen.getByRole("button", { name: "Информация" }))
    expect(within(screen.getByRole("dialog")).getByText(TEXT)).toBeInTheDocument()
    expect(onRow).not.toHaveBeenCalled()
  })
})
