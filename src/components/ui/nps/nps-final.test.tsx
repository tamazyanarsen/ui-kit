import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Nps, type NpsEstimateType } from "./nps"

// Финальный аудит, две находки:
// 1. звёзды объявлены радиогруппой, но стрелки не работали, а все пять
//    звёзд стояли в обходе по Tab;
// 2. после «Отправить» форма размонтировалась, и фокус падал на body.

const stars = () => screen.getAllByRole("radio")
const tabbable = () => stars().filter((star) => star.getAttribute("tabindex") === "0")

describe("Nps: клавиатура звёзд", () => {
  it("в обходе по Tab одна звезда, стрелки переводят фокус и выбор", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Nps onValueChange={onValueChange} />)

    expect(tabbable()).toEqual([stars()[0]])
    // До звёзд в обходе стоит крестик шапки — фокус ставится прямо на
    // остановку группы.
    stars()[0].focus()

    await user.keyboard("{ArrowRight}")
    expect(stars()[1]).toHaveFocus()
    expect(onValueChange).toHaveBeenLastCalledWith(2)

    await user.keyboard("{End}")
    expect(stars()[4]).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    // По кругу — на первую.
    expect(stars()[0]).toHaveFocus()
    await user.keyboard("{Home}{ArrowLeft}")
    expect(stars()[4]).toHaveFocus()
    expect(onValueChange).toHaveBeenLastCalledWith(5)
  })

  it("остановка Tab — на выбранной звезде", () => {
    render(<Nps defaultValue={3} />)
    expect(tabbable()).toEqual([stars()[2]])
  })
})

describe("Nps: фокус после отправки", () => {
  function Harness() {
    const [submitted, setSubmitted] = React.useState(false)
    const [value, setValue] = React.useState<NpsEstimateType | null>(4)
    return (
      <Nps
        value={value}
        onValueChange={(next) => setValue(next as NpsEstimateType)}
        submitted={submitted}
        onSubmit={() => setSubmitted(true)}
        autoCloseMs={0}
      />
    )
  }

  it("Enter на «Отправить» переводит фокус на «Спасибо за оценку»", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    screen.getByRole("button", { name: "Отправить" }).focus()
    await user.keyboard("{Enter}")

    expect(screen.getByText("Спасибо за оценку")).toHaveFocus()
  })

  it("не отбирает фокус, если его не было внутри формы", () => {
    const { rerender } = render(
      <>
        <button type="button">снаружи</button>
        <Nps defaultValue={4} />
      </>
    )
    screen.getByRole("button", { name: "снаружи" }).focus()
    rerender(
      <>
        <button type="button">снаружи</button>
        <Nps defaultValue={4} submitted />
      </>
    )
    expect(screen.getByRole("button", { name: "снаружи" })).toHaveFocus()
  })
})
