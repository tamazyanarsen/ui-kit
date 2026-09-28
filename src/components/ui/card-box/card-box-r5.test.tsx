import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CardBox } from "./card-box"

// Итоговая проверка №4: у `type="small"` без заголовка верхний отступ давала
// только шапка — без неё контент упирался в верхний край карточки.

const scrollArea = (content: HTMLElement) =>
  content.closest('[data-slot="scrollbar"]') ?? content.parentElement!

describe("CardBox small: верхний отступ без шапки", () => {
  it("без заголовка у области прокрутки есть верхний отступ", () => {
    render(
      <CardBox type="small" showTitle={false} title="Скрыт">
        <p>Контент</p>
      </CardBox>
    )
    expect(scrollArea(screen.getByText("Контент")).className).toMatch(/\bpt-4\b/)
  })

  it("с заголовком отступ по-прежнему даёт шапка", () => {
    render(
      <CardBox type="small" title="Заголовок">
        <p>Контент</p>
      </CardBox>
    )
    expect(scrollArea(screen.getByText("Контент")).className).not.toMatch(/\bpt-4\b/)
  })
})
