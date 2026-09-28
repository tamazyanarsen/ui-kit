import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTopHolder,
} from "./index"

// Добор покрытия к исправлениям Modal: регрессии проверяли ref у шапки,
// подвала и заголовка и className-функцию только у ModalContent. Здесь —
// остальные части, которые исправление перевело на forwardRef и
// `stateClassName`.
describe("Modal: добор покрытия", () => {
  it("ref доходит до ModalContent и ModalDescription", () => {
    const content = React.createRef<HTMLDivElement>()
    const description = React.createRef<HTMLParagraphElement>()
    render(
      <Modal open>
        <ModalContent ref={content}>
          <ModalHeader>
            <ModalTitle>Заголовок</ModalTitle>
            <ModalDescription ref={description}>Описание</ModalDescription>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    expect(content.current).toHaveAttribute("data-slot", "modal-content")
    expect(description.current).toBe(screen.getByText("Описание"))
  })

  it("ref доходит до ModalTopHolder", () => {
    const holder = React.createRef<HTMLDivElement>()
    render(<ModalTopHolder ref={holder} />)
    expect(holder.current).toHaveAttribute("data-slot", "modal-top-holder")
  })

  // `cn` молча выбрасывал функцию от состояния, которую допускают типы
  // Base UI, — класс потребителя не доезжал до заголовка и описания.
  it("className-функция от состояния у ModalTitle и ModalDescription не теряется", () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className={() => "title-from-state"}>Заголовок</ModalTitle>
            <ModalDescription className={() => "description-from-state"}>
              Описание
            </ModalDescription>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    expect(screen.getByText("Заголовок").className).toContain("title-from-state")
    expect(screen.getByText("Описание").className).toContain("description-from-state")
  })
})
