import "@/test/desktop-viewport"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ItemInformationField } from "@/components/ui/item-information-field"

// Правки UI-Kit от 25.10: на десктопе значок «i» — прежний тултип по
// наведению, без шторы и без расширенной зоны нажатия.

const TEXT = "Ставка меняется вслед за ключевой ставкой ЦБ РФ"

describe("Значок «i» на десктопе", () => {
  it("тултип по наведению, нажатие штору не открывает", async () => {
    const user = userEvent.setup()
    render(<ItemInformationField label="Ставка" value="12%" valueInfo={TEXT} />)
    const icon = screen.getByRole("button", { name: "Информация" })
    expect(icon).not.toHaveClass("before:-inset-2")
    expect(icon).toHaveClass("desktop:hover:text-[var(--ifield-icon-fg-hover)]")

    await user.hover(icon)
    expect(await screen.findByText(TEXT)).toBeInTheDocument()
    expect(document.querySelector('[data-slot="tooltip-content"]')).not.toBeNull()

    await user.click(icon)
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
