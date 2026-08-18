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

  it("renders the icon named by the `icon` prop", () => {
    const { container } = render(<Tag icon="clock">В обработке</Tag>)
    expect(container.querySelector("svg")).toHaveAttribute("data-icon-name", "clock")
  })

  it("accepts a ready-made node as the icon", () => {
    const { container } = render(
      <Tag icon={<svg data-testid="custom" />}>Активен</Tag>
    )
    expect(container.querySelector('[data-testid="custom"]')).toBeInTheDocument()
  })

  it("omits the icon by default", () => {
    const { container } = render(<Tag>Активен</Tag>)
    expect(container.querySelector("svg")).not.toBeInTheDocument()
  })

  // Size=Desktop/Mobile в Figma — это не проп, а форма: мобильная базовая
  // (18px), десктопная приходит вариантом `desktop:` (дизайн-чек №3 №1).
  it("renders mobile-first sizing with a desktop override", () => {
    render(<Tag>Активен</Tag>)
    const tag = screen.getByText("Активен")
    expect(tag).toHaveClass("h-[18px]")
    expect(tag).toHaveClass("desktop:h-[22px]")
  })
})
