import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"
import { CREATE_ITEMS, MENU_GROUPS, ORG_MANY } from "@/test/header-fixtures"

import { Header } from "./header"
import type { HeaderProps } from "./header"

// Правки UI-Kit от 25.10 — мобильная шапка: p30, p49, m54, p58, p63, p64, m57.

function renderMobile(props: HeaderProps) {
  return render(
    <ViewportScope viewport="mobile">
      <Header type="client" organizations={ORG_MANY} {...props} />
    </ViewportScope>
  )
}

const root = () => document.querySelector<HTMLElement>('[data-slot="header"]')!
const menuButton = () => screen.getByRole("button", { name: "Меню" })

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Header (мобильная) — p30: без подложки, строка 64, не закреплена", () => {
  it("прозрачная шапка, строка 16 со всех сторон и высотой 64", () => {
    renderMobile({})
    expect(root().className).toContain("bg-transparent")
    expect(root().className).not.toMatch(/(^|\s)bg-\[var\(--header-bg\)\]/)
    const row = document.querySelector<HTMLElement>('[data-slot="header-mobile-row"]')!
    expect(row.className).toContain("h-16")
    expect(row.className).toContain("p-4")
    expect(row.className).not.toContain("pb-2")
  })

  it("пока открыто меню — белая, одним фейдом с панелью, без затемнения", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS })
    expect(root()).not.toHaveAttribute("data-menu-open")
    await user.click(menuButton())
    expect(root()).toHaveAttribute("data-menu-open")
    expect(root().className).toContain("data-[menu-open]:bg-[var(--header-bg)]")
    expect(root().className).toContain("duration-(--duration-panel-out)")
    expect(root().className).toContain("data-[menu-open]:duration-(--duration-panel)")
    const panel = document.querySelector<HTMLElement>('[data-slot="header-menu-overlay-panel"]')!
    expect(panel.className).toContain("menu-backdrop-in")
    expect(panel.className).not.toContain("menu-panel-in")
    const backdrop = screen.getByRole("button", { name: "Закрыть меню" })
    expect(backdrop.className).toContain("bg-transparent")
    expect(backdrop.className).not.toContain("--modal-backdrop")
  })

  it("pinned=true мобильную не закрепляет, pinned=\"always\" — закрепляет", () => {
    const { unmount } = renderMobile({ pinned: true })
    expect(root().className).not.toContain("sticky")
    unmount()
    renderMobile({ pinned: "always" })
    expect(root().className).toContain("sticky")
  })
})

describe("Header (мобильная) — p49: уведомления ведут в раздел", () => {
  it("нажатие вызывает onNotificationsClick и не раскрывает список", async () => {
    const user = userEvent.setup()
    const onNotificationsClick = vi.fn()
    renderMobile({ onNotificationsClick })
    const bell = screen.getByRole("button", { name: "Уведомления" })
    await user.click(bell)
    expect(onNotificationsClick).toHaveBeenCalledTimes(1)
    expect(bell).not.toHaveAttribute("aria-expanded", "true")
    expect(bell).not.toHaveAttribute("aria-haspopup")
    expect(document.querySelector('[data-slot="notification-menu-content"]')).toBeNull()
    // Сжатие значка осталось.
    expect(bell.className).toContain("[--press-scale:0.92]")
  })

  it("зоны нажатия наращены невидимо: по 6, снаружи до соседа 12", () => {
    renderMobile({})
    const bell = screen.getByRole("button", { name: "Уведомления" })
    const mail = screen.getByRole("button", { name: "Сообщения" })
    expect(bell.className).toContain("before:-inset-y-1.5")
    expect(bell.className).toContain("before:-right-1.5")
    expect(bell.className).toContain("before:-left-3")
    expect(mail.className).toContain("before:-left-1.5")
    expect(mail.className).toContain("before:-right-3")
  })
})

describe("Header (мобильная) — m54: «+» открывает штору «Создать»", () => {
  it("штора с подсказкой и строками Item; нажатие закрывает и выполняет пункт", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    renderMobile({ createItems: [{ ...CREATE_ITEMS[0], onClick }] })
    const plus = screen.getByRole("button", { name: "Создать" })
    expect(plus).not.toHaveAttribute("aria-expanded")
    await user.click(plus)
    const sheet = await screen.findByRole("dialog", { name: "Создать" })
    // Панели плиток нет, «+» не стал крестиком.
    expect(document.querySelector('[data-slot="header-create-menu"]')).toBeNull()
    expect(plus).not.toHaveAttribute("aria-expanded")
    expect(plus.querySelector("svg")).not.toBeNull()
    expect(within(sheet).getByText(/Откройте corp\.domrfbank\.ru с компьютера/)).toBeInTheDocument()
    const row = sheet.querySelector<HTMLElement>('[data-slot="item"]')!
    expect(row).toHaveTextContent("Платёж по реквизитам")
    await user.click(within(row).getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
    await vi.waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Создать" })).toBeNull()
    )
  })
})

