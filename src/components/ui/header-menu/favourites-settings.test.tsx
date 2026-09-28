import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FavouritesSettings } from "./favourites-settings"
import type { HeaderMenuGroup } from "./header-menu"

const groups: HeaderMenuGroup[] = [
  {
    value: "sections",
    title: "Разделы",
    links: [
      { value: "a", label: "Альфа" },
      { value: "b", label: "Бета" },
    ],
  },
]

describe("FavouritesSettings", () => {
  it("переставляет видимую строку, даже если в избранном есть значения не из меню", async () => {
    const onSave = vi.fn()
    render(
      <FavouritesSettings
        open
        onOpenChange={() => {}}
        groups={groups}
        favourites={["old-removed", "a", "b"]}
        onSave={onSave}
      />
    )
    // «Бета» стрелкой вверх — на первое место среди видимых.
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить «Бета»" }), {
      key: "ArrowUp",
    })
    await userEvent.click(screen.getByRole("button", { name: "Сохранить" }))
    const saved: string[] = onSave.mock.calls[0][0]
    expect(saved.filter((value) => value !== "old-removed")).toEqual(["b", "a"])
  })

  it("не сбрасывает черновик, когда родитель перерисовывается с новым массивом", async () => {
    const onSave = vi.fn()
    function Host() {
      const [, force] = React.useState(0)
      return (
        <>
          <button type="button" onClick={() => force((n) => n + 1)}>
            перерисовать
          </button>
          <FavouritesSettings
            open
            onOpenChange={() => {}}
            groups={groups}
            // Новый массив на каждый рендер — типичный вычисленный проп.
            favourites={["a", "b"].slice()}
            onSave={onSave}
          />
        </>
      )
    }
    render(<Host />)
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить «Бета»" }), {
      key: "ArrowUp",
    })
    fireEvent.click(screen.getByText("перерисовать"))
    await userEvent.click(screen.getByRole("button", { name: "Сохранить" }))
    expect(onSave).toHaveBeenCalledWith(["b", "a"])
  })
})
