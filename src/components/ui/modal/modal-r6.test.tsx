import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from "./index"

// Аудит r6: шапка узнавалась только прямым ребёнком — во фрагменте
// (условная разметка `<>{header}{body}</>`) над ней вставал ещё и холдер.

describe("ModalContent: шапка во фрагменте", () => {
  it("не добавляет ModalTopHolder, если ModalHeader лежит во фрагменте", () => {
    render(
      <Modal open>
        <ModalContent>
          <>
            <ModalHeader>
              <ModalTitle>Заголовок</ModalTitle>
            </ModalHeader>
            <ModalBody>Тело</ModalBody>
          </>
        </ModalContent>
      </Modal>
    )
    expect(document.querySelector('[data-slot="modal-top-holder"]')).toBeNull()
  })

  it("без шапки холдер по-прежнему на месте", () => {
    render(
      <Modal open>
        <ModalContent>
          <>
            <ModalBody>Тело</ModalBody>
          </>
        </ModalContent>
      </Modal>
    )
    expect(document.querySelector('[data-slot="modal-top-holder"]')).not.toBeNull()
  })
})
