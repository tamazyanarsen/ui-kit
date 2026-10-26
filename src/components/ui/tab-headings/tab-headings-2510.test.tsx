import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TabHeadings } from "./tab-headings"

// Правки UI-Kit от 25.10, «место под кольцо фокуса в прокручиваемых рядах»:
// ряд вкладок держит запас `--ring-room` со всех сторон — полем внутри и
// таким же отрицательным полем снаружи.
describe("TabHeadings: запас под кольцо фокуса", () => {
  it("токен --ring-room: 4px", () => {
    const css = readFileSync(
      path.resolve(process.cwd(), "src/styles/rules-overlays.css"),
      "utf8"
    )
    expect(css).toMatch(/--ring-room:\s*4px/)
  })

  it("поле и отрицательное поле по обеим осям, ширина на два запаса больше", () => {
    render(
      <TabHeadings
        items={[
          { value: "a", label: "Избранное" },
          { value: "b", label: "Все разделы" },
        ]}
      />
    )
    const row = document.querySelector<HTMLElement>('[data-slot="tab-headings"]')!
    const classes = row.className.split(/\s+/)
    expect(classes).toContain("p-(--ring-room)")
    expect(classes).toContain("-m-(--ring-room)")
    expect(classes).toContain("w-[calc(100%+2*var(--ring-room))]")
    expect(classes).not.toContain("w-full")
  })
})
