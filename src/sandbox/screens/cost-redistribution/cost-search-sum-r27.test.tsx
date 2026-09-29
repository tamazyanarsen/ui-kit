import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { CostRedistributionScreen } from "./screen"

// Раунд 27: плейсхолдер поиска обещает «Код, статья или сумма», а сумму
// сверяли с сырым «90000000»: набранная так, как её видят в колонке
// («90 000 000»), не находила ничего, и итог главы (её строка показывает
// сумму ветки) тоже не искался.

const titles = () =>
  [...document.querySelectorAll('tbody [data-slot="table-row"]')].map(
    (row) => row.textContent ?? ""
  )

describe("Перераспределение ССР: поиск по сумме", () => {
  it("находит лист по сумме с пробелами разрядов", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <CostRedistributionScreen />
      </ToastProvider>
    )
    await user.type(screen.getByLabelText("Код, статья или сумма"), "120 000 000")
    const rows = titles()
    expect(rows.some((text) => text.includes("Договор освоения территории"))).toBe(true)
    expect(rows.some((text) => text.includes("Реклама"))).toBe(false)
  }, 20000)

  it("находит главу по её итогу (заёмные главы 3 = 75 000 000)", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <CostRedistributionScreen />
      </ToastProvider>
    )
    await user.type(screen.getByLabelText("Код, статья или сумма"), "75 000 000")
    expect(titles().some((text) => text.includes("Глава 3"))).toBe(true)
  }, 20000)

  it("сумма с разрядами сравнивается точно: 70 000 000 не находит 270 000 000", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <CostRedistributionScreen />
      </ToastProvider>
    )
    const search = screen.getByLabelText("Код, статья или сумма")
    // Заёмные главы 1 — ровно 270 000 000; такой суммы «70 000 000» нет ни у
    // одной строки, и глава не должна попасть в выдачу подстрокой.
    await user.type(search, "70 000 000")
    expect(titles().some((text) => text.includes("Глава 1"))).toBe(false)
    await user.clear(search)
    await user.type(search, "270 000 000")
    expect(titles().some((text) => text.includes("Глава 1"))).toBe(true)
  }, 20000)
})
