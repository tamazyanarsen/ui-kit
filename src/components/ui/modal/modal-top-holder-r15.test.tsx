import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Modal, ModalBody, ModalContent, ModalTopHolder } from "./index"

// Аудит 14: `ModalTopHolder`, переданный явно (вариант «Modal Top: None»),
// не засчитывался — ModalContent вставлял второй, и тело начиналось на 96px
// вместо 48.

describe("ModalContent: явный ModalTopHolder", () => {
  it("второй холдер не вставляется", () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalTopHolder />
          <ModalBody>Тело</ModalBody>
        </ModalContent>
      </Modal>
    )
    expect(document.querySelectorAll('[data-slot="modal-top-holder"]')).toHaveLength(1)
  })
})
