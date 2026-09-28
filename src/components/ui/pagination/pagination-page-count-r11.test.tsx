import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Pagination } from "./pagination"

// Аудит r11: блок «Показать на странице» с четырьмя размерами (25/50/75/100)
// не переносился и на полосе 343 вылезал на 33px — горизонтальная прокрутка.
// Перенос — только в мобильной форме: на десктопе ряд прежний, иначе в
// контейнере по содержимому кнопки уходили бы под подпись.

describe("Pagination: выбор размера страницы помещается на узкой ширине", () => {
  it("блок переносится в мобильной форме и не переносится на десктопе", () => {
    const { container } = render(
      <Pagination page={10} totalPages={20} pageCount="100" />
    )
    const block = container.querySelector('[data-slot="pagination-page-count"]')!
    expect(block).toHaveClass("flex-wrap")
    expect(block).toHaveClass("desktop:flex-nowrap")
  })

  // Сверка r11: с зазором 16 умолчание (три кнопки) занимало 312px при
  // полосе 311 и переносилось из-за одного пикселя.
  it("в мобильной форме зазор 12, на десктопе прежний 16", () => {
    const { container } = render(<Pagination page={1} totalPages={20} />)
    const block = container.querySelector('[data-slot="pagination-page-count"]')!
    expect(block).toHaveClass("gap-x-3")
    expect(block).toHaveClass("desktop:gap-x-4")
    expect(block).not.toHaveClass("gap-x-4")
  })
})
