import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { AccordionList, AccordionListItem } from "./accordion-list"

// Size=Mobile: описание и кнопки уезжают в отдельную строку под заголовком
// той же сеткой, что и desktop-строка (раскладку выбирает вариант `desktop:`).
describe("AccordionListItem — мобильная раскладка", () => {
  // Сетку держит шапка строки, а не сам триггер: триггер с ревью 10.10
  // (п. 25) — кнопка внутри заголовка.
  const header = (el: HTMLElement) =>
    el.querySelector("[data-slot=accordion-list-header]") as HTMLElement

  it("шапка — сетка на мобиле и flex с desktop", () => {
    const { container } = render(
      <AccordionList>
        <AccordionListItem title="T" description="Подписано" showButtons />
      </AccordionList>
    )
    const cls = header(container).className
    expect(cls).toContain("grid")
    expect(cls).toContain("desktop:flex")
  })

  it("описание стоит в третьей строке сетки, заголовок — в первой", () => {
    const { getByText } = render(
      <AccordionList>
        <AccordionListItem title="Заголовок" subtitle="Под" description="Подписано" />
      </AccordionList>
    )
    expect(getByText("Подписано").className).toContain("row-start-3")
    expect(getByText("Заголовок").closest("h3")!.className).toContain("row-start-1")
    expect(getByText("Под").className).toContain("row-start-2")
  })

  it("без описания кнопки занимают строку от левого края", () => {
    const { container } = render(
      <AccordionList>
        <AccordionListItem title="T" showButtons />
      </AccordionList>
    )
    const group = container
      .querySelector('[aria-label="Ещё"]')!
      .closest("span.row-start-3") as HTMLElement
    expect(group.className).toContain("col-start-1")
  })

  it("без кнопок пустая обёртка в третьей строке не создаётся", () => {
    const { container } = render(
      <AccordionList>
        <AccordionListItem title="T" />
      </AccordionList>
    )
    expect(container.querySelector(".row-start-3")).toBeNull()
  })
})
