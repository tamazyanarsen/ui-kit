import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Modal, ModalTrigger, ModalClose } from "./root"
import { ModalContent } from "./popup"
import { ModalHeader, ModalTitle, ModalDescription } from "./header"
import { ModalBody } from "./body"
import { ModalFooter } from "./footer"
import { Button } from "@/components/ui/button"

function ConfirmModal({ size = "l" }: { size?: "l" | "m" }) {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>Открыть модалку</ModalTrigger>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalTitle>Удалить карту?</ModalTitle>
          <ModalDescription>
            Это действие нельзя отменить — карта будет удалена из вашего профиля.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-p2 text-[#6D6D6D]">
            Виртуальная карта •• 4482 привязана к 2 подпискам. После удаления платежи по ним
            перестанут проходить.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const meta = {
  title: "Template/Modal",
  component: ConfirmModal,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: { size: "l" },
}

export const Medium: Story = {
  args: { size: "m" },
}

function ScrollingModal() {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>Открыть длинную модалку</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Пользовательское соглашение</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4 text-p2 text-[#6D6D6D]">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>
                Пункт соглашения {i + 1}. Раздел, поясняющий условия использования сервиса.
              </p>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose render={<Button variant="primary" />}>Принять</ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const ScrollingBody: Story = {
  render: () => <ScrollingModal />,
}
