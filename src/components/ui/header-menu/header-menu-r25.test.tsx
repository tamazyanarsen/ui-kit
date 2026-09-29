import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { BannerCarousel } from "./banner-carousel"
import { CreateMenu } from "./create-menu"
import { FavouritesSettings } from "./favourites-settings"
import { collectMenuLinks, resolveFavouriteLinks } from "./favourites"
import { HeaderMenu } from "./header-menu"
import { MenuBanner } from "./menu-banner"

// r25: пустые элементы списков роняли меню на `item.value`; повтор в избранном
// давал две строки с одним ключом; число 0 в подзаголовке баннера.

const link = { value: "a", label: "Платежи" }

describe("пустые элементы в списках меню", () => {
  it("HeaderMenu: null-группа и null-ссылка пропускаются", () => {
    const groups = [
      null,
      { value: "g", title: "Группа", links: [null, link] },
    ] as never
    render(<HeaderMenu groups={groups} columns={2} />)
    expect(screen.getByText("Платежи")).toBeInTheDocument()
  })

  it("HeaderMenu: null-баннер пропускается", () => {
    render(
      <HeaderMenu groups={[]} banners={[null, { title: "Баннер" }] as never} />
    )
    expect(screen.getByText("Баннер")).toBeInTheDocument()
  })

  it("BannerCarousel: только null — ничего не рисует", () => {
    const { container } = render(<BannerCarousel banners={[null] as never} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("CreateMenu: null-плитка пропускается", () => {
    render(<CreateMenu items={[null, { value: "p", label: "Платёж" }] as never} />)
    expect(screen.getByText("Платёж")).toBeInTheDocument()
  })

  it("collectMenuLinks не падает на null-группе и null-ссылке", () => {
    expect(
      collectMenuLinks([null, { value: "g", title: "", links: [null, link] }] as never)
    ).toEqual([link])
  })
})

describe("избранное без повторов", () => {
  const groups = [{ value: "g", title: "Г", links: [link] }]

  it("значение, повторённое в списке, даёт одну ссылку", () => {
    expect(resolveFavouriteLinks(groups, ["a", "a"])).toHaveLength(1)
  })

  it("в настройках повтор не рисуется дважды", () => {
    render(
      <FavouritesSettings
        open
        onOpenChange={vi.fn()}
        groups={groups}
        favourites={["a", "a"]}
        onSave={vi.fn()}
      />
    )
    expect(
      document.querySelectorAll('[data-slot="favourites-settings-row"]')
    ).toHaveLength(1)
  })

  it("«Сохранить» отдаёт список без повторов", async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <FavouritesSettings
        open
        onOpenChange={vi.fn()}
        groups={groups}
        favourites={["a", "a"]}
        onSave={onSave}
      />
    )
    await user.click(screen.getByRole("button", { name: "Сохранить" }))
    expect(onSave).toHaveBeenCalledWith(["a"])
  })
})

describe("MenuBanner с числом 0", () => {
  it("subtitle = 0 рисуется в абзаце", () => {
    render(<MenuBanner title="Т" subtitle={0} />)
    expect(screen.getByText("0").tagName).toBe("P")
  })
})
