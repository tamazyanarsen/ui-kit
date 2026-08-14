import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Modal, ModalTrigger, ModalClose } from "./root"
import { ModalContent } from "./popup"
import { ModalHeader, ModalTitle, ModalDescription } from "./header"
import { ModalBody } from "./body"
import { ModalFooter } from "./footer"
import { Button } from "@/components/ui/button"

/* Свойства компонент-сета `ELK / modal`: Size, Type (Large / Small / With
   Image), Column (One / Two / One Title), Show Title, Show Buttons. Size и
   Show Buttons контролами уже были; заголовок, картинка и колонки — нет,
   хотя это отдельные варианты макета. Модалка собирается из частей
   (ModalHeader / ModalBody / ModalFooter), поэтому у неё нет одного пропа
   на каждый: контролы синтетические и переключают состав. */
interface ConfirmModalProps {
  size?: "l" | "m"
  title?: string
  description?: string
  showTitle?: boolean
  showImage?: boolean
  columns?: 1 | 2
  showClose?: boolean
  showFooter?: boolean
  triggerLabel?: string
  longBody?: boolean
}

function ConfirmModal({
  size = "l",
  title = "Удалить карту?",
  description = "Это действие нельзя отменить — карта будет удалена из вашего профиля.",
  showTitle = true,
  showImage = false,
  columns = 1,
  showClose = true,
  showFooter = true,
  triggerLabel = "Открыть модалку",
  longBody = false,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>
        {triggerLabel}
      </ModalTrigger>
      <ModalContent size={size} showClose={showClose}>
        {/* `Show Title=False` — вариант «Modal Top: None»: шапки нет вовсе,
            и тело начинается сразу с содержимого. */}
        {showTitle && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {description && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>
        )}
        <ModalBody className={columns === 2 ? "md:grid md:grid-cols-2 md:gap-6" : undefined}>
          {/* `Type=With Image` — иллюстрация над текстом. */}
          {showImage && (
            <div
              aria-hidden="true"
              className="mb-4 h-40 rounded-2xl bg-[var(--card-bg)] md:col-span-2"
            />
          )}
          {longBody ? (
            <div className="flex flex-col gap-4 text-p2-regular text-[#6D6D6D]">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i}>
                  Пункт соглашения {i + 1}. Раздел, поясняющий условия
                  использования сервиса.
                </p>
              ))}
            </div>
          ) : (
            <p className="text-p2-regular text-[#6D6D6D]">
              Виртуальная карта •• 4482 привязана к 2 подпискам. После удаления
              платежи по ним перестанут проходить.
            </p>
          )}
        </ModalBody>
        {showFooter && (
          <ModalFooter>
            <Button variant="secondary-grey" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <ModalClose render={<Button variant="primary" />}>Удалить</ModalClose>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

const meta = {
  title: "Компоненты/Modal",
  component: ConfirmModal,
  parameters: { layout: "centered" },
  // `ConfirmModal` is declared locally in this file rather than imported
  // from a component module, so react-docgen-typescript doesn't extract its
  // props — declare every control explicitly.
  argTypes: {
    size: { control: "inline-radio", options: ["l", "m"] },
    title: { control: "text" },
    description: { control: "text" },
    triggerLabel: { control: "text" },
    showTitle: { control: "boolean", name: "Show Title" },
    showImage: { control: "boolean", name: "Type: With Image" },
    columns: { control: "inline-radio", options: [1, 2], name: "Column" },
    showClose: { control: "boolean" },
    showFooter: { control: "boolean", name: "Show Buttons" },
    longBody: { control: "boolean" },
  },
  args: {
    size: "l",
    title: "Удалить карту?",
    description:
      "Это действие нельзя отменить — карта будет удалена из вашего профиля.",
    showTitle: true,
    showImage: false,
    columns: 1,
    showClose: true,
    showFooter: true,
    longBody: false,
  },
} satisfies Meta<ConfirmModalProps>

export default meta
type Story = StoryObj<ConfirmModalProps>

export const Playground: Story = {}

/* A modal is a portalled dialog with a backdrop and a focus trap, so only
   one can be open at a time — the variants are separate triggers rather
   than matrix cells. Below `md` every one of them becomes a bottom sheet
   (switch the viewport to see that form). */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Размеры"
        description="L — 64px боковые отступы, M — 48px."
      >
        <ConfirmModal size="l" triggerLabel="Large" />
        <ConfirmModal size="m" triggerLabel="Medium" />
      </StorySection>

      <StorySection title="Состав">
        <ConfirmModal triggerLabel="Без описания" description="" />
        <ConfirmModal triggerLabel="Без крестика" showClose={false} />
        <ConfirmModal triggerLabel="Без подвала" showFooter={false} />
      </StorySection>

      <StorySection
        title="Длинное содержимое"
        description="Шапка и подвал остаются на месте, прокручивается только тело."
      >
        <ConfirmModal
          triggerLabel="Открыть длинную модалку"
          title="Пользовательское соглашение"
          description=""
          longBody
        />
      </StorySection>
    </StoryShowcase>
  ),
}

export const Mobile: Story = {
  name: "Mobile (< 768px — Bottom Sheet)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  render: () => <ConfirmModal triggerLabel="Открыть" />,
}
