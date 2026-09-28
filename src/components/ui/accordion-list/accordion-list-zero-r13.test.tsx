import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionList, AccordionListItem } from "./accordion-list"

// Аудит 12: `{description && …}` и `{subtitle && …}` при значении 0 выводили
// голую цифру за заголовком — без своей колонки, цвета и выравнивания.

describe("AccordionListItem: 0 — значение, а не пустота", () => {
  it("description={0} и subtitle={0} стоят в своих колонках", () => {
    render(
      <AccordionList>
        <AccordionListItem title="Платёж" description={0} subtitle={0}>
          Содержимое
        </AccordionListItem>
      </AccordionList>
    )
    const zeros = screen.getAllByText("0")
    expect(zeros).toHaveLength(2)
    for (const zero of zeros) expect(zero.tagName).toBe("SPAN")
    // Колонка суммы — со своим выравниванием вправо.
    expect(zeros.some((zero) => zero.classList.contains("text-right"))).toBe(true)
  })

  it("пустые значения по-прежнему не рисуются", () => {
    const { container } = render(
      <AccordionList>
        <AccordionListItem title="Платёж" description="" subtitle={false}>
          Содержимое
        </AccordionListItem>
      </AccordionList>
    )
    expect(container.querySelector(".text-right")).toBeNull()
  })
})
