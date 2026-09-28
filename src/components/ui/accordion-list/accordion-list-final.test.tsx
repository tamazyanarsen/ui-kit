import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionList, AccordionListItem } from "./accordion-list"

// Финальный аудит:
// 1. у `role="list"` не было элементов списка — скринридер объявлял пустой
//    список;
// 2. флажок строки с заголовком-разметкой оставался без имени.

describe("AccordionList: разметка списка", () => {
  it("пункты внутри списка — элементы списка", () => {
    render(
      <AccordionList>
        <AccordionListItem title="Первая">Содержимое</AccordionListItem>
        <AccordionListItem title="Вторая">Содержимое</AccordionListItem>
      </AccordionList>
    )
    const list = screen.getByRole("list")
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    screen.getAllByRole("listitem").forEach((item) => expect(list).toContainElement(item))
  })

  it("пункт вне списка роли listitem не получает", () => {
    render(<AccordionListItem title="Одна">Содержимое</AccordionListItem>)
    expect(screen.queryByRole("listitem")).toBeNull()
  })
})

describe("AccordionListItem: имя флажка", () => {
  it("заголовок-разметка даёт флажку имя", () => {
    render(
      <AccordionListItem title={<span>Договор №7</span>} showCheckbox>
        Содержимое
      </AccordionListItem>
    )
    expect(screen.getByRole("checkbox", { name: "Договор №7" })).toBeInTheDocument()
  })

  it("checkboxLabel задаёт имя явно", () => {
    render(
      <AccordionListItem title={<span>Договор</span>} showCheckbox checkboxLabel="Выбрать договор">
        Содержимое
      </AccordionListItem>
    )
    expect(screen.getByRole("checkbox", { name: "Выбрать договор" })).toBeInTheDocument()
  })

  it("строковый заголовок — прежнее имя «Выбрать: …»", () => {
    render(
      <AccordionListItem title="Договор" showCheckbox>
        Содержимое
      </AccordionListItem>
    )
    expect(screen.getByRole("checkbox", { name: "Выбрать: Договор" })).toBeInTheDocument()
  })
})
