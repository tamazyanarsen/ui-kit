import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "./index"

describe("Modal: регрессии", () => {
  it("ModalBody: свой onScroll и ref потребителя не отключают разделители", () => {
    const onScroll = vi.fn()
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <ModalBody ref={ref} onScroll={onScroll}>
        <div style={{ height: 2000 }}>Длинное содержимое</div>
      </ModalBody>
    )
    const body = container.querySelector('[data-slot="modal-body"]') as HTMLElement
    expect(ref.current).toBe(body)

    Object.defineProperty(body, "scrollHeight", { configurable: true, value: 2000 })
    Object.defineProperty(body, "clientHeight", { configurable: true, value: 400 })
    body.scrollTop = 200
    fireEvent.scroll(body)

    expect(onScroll).toHaveBeenCalledTimes(1)
    expect(body).toHaveAttribute("data-divider-top")
  })

  it("ref доходит до ModalHeader, ModalFooter и ModalTitle", () => {
    const header = React.createRef<HTMLDivElement>()
    const footer = React.createRef<HTMLDivElement>()
    const title = React.createRef<HTMLHeadingElement>()
    render(
      <Modal open>
        <ModalContent>
          <ModalHeader ref={header}>
            <ModalTitle ref={title}>Заголовок</ModalTitle>
          </ModalHeader>
          <ModalFooter ref={footer} />
        </ModalContent>
      </Modal>
    )
    expect(header.current).toHaveAttribute("data-slot", "modal-header")
    expect(footer.current).toHaveAttribute("data-slot", "modal-footer")
    expect(title.current).toBe(screen.getByText("Заголовок"))
  })

  it("className-функция от состояния у ModalContent не теряется", () => {
    render(
      <Modal open>
        <ModalContent className={() => "custom-state-class"}>
          <ModalHeader>
            <ModalTitle>Окно</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>
    )
    const popup = document.querySelector('[data-slot="modal-content"]')
    expect(popup?.className).toContain("custom-state-class")
  })
})
