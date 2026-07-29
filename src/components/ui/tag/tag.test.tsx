import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tag } from "./tag"

describe("Tag", () => {
  it("renders its children", () => {
    render(<Tag>Example Text</Tag>)
    expect(screen.getByText("Example Text")).toBeInTheDocument()
  })

  it("applies the status color's background and foreground", () => {
    render(<Tag color="red">Ошибка</Tag>)
    const tag = screen.getByText("Ошибка")
    expect(tag).toHaveStyle({
      backgroundColor: "var(--tag-red-bg)",
      color: "var(--tag-red-fg)",
    })
  })

  it("switches to the secondary (tinted) palette", () => {
    render(
      <Tag color="green" variant="secondary">
        Активен
      </Tag>
    )
    const tag = screen.getByText("Активен")
    expect(tag).toHaveStyle({ backgroundColor: "var(--tag-green-secondary-bg)" })
  })

  it("renders a leading dot when showIcon is set", () => {
    const { container } = render(<Tag showIcon>Активен</Tag>)
    expect(container.querySelector(".rounded-full")).toBeInTheDocument()
  })

  it("omits the dot by default", () => {
    const { container } = render(<Tag>Активен</Tag>)
    expect(container.querySelector(".rounded-full")).not.toBeInTheDocument()
  })

  it("sizes down for the small size", () => {
    render(<Tag size="s">Активен</Tag>)
    expect(screen.getByText("Активен")).toHaveClass("h-[18px]")
  })
})
