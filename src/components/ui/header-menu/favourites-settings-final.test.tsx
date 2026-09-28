import { describe, expect, it } from "vitest"
import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FavouritesSettings } from "./favourites-settings"
import type { HeaderMenuGroup } from "./header-menu"

// Финальный аудит: звезда переносит строку между «Добавлено» и «Остальными
// разделами», узел строки пересоздаётся — и фокус с нажатой звезды падал на
// body внутри модалки.

const groups: HeaderMenuGroup[] = [
  {
    value: "sections",
    title: "Разделы",
    links: [
      { value: "a", label: "Альфа" },
      { value: "b", label: "Бета" },
    ],
  },
]

// Модалка ставит начальный фокус асинхронно — дождаться, иначе он
// перебьёт фокус, поставленный тестом.
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 50)))

const starOf = (label: string) => {
  const row = screen
    .getAllByText(label)
    .map((node) => node.closest<HTMLElement>('[data-slot="favourites-settings-row"]'))
    .find(Boolean)!
  return within(row).getByRole("button", { pressed: undefined, name: /избранно/ })
}

describe("FavouritesSettings: фокус после звезды", () => {
  it("снятие из избранного оставляет фокус на звезде той же строки", async () => {
    const user = userEvent.setup()
    render(
      <FavouritesSettings open onOpenChange={() => {}} groups={groups} favourites={["a"]} onSave={() => {}} />
    )
    await settle()
    starOf("Альфа").focus()
    await user.keyboard("{Enter}")

    const star = starOf("Альфа")
    expect(star).toHaveAttribute("aria-pressed", "false")
    expect(star).toHaveFocus()
  })

  it("добавление в избранное тоже оставляет фокус на звезде", async () => {
    const user = userEvent.setup()
    render(
      <FavouritesSettings open onOpenChange={() => {}} groups={groups} favourites={[]} onSave={() => {}} />
    )
    await settle()
    starOf("Бета").focus()
    await user.keyboard("{Enter}")

    const star = starOf("Бета")
    expect(star).toHaveAttribute("aria-pressed", "true")
    expect(star).toHaveFocus()
  })
})
