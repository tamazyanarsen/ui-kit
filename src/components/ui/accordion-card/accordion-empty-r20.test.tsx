import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { AccordionCard } from "./accordion-card"
import { AccordionList, AccordionListItem } from "@/components/ui/accordion-list"

// Аудит 19: `{children && …}` пропускал пустой массив (он истинный) — в
// раскрытом виде рисовалась пустая панель с разделителем и отступами
// (33px у карточки, лишние 24px у строки списка).

describe("Аккордеоны без содержимого не рисуют панель", () => {
  it.each([
    ["пустой массив", []],
    ["фрагмент из null и false", <>{null}{false}</>],
  ])("AccordionCard: %s", (_, children) => {
    const { container } = render(
      <AccordionCard title="Документы" defaultOpen>
        {children}
      </AccordionCard>
    )
    expect(container.querySelector('[data-slot="accordion-card-panel"]')).toBeNull()
  })

  it("AccordionListItem: пустой массив", () => {
    const { container } = render(
      <AccordionList>
        <AccordionListItem title="Платёж" defaultOpen>
          {[]}
        </AccordionListItem>
      </AccordionList>
    )
    expect(container.querySelector('[data-slot="accordion-list-panel"]')).toBeNull()
  })

  it("с содержимым панель на месте", () => {
    const { container } = render(
      <AccordionCard title="Документы" defaultOpen>
        {["Договор.pdf"].map((name) => <p key={name}>{name}</p>)}
      </AccordionCard>
    )
    expect(container.querySelector('[data-slot="accordion-card-panel"]')).not.toBeNull()
  })
})
