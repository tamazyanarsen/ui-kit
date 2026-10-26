import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { PromoBanner } from "./promo-banner"

// Правки UI-Kit от 25.10, «Карусель баннеров в мобильном виде»: ограничения
// текста и высоты баннера (16 + 20 + 4 + 32 + 24 + 32 + 16 = 144).

describe("PromoBanner, мобильный вид", () => {
  it("заголовок — одна строка с многоточием, поля 16", () => {
    render(<PromoBanner title="Очень длинный заголовок" description="Описание" />)
    const title = screen.getByText("Очень длинный заголовок")
    for (const cls of ["truncate", "px-4", "pt-4", "mb-1", "text-p1-medium-adaptive"]) {
      expect(title.className).toContain(cls)
    }
  })

  it("описание — две строки с многоточием, место всегда 32", () => {
    render(<PromoBanner title="Заголовок" />)
    const description = document.querySelector('[data-slot="promo-banner-description"]') as HTMLElement
    expect(description.className).toContain("line-clamp-2")
    expect(description.className).toContain("h-8")
    expect(description.className).toContain("text-p2-medium-adaptive")
  })

  it("кнопка sm через 24 от описания", () => {
    render(<PromoBanner title="Заголовок" description="Описание" actionLabel="Подробнее" />)
    const button = screen.getByRole("button", { name: "Подробнее" })
    expect(button.className).toContain("mt-6")
    expect(button.className).toContain("h-8")
  })

  it("картинка в правом нижнем углу", () => {
    render(<PromoBanner title="Заголовок" imageSrc="/x.png" imageAlt="Картинка" />)
    const img = screen.getByRole("img", { name: "Картинка" })
    expect(img.className).toContain("object-right-bottom")
    expect(img.parentElement?.className).toContain("items-end")
    expect(img.parentElement?.className).toContain("justify-end")
  })
})
