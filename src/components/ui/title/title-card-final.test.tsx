import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TitleCard } from "./title-card"

// Финальный аудит: при `backLabel={null}` и заданном `onBack` оставалась
// кнопка-значок без текста и без `aria-label` — скринридер её не называл.

describe("TitleCard: кнопка «Назад»", () => {
  it("кнопка-значок без подписи всё равно называется «Назад»", async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<TitleCard title="Заголовок" backLabel={null} onBack={onBack} helpLabel={null} />)

    await user.click(screen.getByRole("button", { name: "Назад" }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it("строковая подпись остаётся именем кнопки", () => {
    render(<TitleCard title="Заголовок" backLabel="К списку" onBack={() => {}} helpLabel={null} />)
    expect(screen.getByRole("button", { name: "К списку" })).toBeInTheDocument()
  })
})
