import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { resolveRemainingLinks } from "./favourites"
import { HeaderMenu } from "./header-menu"
import type { HeaderMenuGroup } from "./header-menu-parts"
import { CreateMenu } from "./create-menu"

// Правки UI-Kit от 25.10: флаг «нельзя в избранное» и общий menu-row у
// плиток «Создать».

const GROUPS: HeaderMenuGroup[] = [
  {
    value: "deposits",
    title: "Размещение средств",
    links: [
      { value: "deposit", label: "Депозиты" },
      { value: "min-balance", label: "Неснижаемые остатки", favouritable: false },
    ],
  },
]

describe("header-menu — Правки UI-Kit от 25.10", () => {
  it("у ссылки с favouritable: false нет звезды", () => {
    render(<HeaderMenu groups={GROUPS} favourites={[]} showFavourites onFavouriteToggle={() => {}} />)
    const row = screen.getByRole("button", { name: "Неснижаемые остатки" }).parentElement!
    expect(row.querySelectorAll("button")).toHaveLength(1)
    const other = screen.getByRole("button", { name: "Депозиты" }).parentElement!
    expect(other.querySelectorAll("button")).toHaveLength(2)
  })

  it("в «Остальных разделах» настройки нет разделов, которые нельзя добавить", () => {
    expect(resolveRemainingLinks(GROUPS, []).map((link) => link.value)).toEqual(["deposit"])
  })

  it("плитки «Создать» — общий menu-row вместо своего токена наведения", () => {
    render(<CreateMenu items={[{ value: "p", label: "Платёж" }]} />)
    const tile = screen.getByRole("button", { name: "Платёж" })
    expect(tile.className).toContain("menu-row")
    expect(tile.className).not.toContain("--header-item-hover-bg")
  })
})
