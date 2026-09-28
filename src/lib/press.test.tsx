import { createPortal } from "react-dom"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { fromNestedControl, pressHandlers } from "./press"

function Block({ onPress }: { onPress: () => void }) {
  return (
    <div role="button" tabIndex={0} data-testid="block" {...pressHandlers(onPress)}>
      <button type="button">Вложенная</button>
      {createPortal(<button type="button">В портале</button>, document.body)}
    </div>
  )
}

describe("pressHandlers", () => {
  it("срабатывает по клику и по Enter/Space на самом блоке", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const block = screen.getByTestId("block")
    fireEvent.click(block)
    fireEvent.keyDown(block, { key: "Enter" })
    fireEvent.keyDown(block, { key: " " })
    expect(onPress).toHaveBeenCalledTimes(3)
  })

  it("Enter на вложенной кнопке не нажимает блок и не глушит её клик", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const nested = screen.getByText("Вложенная")
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })
    nested.dispatchEvent(event)
    expect(onPress).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
  })

  it("клик по вложенной кнопке и по узлу в портале не нажимает блок", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    fireEvent.click(screen.getByText("Вложенная"))
    fireEvent.click(screen.getByText("В портале"))
    expect(onPress).not.toHaveBeenCalled()
  })

  it("предок-«управление» снаружи блока не считается вложенным управлением", () => {
    // Строка таблицы внутри кликабельного блока: у `tr` нет роли, и
    // `closest` уходил бы к внешнему `role=button`.
    const outer = document.createElement("div")
    outer.setAttribute("role", "button")
    outer.innerHTML = "<table><tbody><tr><td>ячейка</td></tr></tbody></table>"
    document.body.appendChild(outer)
    const tr = outer.querySelector("tr")!
    const td = outer.querySelector("td")!
    expect(fromNestedControl({ target: td, currentTarget: tr })).toBe(false)
    outer.remove()
  })

  it("без обработчика ничего не навешивает", () => {
    expect(pressHandlers(undefined)).toEqual({})
  })
})
