import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmployeeMenuNav } from "@/components/ui/employee-menu"
import { ProfileMenu } from "@/components/ui/header"
import { Switcher } from "@/components/ui/switcher"
import { Tabs } from "@/components/ui/tabs"
import { ORG_MANY } from "@/test/header-fixtures"

import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

// Аудит 16: у списков «…» и меню шапки был только `min-w-*`. Попап брал
// ширину по самой длинной подписи: на телефоне пункт от ~40 символов
// раздвигал страницу вбок, на десктопе длинный пункт растягивал список до
// 984px в строку.

const LIMIT = "max-w-[min(400px,calc(100vw-32px))]"
const WRAP = "[overflow-wrap:anywhere]"

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
]

/** Ряд 300, пункт 100 — видны два, остальное в «…». */
function mockRow(slot: string, itemSlot: string, fromCopy = false) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === slot ? 300 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const hit =
      this.dataset.slot === itemSlot && (!fromCopy || this.closest('[aria-hidden="true"]'))
    const w = hit ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

const expectLimited = (popup: HTMLElement) => expect(popup).toHaveClass(LIMIT, WRAP)

describe("Списки навигации не шире окна", () => {
  afterEach(() => vi.restoreAllMocks())

  it("ButtonMenuOverflow", async () => {
    const user = userEvent.setup()
    render(
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Отправить документ на согласование руководителю" />
      </ButtonMenuOverflow>
    )
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expectLimited(await screen.findByRole("menu"))
  })

  it("«…» у Tabs", async () => {
    mockRow("tabs", "tabs-item")
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} defaultValue="a" showMore={false} />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expectLimited(await screen.findByRole("menu"))
  })

  it("«…» у Switcher", async () => {
    mockRow("switcher", "switcher-item", true)
    const user = userEvent.setup()
    render(<Switcher items={ITEMS} defaultValue="a" />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expectLimited(await screen.findByRole("menu"))
  })

  it("меню шапки", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="3" />)
    await user.click(screen.getByRole("button", { name: /Чекап/ }))
    expectLimited(await screen.findByRole("menu"))
  })

  it("«Ещё» меню сотрудника", async () => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.slot === "employee-menu-nav" ? 300 : 0
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const w = this.dataset.value ? 100 : 0
      return { width: w, height: 24, top: 0, left: 0, right: w, bottom: 24 } as DOMRect
    })
    const user = userEvent.setup()
    render(
      <EmployeeMenuNav
        links={[
          { value: "a", label: "Письма" },
          { value: "b", label: "Задачник" },
          { value: "c", label: "Справки" },
        ]}
        activeLink="a"
      />
    )
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    expectLimited(await screen.findByRole("menu"))
  })
})