describe("Header (мобильная) — p58: организация строкой Item и штора", () => {
  it("строка открывает штору поверх меню; выбор переключает и закрывает", async () => {
    const user = userEvent.setup()
    const onOrganizationChange = vi.fn()
    renderMobile({ menuGroups: MENU_GROUPS, organizationId: "1", onOrganizationChange })
    await user.click(menuButton())
    const org = document.querySelector<HTMLElement>('[data-slot="header-mobile-org"]')!
    expect(org.querySelector('[data-slot="item-divider"]')).toBeNull()
    await user.click(within(org).getByRole("button"))
    const sheet = await screen.findByRole("dialog", { name: "Мои организации (7)" })
    const radios = within(sheet).getAllByRole("radio")
    expect(radios).toHaveLength(7)
    expect(radios[0]).toHaveAttribute("aria-checked", "true")
    expect(radios[0]).toHaveTextContent("ИНН 7701234511 • Сотрудник")
    // Меню под шторой не закрылось.
    expect(document.querySelector('[data-slot="header-mobile-menu"]')).not.toBeNull()
    await user.click(radios[1])
    expect(onOrganizationChange).toHaveBeenCalledWith("2")
    await vi.waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /Мои организации/ })).toBeNull()
    )
    expect(document.querySelector('[data-slot="header-mobile-menu"]')).not.toBeNull()
  })

  it("в подвале «Профиль и настройки» над «Выйти»; «Выйти» — прежнее подтверждение", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS })
    await user.click(menuButton())
    await user.click(
      within(document.querySelector<HTMLElement>('[data-slot="header-mobile-org"]')!).getByRole("button")
    )
    const sheet = await screen.findByRole("dialog", { name: /Мои организации/ })
    const footer = sheet.querySelector<HTMLElement>('[data-slot="modal-footer"]')!
    const buttons = within(footer).getAllByRole("button")
    // Порядок в разметке [вторичная, основная]; столбец переворачивается.
    expect(buttons.map((button) => button.textContent)).toEqual(["Выйти", "Профиль и настройки"])
    expect(footer.className).toContain("flex-col-reverse")
    await user.click(within(footer).getByRole("button", { name: "Выйти" }))
    expect(await screen.findByText("Выйти из личного кабинета?")).toBeInTheDocument()
  })
})

