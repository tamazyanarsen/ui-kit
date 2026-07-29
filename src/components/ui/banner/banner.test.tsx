import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Banner } from "./banner"

describe("Banner", () => {
  it("renders the title and description", () => {
    render(<Banner title="Заголовок" description="Описание баннера" />)
    expect(screen.getByText("Заголовок")).toBeInTheDocument()
    expect(screen.getByText("Описание баннера")).toBeInTheDocument()
  })

  it("renders one line per description item with a bullet", () => {
    render(
      <Banner
        title="Заголовок"
        description={["Первая строка", "Вторая строка"]}
        bullet
      />
    )
    expect(screen.getByText("Первая строка")).toBeInTheDocument()
    expect(screen.getByText("Вторая строка")).toBeInTheDocument()
  })

  it("renders the CTA button and calls onCtaClick", async () => {
    const user = userEvent.setup()
    const onCtaClick = vi.fn()
    render(<Banner title="Заголовок" ctaLabel="Подробнее" onCtaClick={onCtaClick} />)

    await user.click(screen.getByRole("button", { name: "Подробнее" }))

    expect(onCtaClick).toHaveBeenCalledTimes(1)
  })

  it("omits the CTA button when no ctaLabel is given", () => {
    render(<Banner title="Заголовок" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("shows a placeholder icon when no image src is given", () => {
    const { container } = render(<Banner title="Заголовок" image />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders a real image when imageSrc is given", () => {
    render(<Banner title="Заголовок" image imageSrc="/hero.png" imageAlt="Hero" />)
    expect(screen.getByRole("img", { name: "Hero" })).toHaveAttribute("src", "/hero.png")
  })

  it("exposes size and color via data attributes", () => {
    const { container } = render(<Banner title="Заголовок" size="mobile" color="blue" />)
    const root = container.querySelector('[data-slot="banner"]')
    expect(root).toHaveAttribute("data-size", "mobile")
    expect(root).toHaveAttribute("data-color", "blue")
  })
})
