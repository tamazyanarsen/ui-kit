import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"
import { TitleInformationText } from "./information-text"

// "Опциональные элементы: все, кроме Title и Button" (Title Card) /
// "все, кроме Title" (Registry) — nodes 7593:18875 and 8712:15258.
describe("TitleCard", () => {
  it("renders the title, back and help buttons", async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    const onHelp = vi.fn()
    render(<TitleCard title="Заголовок" onBack={onBack} onHelp={onHelp} />)

    expect(screen.getByRole("heading", { name: "Заголовок" })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Назад/ }))
    await user.click(screen.getByRole("button", { name: /Справка/ }))
    expect(onBack).toHaveBeenCalledTimes(1)
    expect(onHelp).toHaveBeenCalledTimes(1)
  })

  it("drops every optional slot but keeps the title", () => {
    render(
      <TitleCard title="Заголовок" backLabel={null} helpLabel={null} />
    )
    expect(screen.getByRole("heading", { name: "Заголовок" })).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders the status row with a tag and information text", () => {
    render(
      <TitleCard
        title="Заголовок"
        tag="Исполнен"
        information={<TitleInformationText href="#">Ссылка</TitleInformationText>}
      />
    )
    expect(screen.getByText("Исполнен")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Ссылка" })).toBeInTheDocument()
  })
})

describe("TitleRegistry", () => {
  it("renders the title with help and page actions", () => {
    render(
      <TitleRegistry
        title="Реестр"
        description="Описание"
        actions={<button type="button">Создать</button>}
      />
    )
    expect(screen.getByRole("heading", { name: "Реестр" })).toBeInTheDocument()
    expect(screen.getByText("Описание")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Справка/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Создать" })).toBeInTheDocument()
  })

  it("has no back button and no status row", () => {
    const { container } = render(<TitleRegistry title="Реестр" helpLabel={null} />)
    expect(screen.queryByRole("button", { name: /Назад/ })).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="title-card-status"]')
    ).toBeNull()
  })
})

describe("TitleInformationText", () => {
  it("renders label/value pairs in the Text type", () => {
    render(
      <TitleInformationText
        type="text"
        items={[
          { label: "Счёт", value: "40702" },
          { label: "Дата", value: "12.05.2026" },
        ]}
      />
    )
    expect(screen.getByText("Счёт")).toBeInTheDocument()
    expect(screen.getByText("40702")).toBeInTheDocument()
    expect(screen.getByText("12.05.2026")).toBeInTheDocument()
  })
})
