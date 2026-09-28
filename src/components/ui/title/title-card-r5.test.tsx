import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { TitleCard } from "./title-card"

// Итоговая проверка №4: без видимой подписи кнопка «Назад» рисовалась
// «пилюлей» с отступами под текст (`iconPosition="left"`), а не кнопкой-
// значком, как обещает документация `backLabel`.

describe("TitleCard: «Назад» без подписи", () => {
  it("backLabel={null} с onBack — кнопка-значок с именем «Назад»", () => {
    render(<TitleCard title="Карта" backLabel={null} onBack={() => {}} />)
    const back = screen.getByRole("button", { name: "Назад" })
    expect(back.className).toMatch(/\bsize-8\b/)
    expect(back.textContent?.trim()).toBe("")
  })

  it("с подписью кнопка по-прежнему текстовая", () => {
    render(<TitleCard title="Карта" onBack={() => {}} />)
    const back = screen.getByRole("button", { name: "Назад" })
    expect(back.className).not.toMatch(/\bsize-8\b/)
  })
})
