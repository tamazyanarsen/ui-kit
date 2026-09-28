import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate } from "./filter-date"

// Аудит 6: FilterDate открывал календарь на текущем месяце — применённый
// период и заготовка в другом месяце оставались за кадром.

const shownMonths = () =>
  ["Январь", "Февраль", "Март", "Апрель"].filter((name) => screen.queryByText(name))

describe("FilterDate: календарь показывает выбранный период", () => {
  it("открывается на месяце применённого периода", async () => {
    const user = userEvent.setup()
    render(
      <FilterDate
        label="Дата"
        defaultValue={[new Date(2025, 0, 10), new Date(2025, 0, 20)]}
      />
    )
    // С применённым периодом на триггере период, а не подпись.
    await user.click(screen.getByText("10.01.2025 – 20.01.2025"))
    expect(shownMonths()).toEqual(["Январь", "Февраль"])
    expect(screen.getAllByText("2025")).toHaveLength(2)
  })

  it("заготовка в другом месяце переводит календарь на неё", async () => {
    const user = userEvent.setup()
    render(
      <FilterDate
        label="Дата"
        presets={[{ label: "Март", range: () => [new Date(2024, 2, 1), new Date(2024, 2, 7)] }]}
      />
    )
    await user.click(screen.getByText("Дата"))
    await user.click(screen.getByRole("button", { name: "Март" }))
    expect(screen.getAllByText("2024")).toHaveLength(2)
    expect(screen.getByText("Апрель")).toBeInTheDocument()
  })
})
