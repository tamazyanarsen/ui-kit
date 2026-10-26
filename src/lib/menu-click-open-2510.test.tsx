import { Menu } from "@base-ui/react/menu"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { menuClickOpenProps } from "./menu-click-open"

function Demo({ clickOpen }: { clickOpen: boolean }) {
  return (
    <Menu.Root>
      <Menu.Trigger {...(clickOpen ? menuClickOpenProps : {})}>Меню</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Пункт</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

async function press(el: HTMLElement) {
  await act(async () => {
    fireEvent.pointerDown(el, { button: 0, pointerType: "mouse" })
    fireEvent.mouseDown(el, { button: 0 })
    await new Promise((r) => requestAnimationFrame(() => r(null)))
  })
}

describe("menuClickOpenProps: меню открывается по клику, а не на mousedown", () => {
  it("без пропсов Base UI открывает меню уже на mousedown (исходное поведение)", async () => {
    render(<Demo clickOpen={false} />)
    const trigger = screen.getByRole("button", { name: "Меню" })
    await press(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("с пропсами mousedown меню не открывает, click — открывает, повторный click — закрывает", async () => {
    render(<Demo clickOpen />)
    const trigger = screen.getByRole("button", { name: "Меню" })
    await press(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    await act(async () => {
      fireEvent.pointerUp(trigger, { button: 0, pointerType: "mouse" })
      fireEvent.mouseUp(trigger, { button: 0 })
      fireEvent.click(trigger, { button: 0, detail: 1 })
    })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    await press(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    await act(async () => {
      fireEvent.click(trigger, { button: 0, detail: 1 })
    })
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
  })
})
