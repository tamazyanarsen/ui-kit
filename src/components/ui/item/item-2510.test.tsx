import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Item } from "./item"
import { ItemGroup } from "./item-group"

// Правки UI-Kit от 25.10: Item — наведение Grey 114 (только мышь), нажатие
// Grey 124, сжатие при нажатии (десктоп — строка целиком до 0,98, мобильный
// вид — содержимое одной обёрткой до 0,97), нажатие вложенного контрола
// строку не нажимает; разделитель не зависит от обёрток вокруг строк
// (`ItemGroup`).

const rules = readFileSync(
  path.resolve(process.cwd(), "src/styles/component-rules.css"),
  "utf8"
)
const tokens = readFileSync(
  path.resolve(process.cwd(), "src/styles/tokens-content.css"),
  "utf8"
)

/** Селекторы правил Item, гасящих линию: [последняя, наведение, нажатие]. */
function dividerRules(): string[] {
  const start = rules.indexOf('[data-slot="item"]:last-child:not(:only-child, [data-slot="item-group"] *)')
  const end = rules.indexOf("/* Information Field в стопке")
  const section = rules.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, "")
  return [...section.matchAll(/([^{}]+)\{\s*opacity: 0;/g)].map((match) =>
    match[1].replace(/@media[^{]*\{/, "").trim()
  )
}

/** `:active` в jsdom не наступает — нажатие помечается атрибутом. */
const asTest = (selector: string) => selector.replace(/:active/g, "[data-active]")

/** Селектор из произвольного варианта класса `[<sel>]:<утилита>`. */
function variantSelector(className: string, utility: string, self: string): string {
  const token = className.split(/\s+/).find((cls) => cls.endsWith(`]:${utility}`) && cls.startsWith("[&"))
  expect(token, `класс с ${utility}`).toBeDefined()
  const variant = token!.slice(1, token!.length - utility.length - 2)
  return asTest(variant.replace("&", self))
}

const row = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("[data-slot='item']")!

describe("Item: наведение и нажатие", () => {
  it("наведение Grey 114 только у настоящего курсора, нажатие — своим токеном Grey 124", () => {
    const { container } = render(<Item value="Значение" />)
    const cls = row(container).className
    expect(cls).toContain("[@media(pointer:fine)]:not-data-[disabled]:hover:bg-[var(--item-hover-bg)]")
    expect(cls).not.toContain("active:bg-[var(--item-hover-bg)]")
    expect(cls).toMatch(/\]:bg-\[var\(--item-pressed-bg\)\]/)
    expect(tokens).toMatch(/--item-pressed-bg:\s*var\(--grey-124\)/)
  })

  it("нажатие вложенного Toggle не подсвечивает строку, нажатие самой строки и её подложки — подсвечивает", () => {
    const { container } = render(
      <Item value="Значение" rightElement="toggle" onClick={() => {}} />
    )
    const item = row(container)
    const pressed = variantSelector(item.className, "bg-[var(--item-pressed-bg)]", "[data-slot=item]")

    item.setAttribute("data-active", "")
    expect(item.matches(pressed)).toBe(true)

    const pressTarget = item.querySelector("[data-slot='press-target']")!
    pressTarget.setAttribute("data-active", "")
    expect(item.matches(pressed)).toBe(true)
    pressTarget.removeAttribute("data-active")

    const toggle = item.querySelector("[role='switch']")!
    toggle.setAttribute("data-active", "")
    expect(item.matches(pressed)).toBe(false)
  })

  it("нажатие «i» и чекбокса строку тоже не нажимает", () => {
    for (const rightElement of ["information", "checkbox"] as const) {
      const { container, unmount } = render(
        <Item value="Значение" rightElement={rightElement} informationText="Подсказка" />
      )
      const item = row(container)
      const pressed = variantSelector(item.className, "bg-[var(--item-pressed-bg)]", "[data-slot=item]")
      item.setAttribute("data-active", "")
      const control = item.querySelector(
        rightElement === "checkbox" ? "[role='checkbox']" : "button[aria-label='Информация']"
      )!
      control.setAttribute("data-active", "")
      expect(item.matches(pressed)).toBe(false)
      unmount()
    }
  })

  it("десктоп: строка целиком сжимается до 0,98; в мобильном виде сама строка не масштабируется", () => {
    const { container } = render(<Item value="Значение" />)
    const tokens = row(container).className.split(/\s+/)
    const scales = tokens.filter((cls) => /:scale-/.test(cls))
    expect(scales).toHaveLength(1)
    expect(scales[0]).toMatch(/^motion-safe:desktop:\[&:active.*\]:scale-\[\.98\]$/)
  })

  it("мобильный вид: содержимое — одна обёртка, она сжимается до 0,97 к центру строки; линия и подложка — вне её", () => {
    const { container } = render(
      <Item value="Значение" comment="Комментарий" thumbnail rightElement="navigation" />
    )
    const item = row(container)
    const content = item.querySelector<HTMLElement>(":scope > [data-slot='item-content']")
    expect(content).not.toBeNull()
    // Значок, текст и правая часть — внутри обёртки.
    expect(content!.querySelector("svg")).not.toBeNull()
    expect(content!.textContent).toContain("Значение")
    expect(content!.querySelectorAll(":scope > *")).toHaveLength(2)
    // Линия и подложка не сжимаются.
    expect(content!.querySelector("[data-slot='item-divider']")).toBeNull()
    expect(content!.querySelector("[data-slot='press-target']")).toBeNull()

    expect(content!.className).toContain("origin-center")
    expect(content!.className).toMatch(/motion-safe:\[\[data-slot=item\]:active.*>&\]:scale-\[\.97\]/)
    expect(content!.className).toMatch(/desktop:\[\[data-slot=item\]:active.*>&\]:scale-none/)
    // Отпускание 280 мс по мягкой кривой — через `--press-t` строки.
    expect(content!.className).toContain("[transition:scale_var(--press-t)]")
    expect(item.className).toContain("[--press-t:var(--duration-release)_var(--ease-soft)]")
  })

  it("подкатегория: точка сжатия — центр строки, а не центр сдвинутой обёртки", () => {
    const { container } = render(<Item value="Значение" subCategory />)
    const content = container.querySelector<HTMLElement>("[data-slot='item-content']")!
    expect(content.className).toContain("origin-[calc(50%-32px)_50%]")
  })
})

describe("Item: разделитель в ItemGroup", () => {
  const [lastRule, , pressRule] = dividerRules()

  const dividers = (container: HTMLElement) => [
    ...container.querySelectorAll<HTMLElement>("[data-slot='item-divider']"),
  ]
  const hidden = (container: HTMLElement, selector = lastRule) =>
    dividers(container).map((divider) => divider.matches(selector))

  it("строки, обёрнутые каждая в свой div, сохраняют линии; нет её только у последней", () => {
    const { container } = render(
      <ItemGroup>
        {["Дела", "Проекты", "Счета"].map((value) => (
          <div key={value}>
            <Item value={value} />
          </div>
        ))}
      </ItemGroup>
    )
    expect(hidden(container)).toEqual([false, false, true])
  })

  it("строки прямо в группе — так же", () => {
    const { container } = render(
      <ItemGroup>
        <Item value="Дела" />
        <Item value="Проекты" divider />
        <Item value="Счета" divider />
      </ItemGroup>
    )
    expect(hidden(container)).toEqual([false, false, true])
  })

  it("одиночный ряд группы: линии нет, явный divider её возвращает", () => {
    const plain = render(
      <ItemGroup>
        <div>
          <Item value="Дела" />
        </div>
      </ItemGroup>
    )
    expect(hidden(plain.container)).toEqual([true])
    plain.unmount()

    const explicit = render(
      <ItemGroup>
        <div>
          <Item value="Дела" divider />
        </div>
      </ItemGroup>
    )
    expect(hidden(explicit.container)).toEqual([false])
  })

  it("без группы — прежние правила по соседям", () => {
    const list = render(
      <div>
        <Item value="Дела" />
        <Item value="Проекты" />
      </div>
    )
    expect(hidden(list.container)).toEqual([false, true])
    list.unmount()

    const single = render(<Item value="Дела" />)
    expect(hidden(single.container)).toEqual([true])
    single.unmount()

    const singleOn = render(<Item value="Дела" divider />)
    expect(hidden(singleOn.container)).toEqual([false])
  })

  it("нажатая обёрнутая строка гасит линию ряда над собой, нажатый вложенный контрол — нет", () => {
    const { container } = render(
      <ItemGroup>
        <div>
          <Item value="Дела" />
        </div>
        <div>
          <Item value="Проекты" rightElement="toggle" />
        </div>
        <div>
          <Item value="Счета" />
        </div>
      </ItemGroup>
    )
    const press = asTest(pressRule)
    const rows = [...container.querySelectorAll<HTMLElement>("[data-slot='item']")]
    rows[1].setAttribute("data-active", "")
    expect(hidden(container, press)).toEqual([true, true, false])

    rows[1].querySelector("[role='switch']")!.setAttribute("data-active", "")
    expect(hidden(container, press)).toEqual([false, false, false])
  })
})

describe("ItemGroup", () => {
  it("корень с data-slot; bleed — только в мобильном виде выходит на поля блока и обрезает по скруглению", () => {
    const { container } = render(<ItemGroup bleed />)
    const group = container.querySelector<HTMLElement>("[data-slot='item-group']")!
    expect(group.className).toContain("-mx-[var(--item-group-bleed-x,16px)]")
    expect(group.className).toContain("-mb-[var(--item-group-bleed-bottom,16px)]")
    expect(group.className).toContain("overflow-clip")
    expect(group.className).toContain("desktop:mx-0")
    expect(group.className).toContain("desktop:mb-0")
  })

  it("без bleed полей не трогает", () => {
    const { container } = render(<ItemGroup />)
    const group = container.querySelector<HTMLElement>("[data-slot='item-group']")!
    expect(group.className).not.toContain("-mx-")
  })
})
