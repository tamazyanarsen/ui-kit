import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Modal, ModalBody, ModalContent } from "@/components/ui/modal"
import { Nps } from "./nps"

// Аудит 14: плавающее окно опроса лежало поверх открытой модалки (слой 60
// против 50) и на телефоне закрывало её «Подтвердить». Теперь, пока есть
// подложка модалки, опрос опускается под неё.

const UNDER_MODAL = "[:root:has([data-slot=modal-backdrop])_&]:z-40"

describe("NPS floating: под открытой модалкой", () => {
  it("плавающая карточка опускается под подложку модалки", () => {
    const { container } = render(<Nps floating />)
    expect(container.querySelector('[data-slot="nps"]')).toHaveClass(UNDER_MODAL)
  })

  it("правило держится за настоящий data-slot подложки", () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalBody>Тело</ModalBody>
        </ModalContent>
      </Modal>
    )
    expect(document.querySelector("[data-slot=modal-backdrop]")).not.toBeNull()
  })

  it("встроенная карточка слой не трогает", () => {
    const { container } = render(<Nps />)
    expect(container.querySelector('[data-slot="nps"]')).not.toHaveClass(UNDER_MODAL)
  })
})
