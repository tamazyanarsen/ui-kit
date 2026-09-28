import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import * as glyphs from "@/icons"

import { Icon, ICON_NAMES, ICON_REGISTRY } from "./icon"

function toKebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

describe("Icon: псевдонимы", () => {
  it("находит каждый экспорт набора по имени, включая псевдонимы", () => {
    const missing = Object.entries(glyphs)
      .filter(([, value]) => typeof value === "function")
      .map(([name]) => toKebab(name))
      .filter((name) => !ICON_REGISTRY.has(name))
    expect(missing).toEqual([])
  })

  it("open-eye и chevron-down рисуются, а не дают пустоту", () => {
    for (const name of ["open-eye", "chevron-down"]) {
      const { container, unmount } = render(<Icon name={name} />)
      expect(container.querySelector("svg")).not.toBeNull()
      unmount()
    }
  })

  it("в списке для контролов одно имя на глиф", () => {
    const glyphsInList = ICON_NAMES.map((name) => ICON_REGISTRY.get(name))
    expect(new Set(glyphsInList).size).toBe(ICON_NAMES.length)
  })
})
