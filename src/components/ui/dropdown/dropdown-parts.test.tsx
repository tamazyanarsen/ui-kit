import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DropdownFooter, DropdownFooterButton } from "./dropdown-footer"
import { DropdownHelp, DropdownSearch } from "./dropdown-search"

describe("DropdownSearch", () => {
  it("в неуправляемом режиме показывает крестик и очищает поле", async () => {
    const onClear = vi.fn()
    render(<DropdownSearch defaultValue="счёт" onClear={onClear} />)
    const input = screen.getByRole("searchbox") as HTMLInputElement
    await userEvent.click(screen.getByRole("button", { name: "Очистить поиск" }))
    expect(onClear).toHaveBeenCalled()
    expect(input.value).toBe("")
    expect(screen.queryByRole("button", { name: "Очистить поиск" })).not.toBeInTheDocument()
  })

  it("крестик появляется, когда в неуправляемое поле ввели текст", async () => {
    render(<DropdownSearch onClear={() => {}} />)
    expect(screen.queryByRole("button", { name: "Очистить поиск" })).not.toBeInTheDocument()
    await userEvent.type(screen.getByRole("searchbox"), "аб")
    expect(screen.getByRole("button", { name: "Очистить поиск" })).toBeInTheDocument()
  })
})

describe("ref у частей Dropdown", () => {
  it("доезжает до DOM-узлов", () => {
    const footer = React.createRef<HTMLDivElement>()
    const button = React.createRef<HTMLButtonElement>()
    const help = React.createRef<HTMLParagraphElement>()
    render(
      <>
        <DropdownFooter ref={footer}>
          <DropdownFooterButton ref={button}>Ок</DropdownFooterButton>
        </DropdownFooter>
        <DropdownHelp ref={help}>подсказка</DropdownHelp>
      </>
    )
    expect(footer.current).toBeInstanceOf(HTMLDivElement)
    expect(button.current).toBeInstanceOf(HTMLButtonElement)
    expect(help.current).toBeInstanceOf(HTMLParagraphElement)
  })
})
