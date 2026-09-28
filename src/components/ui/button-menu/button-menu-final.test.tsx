import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Ellipsis } from "@/icons"

import { Button } from "@/components/ui/button"

import { ButtonMenuRow } from "./row"

// Финальный аудит: кнопка, ушедшая в «Ещё», теряла всё, кроме подписи,
// `disabled` и `onClick`. Иконочная кнопка становилась пустой строкой без
// имени, а «Сохранить» с `type="submit"` форму не отправлял.

/** Ряд 150, каждая кнопка копии — 100, резерв «…» 72: видна одна кнопка. */
function mockNarrowRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "button-menu-row" ? 150 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
    return { width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40 } as DOMRect
  })
}

describe("ButtonMenuRow: кнопки в «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("иконочная кнопка сохраняет имя, submit отправляет форму", async () => {
    mockNarrowRow()
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    const onDelete = vi.fn()
    render(
      <form onSubmit={onSubmit}>
        <ButtonMenuRow>
          <Button>Первая</Button>
          <Button type="submit">Сохранить</Button>
          <Button aria-label="Удалить" icon={Ellipsis} iconPosition="only" onClick={onDelete} />
        </ButtonMenuRow>
      </form>
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    const items = await screen.findAllByRole("menuitem")
    expect(items.map((item) => item.textContent || item.getAttribute("aria-label"))).toEqual([
      "Сохранить",
      "Удалить",
    ])

    await user.click(screen.getByRole("menuitem", { name: "Сохранить" }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    await user.click(await screen.findByRole("menuitem", { name: "Удалить" }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
