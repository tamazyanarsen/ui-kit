import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Аудит r6: когда появлялась или пропадала кнопка «Выбрать на всех
// страницах», панель переезжала в блок «кнопка + панель» и обратно — React
// видел другое дерево и пересоздавал её целиком вместе с кнопками действий.
// Фокус с кнопки падал на <body>, открытое меню «…» закрывалось.

function Bar({ selected }: { selected: number }) {
  return (
    <ButtonMenuBlack
      selectAllPagesCount={10}
      selectedCount={selected}
      onSelectAllPages={() => {}}
    >
      <Button>Подписать</Button>
    </ButtonMenuBlack>
  )
}

describe("ButtonMenuBlack: кнопки не пересоздаются", () => {
  it("кнопка действия — тот же узел и с фокусом, когда «Выбрать на всех» пропадает и возвращается", () => {
    const { rerender } = render(<Bar selected={3} />)
    const action = screen.getByRole("button", { name: "Подписать" })
    action.focus()

    // Выбрано всё — кнопка «Выбрать на всех» пропадает.
    rerender(<Bar selected={10} />)
    expect(screen.queryByText(/Выбрать на всех/)).toBeNull()
    expect(screen.getByRole("button", { name: "Подписать" })).toBe(action)
    expect(document.activeElement).toBe(action)

    // Сняли галку — кнопка возвращается.
    rerender(<Bar selected={9} />)
    expect(screen.getByText(/Выбрать на всех/)).toBeTruthy()
    expect(screen.getByRole("button", { name: "Подписать" })).toBe(action)
    expect(document.activeElement).toBe(action)
  })
})
