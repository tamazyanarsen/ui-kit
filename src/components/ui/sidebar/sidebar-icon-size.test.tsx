import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Home, Payments } from "@/icons"

import { Sidebar } from "./sidebar"
import { SidebarItem, SidebarGroup } from "./item"

// Дизайн-чек от 08.10, замечание 19: в слоте 24×24 должна рисоваться
// 24-я версия глифа (viewBox 0 0 24 24), а не растянутая 16-я.

function viewBoxes(container: HTMLElement) {
  return Array.from(container.querySelectorAll("svg")).map((svg) =>
    svg.getAttribute("viewBox")
  )
}

describe("Sidebar: начертание значков", () => {
  it("развёрнутая панель — пункт и группа берут 24-е начертание", () => {
    const { container } = render(
      <Sidebar defaultOpen>
        <SidebarItem icon={Home} label="Главная" />
        <SidebarGroup value="payments" icon={Payments} label="Платежи">
          <SidebarItem label="СБП" nested />
        </SidebarGroup>
      </Sidebar>
    )
    const icons = container.querySelectorAll('svg[aria-hidden="true"].size-6')
    expect(icons.length).toBe(2)
    icons.forEach((svg) => expect(svg.getAttribute("viewBox")).toBe("0 0 24 24"))
  })

  it("свёрнутая полоса — тоже 24", () => {
    const { container } = render(
      <Sidebar defaultOpen={false}>
        <SidebarItem icon={Home} label="Главная" />
        <SidebarGroup value="payments" icon={Payments} label="Платежи">
          <SidebarItem label="СБП" nested />
        </SidebarGroup>
      </Sidebar>
    )
    expect(viewBoxes(container).filter((v) => v === "0 0 16 16")).toEqual([])
  })
})
