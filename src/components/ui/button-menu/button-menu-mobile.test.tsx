import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenu } from "./root"

// Size=Mobile мастера «ELK / button menu»: форму выбирает вариант `desktop:`,
// а не принудительная десктопная область, как было до дизайн-чека с мобильной
// версией.
describe("ButtonMenu — мобильная форма", () => {
  const bar = (container: HTMLElement) =>
    container.querySelector("[data-slot=button-menu]") as HTMLElement

  it("не навязывает десктоп: поля и маска мобильные, десктопные — за desktop:", () => {
    const { container } = render(
      <ButtonMenu>
        <Button>Сохранить</Button>
      </ButtonMenu>
    )
    const cls = bar(container).className
    expect(cls).toContain("px-4")
    expect(cls).toContain("pb-6")
    expect(cls).toContain("bg-[linear-gradient(")
    expect(cls).toContain("desktop:px-[31px]")
    expect(cls).toContain("desktop:bg-none")
    expect(cls).toContain("desktop:shadow-universal")
    expect(cls).toContain("desktop:rounded-t-[16px]")
    expect(cls).not.toMatch(/(^|\s)shadow-universal/)
    expect(container.closest("[data-viewport]")).toBeNull()
  })

  it("первая кнопка тянется на мобиле и сжимается до содержимого с desktop", () => {
    const { container } = render(
      <ButtonMenu>
        <Button>Первая</Button>
        <Button variant="secondary-grey">Вторая</Button>
      </ButtonMenu>
    )
    const visible = container.querySelector("[data-slot=button-menu-row]")!.querySelectorAll(":scope > button")
    expect(visible[0].className).toContain("flex-1")
    expect(visible[0].className).toContain("desktop:flex-none")
    expect(visible[1]?.className ?? "").not.toContain("flex-1")
  })

  it("отлипшая полоса сохраняет скругление по кругу", () => {
    const { container } = render(
      <ButtonMenu detached>
        <Button>Ок</Button>
      </ButtonMenu>
    )
    expect(bar(container).className).toContain("rounded-[16px]")
  })
})
