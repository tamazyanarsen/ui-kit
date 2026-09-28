import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CREATE_ITEMS, NAV_ITEMS, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Покрытие правки «Escape в „Создать“ возвращает фокус на кнопку». Для
// «Меню» тест есть в `header-keyboard-regressions.test.tsx`; у панели
// «Создать» свой `MenuOverlay` и своя ссылка на кнопку, и без неё фокус
// после ухода панели падал на body.

describe("MenuOverlay «Создать»: фокус после Escape", () => {
  it("возвращается на кнопку «Создать», а не падает на body", async () => {
    const user = userEvent.setup()
    render(
      <Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} createItems={CREATE_ITEMS} />
    )
    await user.click(screen.getByRole("button", { name: "Создать" }))
    const item = await screen.findByText("Платёж по реквизитам")
    // Фокус внутри панели — так его оставляет клавиатурный пользователь.
    const inside = item.closest<HTMLElement>("a, button")
    expect(inside).not.toBeNull()
    inside!.focus()
    expect(inside).toHaveFocus()

    await user.keyboard("{Escape}")
    // Уход панели длится 160 мс: после снятия узла фокус не должен
    // оказаться на body.
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)))
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus()
  })
})
