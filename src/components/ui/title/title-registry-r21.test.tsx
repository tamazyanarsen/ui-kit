import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { TitleRegistry } from "./title-registry"

// Аудит 20: ряд действий стоял `shrink-0` без переноса, и на узкой ширине
// заголовок сжимался до пары букв (43px в полосе 288), а две кнопки
// вылезали за край на 41–217px. Раскладку jsdom не считает — проверяем
// классы, которые её задают (замеры в Chrome — в отчёте круга r21).

describe("TitleRegistry: действия не съедают заголовок", () => {
  it("в мобильной форме действия под заголовком, на десктопе — рядом с переносом", () => {
    render(
      <TitleRegistry
        title="Реестр платёжных поручений"
        actions={
          <>
            <Button size="sm">Создать</Button>
            <Button size="sm">Импорт</Button>
          </>
        }
      />
    )
    const heading = screen.getByRole("heading", { name: "Реестр платёжных поручений" })
    const row = heading.parentElement!
    expect(row).toHaveClass("flex-col", "desktop:flex-row", "desktop:flex-wrap")
    // Горизонтальный зазор на десктопе прежний — в широком контейнере
    // раскладка не меняется.
    expect(row).toHaveClass("desktop:gap-x-12")
    expect(heading).toHaveClass("desktop:min-w-[min(100%,200px)]")

    const actions = screen.getByRole("button", { name: "Создать" }).parentElement!
    expect(actions).toHaveClass("flex-wrap", "max-w-full")
  })
})
