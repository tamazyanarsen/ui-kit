import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Nps } from "./nps"

// r25: пустые подписи чипов занимали место в наборе (и падали на null), а
// комментарий из пробелов уходил наружу как есть.

async function rate(value: number) {
  const user = userEvent.setup()
  await user.click(screen.getByRole("radio", { name: new RegExp(`^${value} из 5`) }))
  return user
}

describe("Nps: чипы", () => {
  it("пустые подписи отбрасываются до среза, а не занимают место", async () => {
    render(<Nps chips={["", "  ", "Первый", "Второй"]} showChips={2} />)
    await rate(3)
    expect(screen.getByRole("button", { name: "Первый" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Второй" })).toBeInTheDocument()
  })

  it("null среди подписей не роняет карточку", async () => {
    const chips = [null, "Единственный"] as unknown as string[]
    render(<Nps chips={chips} />)
    await rate(3)
    expect(screen.getByRole("button", { name: "Единственный" })).toBeInTheDocument()
  })

  it("если настоящих чипов нет, блока с зазором нет вовсе", () => {
    const { container } = render(<Nps chips={["", " "]} />)
    expect(container.querySelector(".flex-wrap")).toBeNull()
  })
})

describe("Nps: комментарий", () => {
  it("наружу уходит обрезанный комментарий", async () => {
    const onSubmit = vi.fn()
    render(<Nps onSubmit={onSubmit} />)
    const user = await rate(4)
    await user.type(screen.getByLabelText("Комментарий"), "  Хорошо  ")
    await user.click(screen.getByRole("button", { name: "Отправить" }))
    expect(onSubmit).toHaveBeenCalledWith({ value: 4, comment: "Хорошо" })
  })

  it("комментарий из одних пробелов приходит пустым", async () => {
    const onSubmit = vi.fn()
    render(<Nps onSubmit={onSubmit} />)
    const user = await rate(5)
    await user.type(screen.getByLabelText("Комментарий"), "   ")
    await user.click(screen.getByRole("button", { name: "Отправить" }))
    expect(onSubmit).toHaveBeenCalledWith({ value: 5, comment: "" })
  })
})
