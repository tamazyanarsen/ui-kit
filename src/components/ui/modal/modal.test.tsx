import * as React from "react"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Modal, ModalTrigger, ModalClose } from "./root"
import { ModalContent } from "./popup"
import { ModalHeader, ModalTitle, ModalDescription } from "./header"
import { ModalBody } from "./body"
import { ModalFooter } from "./footer"
import { Button } from "@/components/ui/button"

// ModalBody measures scroll position via ResizeObserver, which jsdom
// doesn't implement.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
})

function ConfirmModal({ onConfirm }: { onConfirm?: () => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button />}>Открыть модалку</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Удалить карту?</ModalTitle>
          <ModalDescription>Действие нельзя отменить.</ModalDescription>
        </ModalHeader>
        <ModalBody>Содержимое модального окна</ModalBody>
        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm?.()
              setOpen(false)
            }}
          >
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

describe("Modal", () => {
  it("is closed until the trigger is clicked", async () => {
    const user = userEvent.setup()
    render(<ConfirmModal />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Открыть модалку" }))

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Удалить карту?")).toBeInTheDocument()
    expect(screen.getByText("Действие нельзя отменить.")).toBeInTheDocument()
  })

  it("closes via the built-in close (X) button", async () => {
    const user = userEvent.setup()
    render(<ConfirmModal />)

    await user.click(screen.getByRole("button", { name: "Открыть модалку" }))
    await screen.findByRole("dialog")

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("closes via a footer button and fires its own handler", async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ConfirmModal onConfirm={onConfirm} />)

    await user.click(screen.getByRole("button", { name: "Открыть модалку" }))
    await user.click(await screen.findByRole("button", { name: "Удалить" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("closes via ModalClose", async () => {
    const user = userEvent.setup()
    render(
      <Modal>
        <ModalTrigger render={<Button />}>Открыть</ModalTrigger>
        <ModalContent>
          <ModalBody>
            Текст
            <ModalClose render={<Button />}>Готово</ModalClose>
          </ModalBody>
        </ModalContent>
      </Modal>
    )

    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await user.click(await screen.findByRole("button", { name: "Готово" }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
