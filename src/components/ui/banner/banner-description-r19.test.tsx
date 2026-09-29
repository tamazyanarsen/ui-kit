import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Banner } from "./banner"

// Аудит 18: строки описания, собранные условиями (`hasB && "…"`, `null`),
// становились пунктами — маркер без текста; пустой массив давал пустой блок
// описания и лишний зазор под заголовком.

const SIZES = ["desktop", "compact", "mobile"] as const

describe("Banner: пустые строки описания не рисуются", () => {
  it.each(SIZES)("%s: false, null и пустая строка отбрасываются", (size) => {
    const { container } = render(
      <Banner
        size={size}
        bullet
        title="Кредит"
        description={["До 10 млн ₽", false, null, ""]}
      />
    )
    const rows = container.querySelectorAll(".items-start")
    expect(rows).toHaveLength(1)
    expect(rows[0].textContent).toBe("До 10 млн ₽")
  })

  it.each(SIZES)("%s: пустой массив — блока описания нет", (size) => {
    const { container } = render(<Banner size={size} title="Кредит" description={[]} />)
    // Пустой блок описания — `div.flex-col` без детей (у mobile свой кегль,
    // поэтому ищем по форме, а не по классу текста).
    const empty = [...container.querySelectorAll("div.flex-col")].filter(
      (el) => el.childElementCount === 0
    )
    expect(empty).toHaveLength(0)
  })
})
