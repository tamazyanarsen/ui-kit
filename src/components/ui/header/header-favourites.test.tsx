import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MENU_GROUPS, ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Избранное в нижнем ряду шапки: подсказка, порядок, звёзды и настройка.

describe("Header — избранное", () => {
  // Вариант `Size=None` (нода 70303:49022): пункты нижнего ряда — избранные
  // разделы, и пока их нет, на их месте стоит подсказка.
  it("shows the empty-favourites hint instead of nav items", () => {
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={[]}
        organizations={ORG_ONE}
        onFavouritesChange={() => {}}
      />
    )
    expect(
      screen.getByText(/Избранное — наведите курсор на элемент в меню/)
    ).toBeInTheDocument()
  })

  // Нижний ряд — это и есть избранное. Раньше `navItems` и `favourites` были
  // двумя независимыми списками, поэтому звезда в раскрытом меню ничего в
  // шапке не меняла.
  it("builds the nav row out of favourites, in the favourites' own order", () => {
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={["accounts", "payments"]}
        organizations={ORG_ONE}
      />
    )

    // Читаем мерную копию ряда, а не видимые пункты: в jsdom ширины равны
    // нулю, поэтому useOverflowCount оставляет видимым ровно один пункт и
    // уводит остальные в «Ещё». Мерная копия всегда содержит полный список
    // в правильном порядке — именно порядок здесь и проверяется.
    const measure = document.querySelector('[data-slot="header-nav-measure"]')
    const values = [...measure!.children].map((item) => item.getAttribute("data-value"))
    expect(values).toEqual(["accounts", "payments"])
    // «Операции и выписки» есть в меню, но не в избранном — в ряду его нет.
    expect(values).not.toContain("statements")
  })

  it("adds a section to the nav row when its star is clicked in the menu", async () => {
    const user = userEvent.setup()
    const onFavouritesChange = vi.fn()
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={["payments"]}
        onFavouritesChange={onFavouritesChange}
        organizations={ORG_ONE}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    const panel = document.querySelector('[data-slot="header-menu"]')
    const rows = [...panel!.querySelectorAll('[data-slot="header-menu-link"]')]
    const statements = rows.find((row) => row.textContent?.includes("Операции и выписки"))
    await user.click(
      statements!.querySelector('[aria-label="Добавить в избранное"]') as HTMLElement
    )

    expect(onFavouritesChange).toHaveBeenCalledWith(["payments", "statements"])
  })

  it("removes a section from favourites when an already-starred link is clicked", async () => {
    const user = userEvent.setup()
    const onFavouritesChange = vi.fn()
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={["payments", "statements"]}
        onFavouritesChange={onFavouritesChange}
        organizations={ORG_ONE}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    const panel = document.querySelector('[data-slot="header-menu"]')
    const rows = [...panel!.querySelectorAll('[data-slot="header-menu-link"]')]
    const payments = rows.find((row) => row.textContent?.includes("Платежи"))
    await user.click(
      payments!.querySelector('[aria-label="Убрать из избранного"]') as HTMLElement
    )

    expect(onFavouritesChange).toHaveBeenCalledWith(["statements"])
  })

  it("saves a reordered favourites list from «Настройка избранного»", async () => {
    const user = userEvent.setup()
    const onFavouritesChange = vi.fn()
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={["payments", "statements"]}
        onFavouritesChange={onFavouritesChange}
        organizations={ORG_ONE}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    await user.click(screen.getByRole("button", { name: "Настроить избранное" }))

    // «Счета» не в избранном — модалка держит его во второй группе.
    expect(screen.getByRole("heading", { name: "Добавлено" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Остальные разделы" })).toBeInTheDocument()

    // Опускаем «Платежи» на позицию ниже ручкой перетаскивания.
    const handle = screen.getByRole("button", { name: "Переместить «Платежи»" })
    handle.focus()
    await user.keyboard("{ArrowDown}")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    expect(onFavouritesChange).toHaveBeenCalledWith(["statements", "payments"])
  })

  it("keeps favourites untouched when the settings modal is cancelled", async () => {
    const user = userEvent.setup()
    const onFavouritesChange = vi.fn()
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={["payments", "statements"]}
        onFavouritesChange={onFavouritesChange}
        organizations={ORG_ONE}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    await user.click(screen.getByRole("button", { name: "Настроить избранное" }))
    const handle = screen.getByRole("button", { name: "Переместить «Платежи»" })
    handle.focus()
    await user.keyboard("{ArrowDown}")
    await user.click(screen.getByRole("button", { name: "Отмена" }))

    expect(onFavouritesChange).not.toHaveBeenCalled()
  })

  it("omits the hint when favourites are not wired up", () => {
    render(
      <Header
        type="client"
        menuGroups={MENU_GROUPS}
        favourites={[]}
        organizations={ORG_ONE}
      />
    )
    expect(screen.queryByText(/Избранное — наведите курсор/)).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Настроить избранное" })
    ).not.toBeInTheDocument()
  })
})
