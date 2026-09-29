import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Banner } from "./banner"

// Аудит r25: неразрывное слово в строке описания выходило за край баннера
// (в колонке 300px): у абзаца во флекс-строке с маркером не было `min-w-0` и
// `overflow-wrap: anywhere`.

describe("Banner: длинная строка описания", () => {
  it.each(["desktop", "compact", "mobile"] as const)("%s: сжимается и переносится", (size) => {
    render(
      <Banner size={size} title="Заголовок" bullet description={["Договор_поставки_000123456789"]} />
    )
    expect(screen.getByText("Договор_поставки_000123456789")).toHaveClass(
      "min-w-0",
      "flex-1",
      "[overflow-wrap:anywhere]"
    )
  })
})
