import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CountButton } from "./count-button"

// Ревью 10.10, п. 13: обёртка «кнопка + значок» занимает место в раскладке,
// но классов не принимала — `className` уходил в кнопку внутри неё, и
// `w-full` или внешний отступ не давали видимого эффекта.
describe("CountButton: классы обёртки (ревью 10.10, п. 13)", () => {
  it("rootClassName — обёртке, className — кнопке", () => {
    const { container } = render(
      <CountButton count={3} rootClassName="w-full" className="justify-start">
        Фильтры
      </CountButton>
    )
    const root = container.querySelector('[data-slot="count-button"]')!
    expect(root.className).toContain("w-full")
    expect(root.className).toContain("relative")
    expect(screen.getByRole("button", { name: "Фильтры" }).className).toContain("justify-start")
    expect(screen.getByRole("button", { name: "Фильтры" }).className).not.toContain("w-full")
  })
})
