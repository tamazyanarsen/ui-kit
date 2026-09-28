import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { LettersOfCreditScreen } from "./screen"

// Добор покрытия к исправлениям таблиц (раунд 1), песочница: экран отдаёт
// таблице уже вырезанную страницу, поэтому сортировать обязан ВЕСЬ отбор
// сам, а не оставлять это таблице — та переставила бы строки лишь внутри
// страницы.

function firstRowText() {
  const row = document.querySelector('tbody [data-slot="table-row"]')
  return row?.textContent ?? ""
}

function renderScreen() {
  return render(
    <ToastProvider>
      <LettersOfCreditScreen />
    </ToastProvider>
  )
}

async function clickHeader(title: string) {
  const header = screen.getByRole("columnheader", { name: title })
  await userEvent.click(within(header).getByText(title))
}

describe("Реестр заявок на аккредитив: сортировка по всему отбору", () => {
  it("самая поздняя дата всего набора встаёт первой, хотя её нет на первой странице", async () => {
    renderScreen()
    // В данных самая поздняя дата — 28.02.2026 (строка 56), а на первой
    // странице из 25 строк самая поздняя — 24.02.2026. Направление первого
    // нажатия не важно: смотрим оба.
    const firsts: string[] = []
    await clickHeader("Дата")
    firsts.push(firstRowText())
    await clickHeader("Дата")
    firsts.push(firstRowText())

    expect(firsts.some((text) => text.includes("28.02.2026"))).toBe(true)
  }, 20000)

  it("смена сортировки возвращает на первую страницу", async () => {
    renderScreen()
    await userEvent.click(screen.getByRole("button", { name: "2" }))
    const secondPage = firstRowText()

    await clickHeader("Дата")
    await clickHeader("Дата")

    // Первая строка — снова из начала отсортированного набора, а не 26-я.
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page")
    expect(firstRowText()).not.toBe(secondPage)
  }, 20000)
})
