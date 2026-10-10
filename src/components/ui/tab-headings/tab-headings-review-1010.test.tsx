import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TabHeadings } from "./tab-headings"

// Ревью 10.10, п. 5: при выключенной активной вкладке единственный
// `tabIndex=0` стоял на `<button disabled>`, и группа выпадала из обхода по Tab.
describe("TabHeadings: выключенная активная вкладка (ревью 10.10, п. 5)", () => {
  const items = [
    { value: "a", label: "Счета", disabled: true },
    { value: "b", label: "Карты" },
    { value: "c", label: "Вклады" },
  ]

  it("по Tab фокус попадает на первую доступную вкладку", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">До</button>
        <TabHeadings items={items} value="a" />
      </>
    )
    await user.click(screen.getByRole("button", { name: "До" }))
    await user.tab()
    expect(screen.getByRole("tab", { name: "Карты" })).toHaveFocus()
  })

  it("доступная активная вкладка остаётся точкой входа", () => {
    render(<TabHeadings items={items} defaultValue="c" />)
    expect(screen.getByRole("tab", { name: "Вклады" })).toHaveAttribute("tabindex", "0")
    expect(screen.getByRole("tab", { name: "Карты" })).toHaveAttribute("tabindex", "-1")
  })
})
