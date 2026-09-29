import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FilterTableSelect } from "./filter-table-select"

// Раунд 27: чип с длинным значением выпирал из узкой колонки (пилюля
// шириной 256 в колонке 200 или 288 с соседом). Обёртка обязана быть
// флекс-контейнером, ограниченным колонкой и способным сжиматься, — тогда
// пилюля (потолок 256 на ней самой) сжимается вместе с ней. Раскладка
// проверена в живом Chrome; в jsdom верны только классы обёртки.

describe("FilterTableSelect: узкая колонка", () => {
  it("обёртка чипа ограничена колонкой и может сжиматься", () => {
    const { container } = render(
      <FilterTableSelect label="Фильтр" defaultValue="Очень длинное значение фильтра" />
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveClass("flex", "max-w-full", "min-w-0")
    // Потолок пилюли (макет: максимум 256) остаётся на ней самой.
    expect(wrapper.querySelector('[data-slot="filter"]')).toHaveClass("max-w-64")
  })
})
