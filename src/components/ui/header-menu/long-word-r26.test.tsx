import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { EmployeeMenu } from "@/components/ui/employee-menu"
import { HeaderMenu } from "./header-menu"
import { MenuBanner } from "./menu-banner"

// r26: длинное слово в подписи ссылки, заголовке группы и тексте баннера
// не переносилось: в узкой колонке меню оно раздвигало колонку (страница
// шире экрана на 345px) или обрезалось баннером. Перенос `anywhere`, а не
// `break-word`: только он уменьшает минимальную ширину по содержимому.

const LONG = "Суперпупердлинноеслововбезпробеловвообщенасотнюсимволов"
const WRAP = "[overflow-wrap:anywhere]"
const groups = [{ value: "g", title: "Заголовок-" + LONG, links: [{ value: "l", label: LONG }] }]

describe("длинное слово в меню", () => {
  it("HeaderMenu: подпись ссылки и заголовок группы переносятся", () => {
    render(<HeaderMenu groups={groups} columns={2} />)
    expect(screen.getByText(LONG).className).toContain(WRAP)
    expect(screen.getByText("Заголовок-" + LONG).className).toContain(WRAP)
  })

  it("EmployeeMenu: заголовок группы переносится", () => {
    render(<EmployeeMenu groups={groups} columns={2} />)
    expect(screen.getByText("Заголовок-" + LONG).className).toContain(WRAP)
  })

  it("MenuBanner: заголовок и подзаголовок переносятся", () => {
    render(<MenuBanner title={"Т" + LONG} subtitle={"П" + LONG} />)
    expect(screen.getByText("Т" + LONG).className).toContain(WRAP)
    expect(screen.getByText("П" + LONG).className).toContain(WRAP)
  })
})