describe("Header (мобильная) — p63/m57: вкладки лентой", () => {
  function pager() {
    return document.querySelector<HTMLElement>('[data-slot="header-mobile-menu-pager"]')!
  }

  it("обе вкладки в ленте с привязкой; невидимая — inert и aria-hidden", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS, favourites: ["accounts"], onFavouritesChange: () => {} })
    await user.click(menuButton())
    expect(pager().className).toContain("snap-x")
    expect(pager().className).toContain("snap-mandatory")
    expect(pager().className).toContain("overscroll-x-contain")
    const [favourites, all] = Array.from(
      pager().querySelectorAll<HTMLElement>('[data-slot="header-mobile-menu-panel"]')
    )
    expect(favourites.className).toContain("[scroll-snap-stop:always]")
    expect(favourites.className).toContain("px-4")
    expect(favourites).not.toHaveAttribute("aria-hidden")
    expect(all).toHaveAttribute("aria-hidden", "true")
    expect(all).toHaveAttribute("inert")
  })

  it("заголовок листает ленту плавно; при reduced-motion — без движения", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS, favourites: ["accounts"], onFavouritesChange: () => {} })
    await user.click(menuButton())
    const scrollTo = vi.fn()
    Object.defineProperty(pager(), "scrollTo", { configurable: true, value: scrollTo })
    Object.defineProperty(pager(), "clientWidth", { configurable: true, value: 375 })
    await user.click(screen.getByRole("tab", { name: "Все разделы" }))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 375, behavior: "smooth" })
    expect(screen.getByRole("tab", { name: "Все разделы" })).toHaveAttribute("aria-selected", "true")

    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList
    )
    await user.click(screen.getByRole("tab", { name: "Избранное" }))
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: "auto" })
  })

  it("листание пальцем: больше половины — активны «Все разделы», кнопка гаснет 1 − 2t", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS, favourites: ["accounts"], onFavouritesChange: () => {} })
    await user.click(menuButton())
    const settings = document.querySelector<HTMLElement>('[data-slot="header-mobile-menu-settings"]')!
    Object.defineProperty(pager(), "clientWidth", { configurable: true, value: 400 })
    fireEvent.pointerDown(pager())
    act(() => {
      pager().scrollLeft = 100
      fireEvent.scroll(pager())
    })
    expect(settings.style.opacity).toBe("0.5")
    expect(screen.getByRole("tab", { name: "Избранное" })).toHaveAttribute("aria-selected", "true")
    act(() => {
      pager().scrollLeft = 240
      fireEvent.scroll(pager())
    })
    expect(screen.getByRole("tab", { name: "Все разделы" })).toHaveAttribute("aria-selected", "true")
    expect(settings).toHaveAttribute("inert")
    expect(settings.style.opacity).toBe("0")
  })

  it("«Все разделы» — серые карточки, подсказка о полной версии, без звезды у favouritable: false", async () => {
    const user = userEvent.setup()
    const groups = [
      ...MENU_GROUPS,
      {
        value: "deposits",
        title: "Размещение средств",
        links: [{ value: "min-balance", label: "Неснижаемые остатки", favouritable: false }],
      },
    ]
    renderMobile({ menuGroups: groups, favourites: [], onFavouritesChange: () => {} })
    await user.click(menuButton())
    await user.click(screen.getByRole("tab", { name: "Все разделы" }))
    const cards = document.querySelectorAll<HTMLElement>('[data-slot="header-mobile-menu-group"]')
    expect(cards).toHaveLength(3)
    expect(cards[0].className).toContain("rounded-[16px]")
    expect(cards[0].className).toContain("p-6")
    expect(cards[0].className).toContain("gap-6")
    expect(screen.getByText(/для просмотра всех разделов/)).toBeInTheDocument()
    const noStar = within(cards[2]).getByRole("button", { name: "Неснижаемые остатки" })
    expect(noStar.parentElement!.querySelectorAll("button")).toHaveLength(1)
  })

  it("подпись раздела сжимается одна (к центру текста), звезда — сама до 0,92", async () => {
    const user = userEvent.setup()
    renderMobile({ menuGroups: MENU_GROUPS, favourites: ["accounts"], onFavouritesChange: () => {} })
    await user.click(menuButton())
    const label = screen.getByRole("button", { name: "Счета" })
    expect(label.className).toContain("press-scale-content")
    expect(label.firstElementChild!.className).toContain("inline-block")
    const star = screen.getByRole("button", { name: "В избранном. Как настроить избранное" })
    expect(star.className).toContain("press-scale")
    expect(star.className).toContain("[--press-scale:0.92]")
  })
})

describe("Header (мобильная) — p64: штора «Настройте избранное с компьютера»", () => {
  it("кнопка открывает штору; «Поделиться ссылкой» зовёт navigator.share", async () => {
    const user = userEvent.setup()
    const share = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, "share", { configurable: true, value: share })
    const onFavouritesChange = vi.fn()
    renderMobile({ menuGroups: MENU_GROUPS, favourites: ["accounts"], onFavouritesChange })
    await user.click(menuButton())
    await user.click(screen.getByRole("button", { name: "Как настроить избранное" }))
    const sheet = await screen.findByRole("dialog", { name: "Настройте избранное с компьютера" })
    expect(within(sheet).getByText("Авторизуйтесь в ЕЛК с компьютера")).toBeInTheDocument()
    expect(within(sheet).getByText("Откройте меню и отметьте нужные разделы")).toBeInTheDocument()
    expect(within(sheet).getByText("Часть разделов открывается только с компьютера")).toBeInTheDocument()
    expect(sheet.querySelectorAll('[data-slot="favourites-help-step"]')).toHaveLength(2)
    // Модалки «Настройка избранного» нет.
    expect(screen.queryByRole("dialog", { name: /Настройка избранного/ })).toBeNull()
    await user.click(within(sheet).getByRole("button", { name: "Поделиться ссылкой" }))
    expect(share).toHaveBeenCalledWith({ url: "https://corp.domrfbank.ru" })
    expect(onFavouritesChange).not.toHaveBeenCalled()
    Reflect.deleteProperty(navigator, "share")
  })
})
