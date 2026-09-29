import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Nps } from "./nps"

// r27: неуправляемая карточка при submitted true→false открывалась со старой
// оценкой и комментарием прошлого опроса.

describe("Nps: повторный показ формы", () => {
  it("после «Спасибо» форма чистая: без оценки и комментария", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Nps />)
    await user.click(screen.getByRole("radio", { name: /^4 из 5/ }))
    await user.type(screen.getByRole("textbox"), "старый отзыв")

    rerender(<Nps submitted />)
    expect(screen.getByText("Спасибо за оценку")).toBeInTheDocument()

    rerender(<Nps submitted={false} />)
    expect(screen.queryByRole("radio", { checked: true })).toBeNull()
    expect(screen.queryByDisplayValue("старый отзыв")).toBeNull()
  })

  it("defaultValue возвращается, а управляемая оценка остаётся за потребителем", () => {
    const { rerender } = render(<Nps defaultValue={3} submitted />)
    rerender(<Nps defaultValue={3} submitted={false} />)
    expect(screen.getByRole("radio", { checked: true, name: /^3 из 5/ })).toBeInTheDocument()

    const c = render(<Nps value={5} submitted />)
    c.rerender(<Nps value={5} submitted={false} />)
    expect(screen.getAllByRole("radio", { checked: true }).some((r) => /^5 из 5/.test(r.getAttribute("aria-label") ?? r.textContent ?? ""))).toBe(true)
  })
})
