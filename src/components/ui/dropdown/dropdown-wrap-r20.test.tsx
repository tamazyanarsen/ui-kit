import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { DropdownItem } from "./dropdown"

// Аудит 19: неразрывное слово в DropdownItem выходило за попап и давало
// горизонтальную прокрутку страницы — перенос r17 был только в общем
// классе готовых меню, а Dropdown, собранный потребителем, его не получал.

describe("DropdownItem: длинные слова переносятся внутри попапа", () => {
  it("подпись и описание с overflow-wrap:anywhere", () => {
    render(
      <DropdownItem
        text="Договорпоставкиоборудованияномер000123456789"
        description="Описаниебезединогопробела"
      />
    )
    expect(screen.getByText("Договорпоставкиоборудованияномер000123456789")).toHaveClass(
      "[overflow-wrap:anywhere]"
    )
    expect(screen.getByText("Описаниебезединогопробела")).toHaveClass("[overflow-wrap:anywhere]")
  })
})
