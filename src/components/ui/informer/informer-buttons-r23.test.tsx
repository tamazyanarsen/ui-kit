import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"

import { Informer } from "./informer"

// Аудит 22: на десктопе перенос кнопок был запрещён (`desktop:flex-nowrap`,
// урок r9 — иначе карточка сжималась в контейнере по содержимому). Но в
// узкой колонке фиксированной ширины (288 на экране 1280) «Дополнительное»
// выходило за неё на 89px. Ряд теперь шириной по содержимому, но не шире
// колонки: переносится в узкой колонке и держит ширину карточки в
// контейнере по содержимому (вклад процентного max-width там не действует).

describe("Informer: ряд кнопок в десктопной форме", () => {
  it("переносится и не шире колонки, ширина — по содержимому", () => {
    render(
      <ViewportScope viewport="desktop">
        <Informer
          title="Title"
          mainButtonLabel="Основное действие"
          additionalButtonLabel="Дополнительное"
        />
      </ViewportScope>
    )
    const row = screen.getByRole("button", { name: "Основное действие" }).parentElement!
    const classes = row.className.split(/\s+/)
    expect(classes).toEqual(expect.arrayContaining(["flex-wrap", "w-max", "max-w-full"]))
    expect(classes).not.toContain("desktop:flex-nowrap")
  })
})
