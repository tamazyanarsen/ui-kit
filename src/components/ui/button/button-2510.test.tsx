import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Download } from "@/icons"

import { Button } from "./button"

// Правки UI-Kit от 25.10, «Button — сжатие при нажатии меняет габаритную
// рамку» и «маленькие кнопки не сжимаются». Сама кнопка больше не
// масштабируется (`press-clip` вместо `press-scale`), всё содержимое — в
// одной обёртке, которую сжимает утилита.

const rules = readFileSync(path.resolve(process.cwd(), "src/styles/rules-press.css"), "utf8")

describe("Button: press-clip вместо press-scale", () => {
  it("кнопка не масштабируется — нажатие через press-clip", () => {
    render(<Button>Сохранить</Button>)
    const button = screen.getByRole("button", { name: "Сохранить" })
    expect(button).toHaveClass("press-clip")
    expect(button).not.toHaveClass("press-scale")
  })

  it("значок и подпись — в одной обёртке, единственном ребёнке кнопки", () => {
    render(
      <Button icon={Download} iconPosition="left">
        Скачать
      </Button>
    )
    const button = screen.getByRole("button", { name: "Скачать" })
    expect(button.children).toHaveLength(1)
    const content = button.firstElementChild as HTMLElement
    expect(content).toHaveAttribute("data-slot", "button-content")
    expect(content.querySelector("svg")).not.toBeNull()
    // Голый текст подписи — тоже внутри обёртки, а не прямым узлом кнопки.
    expect(content).toHaveTextContent("Скачать")
    expect([...button.childNodes].every((n) => n === content)).toBe(true)
  })

  it("обёртка наследует зазор и выравнивание кнопки", () => {
    render(<Button>Сохранить</Button>)
    const content = screen.getByRole("button").firstElementChild as HTMLElement
    expect(content.className).toContain("[gap:inherit]")
    expect(content.className).toContain("[justify-content:inherit]")
  })

  it("в загрузке спиннер и копия подписи — тоже в обёртке", () => {
    render(<Button isLoading>Сохранить</Button>)
    const button = screen.getByRole("button", { name: "Сохранить" })
    expect(button.children).toHaveLength(1)
    expect(button.firstElementChild).toHaveAttribute("data-slot", "button-content")
  })

  it.each([
    ["sm", "[--press-radius:16px]"],
    ["default", "[--press-radius:12px]"],
    ["lg", "[--press-radius:16px]"],
  ] as const)("радиус обрезки у размера %s — радиус кнопки", (size, cls) => {
    render(<Button size={size}>Сохранить</Button>)
    expect(screen.getByRole("button").className).toContain(cls)
  })

  it("у M на десктопе радиус обрезки 16, как и у самой кнопки", () => {
    render(<Button>Сохранить</Button>)
    expect(screen.getByRole("button").className).toContain("desktop:[--press-radius:16px]")
  })

  it("className потребителя сохраняется", () => {
    render(<Button className="w-full justify-between">Сохранить</Button>)
    expect(screen.getByRole("button")).toHaveClass("w-full", "justify-between", "press-clip")
  })

  it("кнопка с тенью: обрезка покоя не режет тень", () => {
    render(<Button className="shadow-universal">Наверх</Button>)
    expect(screen.getByRole("button").className).toContain(
      "[&.shadow-universal]:[clip-path:inset(-24px_round_calc(var(--press-radius,0px)+24px))]"
    )
  })
})

describe("Button 32×32: сжатие заметно", () => {
  it("icon-sm — это size-8, на него действует правило 32×32", () => {
    render(<Button size="sm" iconPosition="only" icon={Download} aria-label="Скачать" />)
    expect(screen.getByRole("button", { name: "Скачать" })).toHaveClass("size-8")
  })

  it("rules-press.css: у size-8 inset 1.5px и коэффициент 0.92", () => {
    const block = rules.match(/\.group\\\/button\.size-8\s*\{([^}]*)\}/)
    expect(block).not.toBeNull()
    expect(block![1]).toMatch(/--press-inset:\s*1\.5px/)
    expect(block![1]).toMatch(/--press-scale:\s*0\.92/)
  })

  it("rules-press.css: rounded-none и rounded-full потребителя меняют радиус обрезки", () => {
    expect(rules).toMatch(/\.group\\\/button\.rounded-none\s*\{\s*--press-radius:\s*0px/)
    expect(rules).toMatch(/\.group\\\/button\.rounded-full\s*\{\s*--press-radius:\s*9999px/)
  })
})
