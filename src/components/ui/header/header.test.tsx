import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import type { CreateMenuItem, HeaderMenuGroup } from "@/components/ui/header-menu"

import { Header } from "./header"
import type { HeaderNavItem } from "./header"
import type { ProfileMenuOrganization } from "./profile-menu"

const NAV_ITEMS: HeaderNavItem[] = [
  { value: "cash", label: "Рублёвые операции" },
  { value: "accounts", label: "Счета и карты" },
]

const ORG_ONE: ProfileMenuOrganization[] = [
  { id: "1", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
]

const ORG_MANY: ProfileMenuOrganization[] = [
  { id: "1", name: "ИП Константинопольский", inn: "7701234511", role: "Сотрудник" },
  { id: "2", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
  { id: "3", name: "ООО «Чекап»", inn: "7701234541", role: "Казначей" },
  { id: "4", name: "ООО «Внешние системы»", inn: "7701234515", role: "Наблюдатель" },
  { id: "5", name: "ООО «Северсталь»", inn: "7701234503", role: "Казначей" },
  { id: "6", name: "ООО «Чекало»", inn: "7701234556", role: "Оператор" },
  { id: "7", name: "ООО «Прогресс»", inn: "7701234578", role: "Бухгалтер" },
]

const MENU_GROUPS: HeaderMenuGroup[] = [
  {
    value: "payments",
    title: "Платежи и операции",
    links: [
      { value: "payments", label: "Платежи" },
      { value: "statements", label: "Операции и выписки" },
    ],
  },
  {
    value: "settlement",
    title: "Расчётные продукты",
    links: [{ value: "accounts", label: "Счета" }],
  },
]

const CREATE_ITEMS: CreateMenuItem[] = [
  { value: "payment", label: "Платёж по реквизитам" },
]

describe("Header", () => {
  // Дизайн-чек №30: в макете (`Menu Header (ELK)`) в нижнем ряду две
  // кнопки — «Меню» и «Создать», — а не одна «Платёж».
  it("renders the Меню/Создать buttons and nav items for the plain Client state", () => {
    render(<Header type="client" navItems={NAV_ITEMS} organizations={ORG_ONE} />)
    expect(screen.getByRole("button", { name: "Меню" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Создать" })).toBeInTheDocument()
    // The always-rendered off-screen measurement copy (see useOverflowCount)
    // duplicates every nav item, so this legitimately renders twice.
    expect(screen.getAllByText("Рублёвые операции").length).toBeGreaterThan(0)
  })

  it("hides the Создать button for Client Without An Account", () => {
    render(
      <Header
        type="client"
        clientHeaderType="client-without-account"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
      />
    )
    expect(screen.getByRole("button", { name: "Меню" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Создать" })).not.toBeInTheDocument()
  })

  it("renders only the logo and org switcher for Client is Blocked", () => {
    render(
      <Header
        type="client"
        clientHeaderType="client-is-blocked"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
      />
    )
    expect(screen.queryByRole("button", { name: "Меню" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Создать" })).not.toBeInTheDocument()
    expect(screen.queryByText("Рублёвые операции")).not.toBeInTheDocument()
    expect(screen.getByText("ООО «Северострой»")).toBeInTheDocument()
  })

  // Дизайн-чек №30: раскрывается ровно одна панель за раз, и раскрывают её
  // только кнопки «Меню»/«Создать» — у пункта навигации своего выпадающего
  // списка в макете нет.
  it("opens the navigation panel from Меню and swaps it for the create panel", async () => {
    const user = userEvent.setup()
    render(
      <Header
        type="client"
        navItems={NAV_ITEMS}
        organizations={ORG_ONE}
        menuGroups={MENU_GROUPS}
        createItems={CREATE_ITEMS}
      />
    )

    await user.click(screen.getByRole("button", { name: "Меню" }))
    expect(screen.getByText("Платежи и операции")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Создать" }))
    expect(screen.queryByText("Платежи и операции")).not.toBeInTheDocument()
    expect(screen.getByText("Платёж по реквизитам")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Создать" }))
    expect(screen.queryByText("Платёж по реквизитам")).not.toBeInTheDocument()
  })

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

  it("renders the hamburger and a standalone logout button for Employee", () => {
    render(<Header type="employee" showMenu employeeName="Иванов И. И." />)
    expect(screen.getByRole("button", { name: "Открыть меню" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Выйти" })).toBeInTheDocument()
    expect(screen.getByText("Иванов И. И.")).toBeInTheDocument()
  })

  it("renders only the logo and phone number for Sign Out", () => {
    render(<Header type="sign-out" phoneNumber="8 800 700-87-83" />)
    expect(screen.getByText("8 800 700-87-83")).toBeInTheDocument()
  })

  it("switches the active organization and calls onOrganizationChange", async () => {
    const user = userEvent.setup()
    const onOrganizationChange = vi.fn()
    render(
      <Header
        type="client"
        organizations={ORG_MANY}
        organizationId="2"
        onOrganizationChange={onOrganizationChange}
      />
    )

    await user.click(screen.getByText("ООО «Северострой»"))
    const item = await screen.findByText("ООО «Чекап»")
    await user.click(item)

    expect(onOrganizationChange).toHaveBeenCalledWith("3")
  })

  it("filters organizations via the search box once there are 7+", async () => {
    const user = userEvent.setup()
    render(<Header type="client" organizations={ORG_MANY} organizationId="2" />)

    await user.click(screen.getByText("ООО «Северострой»"))
    const search = await screen.findByPlaceholderText("Поиск")
    await user.type(search, "Прогресс")

    expect(screen.getByText("ООО «Прогресс»")).toBeInTheDocument()
    expect(screen.queryByText("ООО «Чекап»")).not.toBeInTheDocument()
  })

  it("opens the logout confirmation and calls onLogout on confirm", async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(
      <Header type="client" organizations={ORG_ONE} onLogout={onLogout} />
    )

    await user.click(screen.getByText("ООО «Северострой»"))
    await user.click(await screen.findByText("Выйти"))

    expect(await screen.findByText("Выйти из личного кабинета?")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Выйти" }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
