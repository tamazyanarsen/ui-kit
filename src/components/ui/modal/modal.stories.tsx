import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Modal, ModalTrigger, ModalClose } from "./root"
import { ModalContent } from "./popup"
import { ModalHeader, ModalTitle, ModalDescription } from "./header"
import { ModalBody } from "./body"
import { ModalFooter } from "./footer"
import { Button } from "@/components/ui/button"

/* Панель свойств компонент-сета `ELK / Modal` (45321:17265) и его частей:

     ELK / Modal            Size = Desktop | Mobile
                            Type = Large Modal | Small Modal | With Image
     Modal Top (…, ELK)     Show Title = True | False
     Modal Body (…, ELK)    Column = One | One Title | Two
                            Show Buttons = True | False
     Modal Bottom (…, ELK)  Type = Two Buttons | Primary | Secondary

   Дизайн-чек Storybook 2 (от Notification до Loader) №2 и №3: раньше `Type`
   был размазан по двум контролам (`size` = l/m и булев «Type: With Image»),
   а подвал не переключался вовсе. Теперь панель повторяет макет: один `Type`
   на три значения и группы вложенных частей.

   Модалка собирается из частей (ModalHeader / ModalBody / ModalFooter),
   поэтому одного пропа на каждое свойство у неё нет — контролы
   синтетические и переключают состав. */
type ModalType = "large" | "small" | "image"
type ModalColumn = "one" | "one-title" | "two"
type ModalBottomType = "two-buttons" | "primary" | "secondary"

const TYPE_LABELS: Record<ModalType, string> = {
  large: "Large Modal",
  small: "Small Modal",
  image: "With Image",
}

const COLUMN_LABELS: Record<ModalColumn, string> = {
  one: "One",
  "one-title": "One Title",
  two: "Two",
}

const BOTTOM_LABELS: Record<ModalBottomType, string> = {
  "two-buttons": "Two Buttons",
  primary: "Primary",
  secondary: "Secondary",
}

interface ConfirmModalProps {
  type?: ModalType
  title?: string
  description?: string
  showTitle?: boolean
  column?: ModalColumn
  bottomType?: ModalBottomType
  showClose?: boolean
  showFooter?: boolean
  triggerLabel?: string
  longBody?: boolean
  viewport?: Viewport
}

function ConfirmModal({
  type = "large",
  title = "Удалить карту?",
  description = "Это действие нельзя отменить — карта будет удалена из вашего профиля.",
  showTitle = true,
  column = "one",
  bottomType = "two-buttons",
  showClose = true,
  showFooter = true,
  triggerLabel = "Открыть модалку",
  longBody = false,
  viewport,
}: ConfirmModalProps) {
  const [open, setOpen] = useState(false)
  // Large Modal — коробка 1008px (size="l"), Small Modal и With Image — 592
  // (size="m"). Иллюстрация есть только у третьего типа.
  const size = type === "large" ? "l" : "m"
  const showImage = type === "image"
  const columns = column === "two" ? 2 : 1
  return (
    // Скоуп охватывает и триггер, и портал: `ModalContent` дублирует
    // `data-viewport` на самом попапе, потому что портал уносит его из
    // этого поддерева (дизайн-чек №3 №19).
    <ViewportScope viewport={viewport}>
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
        <ModalBody className={columns === 2 ? "desktop:grid desktop:grid-cols-2 desktop:gap-6" : undefined}>
          {/* `Column=One Title` — колонка со своим заголовком внутри тела,
              отдельно от шапки модалки. */}
          {column === "one-title" && (
            <p className="mb-2 text-h4 text-[#252628]">Заголовок блока</p>
          )}
          {/* `Type=With Image` — иллюстрация над текстом. */}
          {showImage && (
            <div
              aria-hidden="true"
              className="mb-4 h-40 rounded-2xl bg-[var(--card-bg)] desktop:col-span-2"
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
        {/* `Modal Bottom (…, ELK)`, свойство Type: две кнопки, только
            основная или только второстепенная. */}
        {showFooter && (
          <ModalFooter>
            {bottomType !== "primary" && (
              <Button variant="secondary-grey" onClick={() => setOpen(false)}>
                Отмена
              </Button>
            )}
            {bottomType !== "secondary" && (
              <ModalClose render={<Button variant="primary" />}>
                Удалить
              </ModalClose>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
    </ViewportScope>
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
    // Мобильная форма (Bottom Sheet) выбирается контролом, а не пиннингом
    // вьюпорта — дизайн-чек №3 №19.
    viewport: sizeArgType,
    type: optionsArgType("Type", TYPE_LABELS, "inline-radio"),
    showTitle: {
      ...toggleArgType("Show Title"),
      table: { category: "Modal Top (ELK)" },
    },
    column: {
      ...optionsArgType("Column", COLUMN_LABELS, "inline-radio"),
      table: { category: "Modal Body (ELK)" },
    },
    showFooter: {
      ...toggleArgType("Show Buttons"),
      table: { category: "Modal Body (ELK)" },
    },
    bottomType: {
      ...optionsArgType("Type", BOTTOM_LABELS, "inline-radio"),
      table: { category: "Modal Bottom (ELK)" },
    },
    showClose: { name: "Крестик", control: "boolean" },
    longBody: { name: "Длинное содержимое", control: "boolean" },
    title: { control: "text", table: { category: "Контент" } },
    description: { control: "text", table: { category: "Контент" } },
    triggerLabel: { control: "text", table: { category: "Контент" } },
  },
  args: {
    viewport: "desktop",
    type: "large",
    title: "Удалить карту?",
    description:
      "Это действие нельзя отменить — карта будет удалена из вашего профиля.",
    showTitle: true,
    column: "one",
    bottomType: "two-buttons",
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
      {/* Дизайн-чек Storybook 2 (от Notification до Loader) №3: «проверь
          варианты модального окна (Type)… скорректируй варианты
          использования». Раздел ниже перебирает ровно три значения Type из
          макета, а не «размеры L/M». */}
      <StorySection
        title="Type — Large Modal / Small Modal / With Image"
        description="Large — коробка 1008px, Small — 592px, With Image — те же 592 с иллюстрацией над текстом."
      >
        <ConfirmModal type="large" triggerLabel="Large Modal" />
        <ConfirmModal type="small" triggerLabel="Small Modal" />
        <ConfirmModal type="image" triggerLabel="With Image" />
      </StorySection>

      <StorySection
        title="Column — One / One Title / Two"
        description="Свойство Modal Body: одна колонка, одна со своим заголовком, две (только у Large)."
      >
        <ConfirmModal column="one" triggerLabel="One" />
        <ConfirmModal column="one-title" triggerLabel="One Title" />
        <ConfirmModal column="two" triggerLabel="Two" />
      </StorySection>

      <StorySection
        title="Modal Bottom — Two Buttons / Primary / Secondary"
        description="Свойство Type подвала: обе кнопки, только основная или только второстепенная."
      >
        <ConfirmModal bottomType="two-buttons" triggerLabel="Two Buttons" />
        <ConfirmModal bottomType="primary" triggerLabel="Primary" />
        <ConfirmModal bottomType="secondary" triggerLabel="Secondary" />
      </StorySection>

      <StorySection title="Состав">
        <ConfirmModal triggerLabel="Без заголовка" showTitle={false} />
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
