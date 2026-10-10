import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Modal, ModalColumns, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "./index"

// Дизайн-чек 08.10, замечание 15: «Two» — два слота, у каждого своя прокрутка.
describe("ModalColumns", () => {
  it("рисует два независимых окна прокрутки", () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Операции и выписки</ModalTitle>
          </ModalHeader>
          <ModalColumns left={<p>Список</p>} right={<p>Ответ</p>} />
        </ModalContent>
      </Modal>
    )
    const left = document.querySelector('[data-slot="modal-column-left"]')!
    const right = document.querySelector('[data-slot="modal-column-right"]')!
    expect(left).toContainElement(screen.getByText("Список"))
    expect(right).toContainElement(screen.getByText("Ответ"))
    expect(left.querySelector('[data-slot="scrollbar"]')).not.toBeNull()
    expect(right.querySelector('[data-slot="scrollbar"]')).not.toBeNull()
  })

  it("без подвала — последний в окне (холдер снизу), с подвалом — нет", () => {
    const { rerender } = render(
      <Modal open>
        <ModalContent>
          <ModalColumns left="a" right="b" />
        </ModalContent>
      </Modal>
    )
    const columns = () => document.querySelector('[data-slot="modal-columns"]')!
    expect(columns().nextElementSibling).toBeNull()
    rerender(
      <Modal open>
        <ModalContent>
          <ModalColumns left="a" right="b" />
          <ModalFooter>
            <button type="button">Ок</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
    expect(columns().nextElementSibling).toHaveAttribute("data-slot", "modal-footer")
  })
})
