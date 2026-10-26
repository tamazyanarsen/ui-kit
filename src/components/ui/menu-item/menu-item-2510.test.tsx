import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { MenuItemContent, menuItemRowClass } from "./menu-item"

// Правки UI-Kit от 25.10: строки списков сжимаются к центру одним целым,
// текст переносится, курсор — рука.

describe("MenuItemContent: одна обёртка", () => {
  it("значок, текст и замыкающий элемент лежат в одной обёртке", () => {
    const { container } = render(
      <div className={menuItemRowClass("menu-row")}>
        <MenuItemContent leading={<i>L</i>} description="Описание" trailing={<b>T</b>}>
          Пункт
        </MenuItemContent>
      </div>
    )
    const row = container.firstElementChild!
    expect(row.children).toHaveLength(1)
    const wrapper = row.firstElementChild!
    expect(wrapper).toHaveAttribute("data-slot", "menu-item-content")
    // Раскладку обёртка наследует от строки — перекрытия `items-center
    // gap-2` у потребителя продолжают работать.
    expect(wrapper).toHaveClass("[align-items:inherit]", "[gap:inherit]", "flex-1")
  })

  it("текст переносится, многоточия нет", () => {
    const { container } = render(
      <MenuItemContent label="Подпись" description="Описание">
        Пункт
      </MenuItemContent>
    )
    expect(container.querySelector(".truncate")).toBeNull()
    expect(container.querySelector('[class*="overflow-wrap:anywhere"]')).not.toBeNull()
  })
})

describe("menuItemRowClass: сжатие к центру, без cursor-default", () => {
  it("опора сжатия не задана (центр), курсор не стрелка", () => {
    const cls = menuItemRowClass("menu-row")
    expect(cls).toContain("press-scale-content")
    expect(cls).toContain("menu-row")
    expect(cls).not.toContain("--press-origin")
    expect(cls).not.toContain("cursor-default")
  })
})

describe("styles/rules-lists.css: курсор строк", () => {
  const css = readFileSync(resolve(__dirname, "../../../styles/rules-lists.css"), "utf8")
  it("строка — рука, выключенная — not-allowed", () => {
    expect(css).toMatch(/\.menu-row\s*\{\s*cursor:\s*pointer;?\s*\}/)
    expect(css).toMatch(
      /\.menu-row:is\([^)]*\[data-disabled\][^)]*\)\s*\{\s*cursor:\s*not-allowed;?\s*\}/
    )
  })
})
