import { useState } from "react"
import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Header } from "@/components/ui/header"
import type { HeaderMenuGroup } from "@/components/ui/header-menu"

import { EmployeeMenu } from "./employee-menu"
import { EmployeeMenuNav } from "./employee-menu-nav"

const GROUPS: HeaderMenuGroup[] = [
  {
    value: "main",
    title: "Основное",
    links: [
      { value: "letters", label: "Письма" },
      { value: "tasks", label: "Задачник" },
    ],
  },
  {
    value: "sbp",
    title: "СБП",
    links: [{ value: "sbp-payments", label: "Платежи СБП" }],
  },
]

describe("EmployeeMenu", () => {
  it("рисует каждую группу карточкой со своими ссылками", () => {
    render(<EmployeeMenu groups={GROUPS} />)

    expect(screen.getByText("Основное")).toBeInTheDocument()
    expect(screen.getByText("СБП")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Письма" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Платежи СБП" })).toBeInTheDocument()
  })

  it("звезда сообщает о переключении и знает своё состояние", async () => {
    const user = userEvent.setup()
    const toggled: string[] = []
    render(
      <EmployeeMenu
        groups={GROUPS}
        favourites={["letters"]}
        onFavouriteToggle={(value) => toggled.push(value)}
      />
    )

    expect(
      screen.getByRole("button", { name: "Убрать из избранного" })
    ).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "Добавить в избранное" })[0])
    expect(toggled).toEqual(["tasks"])
  })

  it("без обработчика избранного звёзд нет вовсе", () => {
    render(<EmployeeMenu groups={GROUPS} showFavourites={false} />)

    expect(
      screen.queryByRole("button", { name: "Добавить в избранное" })
    ).not.toBeInTheDocument()
  })
})

describe("EmployeeMenuNav", () => {
  it("подсказывает, откуда берутся пункты, пока избранного нет", () => {
    render(<EmployeeMenuNav links={[]} />)

    expect(
      screen.getByText(/Наведите курсор на элемент на главной/)
    ).toBeInTheDocument()
  })

  it("подсказки нет там, где избранное не редактируется", () => {
    render(<EmployeeMenuNav links={[]} showHint={false} />)

    expect(
      screen.queryByText(/Наведите курсор на элемент на главной/)
    ).not.toBeInTheDocument()
  })
})

describe("Header type=employee с меню", () => {
  it("ставит закреплённые разделы в верхнюю полосу, а звезда их добавляет", async () => {
    const user = userEvent.setup()

    function Screen() {
      const [favourites, setFavourites] = useState<string[]>(["letters"])
      return (
        <>
          <Header
            type="employee"
            employeeName="Константинопольский К. К."
            menuGroups={GROUPS}
            favourites={favourites}
            onFavouritesChange={setFavourites}
          />
          <EmployeeMenu
            groups={GROUPS}
            favourites={favourites}
            onFavouriteToggle={(value) =>
              setFavourites((prev) =>
                prev.includes(value)
                  ? prev.filter((item) => item !== value)
                  : [...prev, value]
              )
            }
          />
        </>
      )
    }

    const { container } = render(<Screen />)
    const nav = container.querySelector('[data-slot="employee-menu-nav"]')!

    // По роли, а не по тексту: рядом с видимым пунктом всегда лежит его
    // мерная копия (обычный `div`), и `getByText` находил бы оба.
    expect(
      within(nav as HTMLElement).getByRole("button", { name: "Письма" })
    ).toBeInTheDocument()
    expect(
      within(nav as HTMLElement).queryByRole("button", { name: "Задачник" })
    ).not.toBeInTheDocument()

    // Звезда на главной — единственный способ закрепить раздел в шапке.
    await user.click(screen.getAllByRole("button", { name: "Добавить в избранное" })[0])

    expect(
      within(nav as HTMLElement).getByRole("button", { name: "Задачник" })
    ).toBeInTheDocument()
  })

  it("прежняя шапка сотрудника без меню полосы избранного не заводит", () => {
    const { container } = render(
      <Header type="employee" employeeName="Константинопольский К. К." showMenu />
    )

    expect(
      container.querySelector('[data-slot="employee-menu-nav"]')
    ).toBeNull()
  })
})
