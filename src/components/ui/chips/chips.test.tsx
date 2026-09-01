import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Chips } from "./chips"

describe("Chips", () => {
  it("renders its content and optional subtitle", () => {
    render(<Chips subtitle="Подзаголовок">Значение</Chips>)
    expect(screen.getByText("Значение")).toBeInTheDocument()
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
  })

  it("renders a counter badge when count is given", () => {
    render(<Chips count={5}>Фильтры</Chips>)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders a remove button when closable and calls onRemove", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <Chips closable onRemove={onRemove}>
        Значение
      </Chips>
    )

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("omits the remove button when not closable", () => {
    render(<Chips>Значение</Chips>)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("disables the remove button when disabled", () => {
    render(
      <Chips closable disabled>
        Значение
      </Chips>
    )
    expect(screen.getByRole("button", { name: "Удалить" })).toBeDisabled()
  })

  /* Свойство `Type` компонент-сета «ELK / chips, filter»: строка подписи есть
     только у `Chips` и у двух типов `Filter Subtitle …`, у голых `Filter …`
     её в макете нет вовсе (54887:29180 / 54887:29185). */
  it("shows the subtitle only for types that have one", () => {
    const { rerender } = render(
      <Chips type="filter-subtitle-white" subtitle="Подзаголовок">
        Значение
      </Chips>
    )
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()

    rerender(
      <Chips type="filter-white" subtitle="Подзаголовок">
        Значение
      </Chips>
    )
    expect(screen.queryByText("Подзаголовок")).not.toBeInTheDocument()
  })

  /* Брендовая рамка на State=Active есть только у типов Filter; у
     `Type=Chips` выбранное состояние — заливка (54887:29218 против
     54887:29390). */
  it("gives the Filter types a brand border when selected", () => {
    const { rerender } = render(
      <Chips type="filter-grey" selected>
        Значение
      </Chips>
    )
    const chip = () => screen.getByText("Значение").closest("[data-slot=chips]")!
    expect(chip().className).toContain("border-[var(--filter-active-border)]")

    rerender(
      <Chips type="chips" selected>
        Значение
      </Chips>
    )
    expect(chip().className).not.toContain("border-[var(--filter-active-border)]")
    expect(chip().className).toContain("bg-[var(--chips-light-bg-hover)]")
  })

  it("renders the Show Select chevron only when asked", () => {
    const { container, rerender } = render(
      <Chips type="filter-white">Значение</Chips>
    )
    expect(container.querySelectorAll("svg")).toHaveLength(0)

    rerender(
      <Chips type="filter-white" showSelect>
        Значение
      </Chips>
    )
    expect(container.querySelectorAll("svg")).toHaveLength(1)
  })
})
