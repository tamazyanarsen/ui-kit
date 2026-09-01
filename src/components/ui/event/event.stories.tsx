import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  StorySection,
  StoryShowcase,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"

import { Event, type EventProps, type EventSignatory } from "./event"
import type { EventStatus } from "./variants"

const STATUSES: EventStatus[] = [
  "default",
  "success",
  "attention",
  "error",
  "information",
]

/* Дизайн-чек №17: три списка события (подписанты, реквизиты, документы)
   раньше правились JSON-редактором. Теперь у каждого — счётчик, а сами
   массивы собираются из пулов ниже. Ноль означает «блок выключен», что и
   есть настоящая проверяемая вариация компонента. */
const SIGNATORY_POOL: NonNullable<EventProps["signatories"]> = [
  { status: "success", name: "Иванов И.И.", attribute: "Первая подпись" },
  { status: "attention", name: "Петров П.П.", attribute: "Вторая подпись" },
  { status: "success", name: "Сидоров С.С.", attribute: "Единственная подпись" },
]

const INFO_POOL: NonNullable<EventProps["info"]> = [
  { label: "Сумма:", value: "10 000 ₽" },
  { label: "Счёт:", value: "40702810...1234" },
  { label: "Период:", value: "Сокращённый" },
]

const DOCUMENT_POOL: NonNullable<EventProps["documents"]> = [
  { name: "Договор.pdf", meta: "1.2 МБ" },
  { name: "Приложение.pdf", meta: "512 КБ" },
  { name: "Акт.pdf", meta: "128 КБ" },
]

const LIST_COUNTS = [0, 1, 2, 3] as const
type ListCount = (typeof LIST_COUNTS)[number]

const listCountArg = (name: string) =>
  ({ name, control: "select", options: LIST_COUNTS }) as const

/* Переключатель видимости кнопки живёт в истории, а не в компоненте: сам
   проп — это подпись, а не флаг (дизайн-чек №27).

   Дизайн-чек Storybook (Аня Багрова) №31: панель приведена к «Свойствам
   компонента» — Size, Show Signatories / Information / Comment / Documents /
   Button, плюс вложенные группы `Step Event (ELK)` (Type), `Head Event (ELK)`
   (Type) и `Signatories (ELK)` (Type). Блоки в коде включаются наличием
   содержимого, поэтому у истории синтетические переключатели, а количество
   строк в каждом блоке осталось отдельным контролом наполнения. */
type SignatoryType = "done" | "partial" | "cancel"

const SIGNATORY_STATUS: Record<SignatoryType, EventSignatory["status"]> = {
  done: "success",
  partial: "attention",
  cancel: "error",
}

type PlaygroundArgs = EventProps & {
  viewport?: Viewport
  showSignatories?: boolean
  showInformation?: boolean
  showComment?: boolean
  showDocuments?: boolean
  showButton?: boolean
  signatoryType?: SignatoryType
  signatoriesCount?: ListCount
  infoCount?: ListCount
  documentsCount?: ListCount
}

const CONTENT = { table: { category: "Контент" } }
const STEP_EVENT = { table: { category: "Step Event (ELK)" } }
const HEAD_EVENT = { table: { category: "Head Event (ELK)" } }
const SIGNATORIES = { table: { category: "Signatories (ELK)" } }

const meta = {
  title: "Компоненты/Event",
  component: Event,
  parameters: { layout: "padded" },
  // `commentLabel`/`comment`/`buttonLabel` are `React.ReactNode` but every
  // usage is a plain string — without this, leaving one unset falls back to
  // a generic "Set object" JSON editor.
  argTypes: {
    viewport: sizeArgType,
    showSignatories: toggleArgType("Show Signatories"),
    showInformation: toggleArgType("Show Information"),
    showComment: toggleArgType("Show Comment"),
    showDocuments: toggleArgType("Show Documents"),
    // Дизайн-чек №27: кнопка включается булевым переключателем.
    showButton: toggleArgType("Show Button"),
    stepType: {
      ...optionsArgType(
        "Type",
        { first: "First", middle: "Middle", end: "End" },
        "inline-radio"
      ),
      ...STEP_EVENT,
    },
    type: {
      ...optionsArgType(
        "Type",
        { text: "Event", tag: "Status" },
        "inline-radio"
      ),
      ...HEAD_EVENT,
    },
    signatoryType: {
      ...optionsArgType(
        "Type",
        { partial: "Partial", done: "Done", cancel: "Cancel" },
        "inline-radio"
      ),
      ...SIGNATORIES,
    },
    status: { control: "select", options: STATUSES, ...CONTENT },
    title: { control: "text", ...CONTENT },
    timestamp: { control: "text", ...CONTENT },
    author: { control: "text", ...CONTENT },
    commentLabel: { control: "text", ...CONTENT },
    comment: { control: "text", ...CONTENT },
    buttonLabel: { control: "text", ...CONTENT },
    signatoriesCount: { ...listCountArg("Подписантов"), ...CONTENT },
    infoCount: { ...listCountArg("Строк реквизитов"), ...CONTENT },
    documentsCount: { ...listCountArg("Документов"), ...CONTENT },
    // Старый булев близнец оси `Step Event / Type`.
    showConnector: { table: { disable: true } },
    signatories: { table: { disable: true } },
    info: { table: { disable: true } },
    documents: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    showSignatories: true,
    showInformation: true,
    showComment: true,
    showDocuments: true,
    stepType: "first",
    signatoryType: "partial",
    type: "text",
    status: "default",
    title: "Заявка отправлена",
    timestamp: "10:00",
    author: "Иванов И.И.",
    showConnector: true,
    showButton: true,
    buttonLabel: "Подробнее",
    commentLabel: "Комментарий",
    comment: "Комментарий согласующего к заявке",
    signatoriesCount: 2,
    infoCount: 2,
    documentsCount: 2,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    viewport,
    showButton,
    showSignatories,
    showInformation,
    showComment,
    showDocuments,
    signatoryType = "partial",
    buttonLabel,
    comment,
    signatoriesCount = 2,
    infoCount = 2,
    documentsCount = 2,
    ...args
  }) => (
    <PseudoBox viewport={viewport} className="w-full">
      <Event
        {...args}
        buttonLabel={showButton ? buttonLabel : undefined}
        comment={showComment ? comment : undefined}
        // Свойство `Type` вложенного Signatories задаёт статус первой
        // строки — остальные остаются как в примере.
        signatories={
          showSignatories
            ? SIGNATORY_POOL.slice(0, signatoriesCount).map((item, index) =>
                index === 0
                  ? { ...item, status: SIGNATORY_STATUS[signatoryType] }
                  : item
              )
            : undefined
        }
        info={showInformation ? INFO_POOL.slice(0, infoCount) : undefined}
        documents={
          showDocuments ? DOCUMENT_POOL.slice(0, documentsCount) : undefined
        }
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<EventProps>
        stretch
        cellClassName="min-w-[280px]"
        baseProps={{ title: "Title", timestamp: "10:00", author: "Иванов И.И." }}
        columnGroups={[
          {
            label: "Type: tag — статусы",
            columns: STATUSES.map((status) => ({
              label: status,
              props: { type: "tag", status },
            })),
          },
        ]}
        rows={[
          { label: "Заголовок", props: {} },
          { label: "Без коннектора", props: { showConnector: false } },
        ]}
        render={(props) => <Event {...props} />}
      />

      <StoryShowcase className="bg-transparent p-0">
        <StorySection
          title="Дополнительные блоки"
          description="Каждый блок опционален и складывается с остальными."
        >
          <div className="grid w-full grid-cols-2 gap-6">
            <Event
              title="С подписантами"
              timestamp="10:00"
              signatories={[
                { status: "success", name: "Иванов И.И.", attribute: "Первая подпись" },
                { status: "attention", name: "Петров П.П.", attribute: "Вторая подпись" },
              ]}
            />
            <Event
              title="С реквизитами"
              timestamp="10:00"
              info={[
                { label: "Сумма:", value: "10 000 ₽" },
                { label: "Счёт:", value: "40702810...1234" },
              ]}
            />
            <Event
              title="С комментарием"
              timestamp="10:00"
              comment="Комментарий согласующего к заявке"
            />
            <Event
              title="С документами"
              timestamp="10:00"
              documents={[
                { name: "Договор.pdf", meta: "1.2 МБ" },
                { name: "Приложение.pdf", meta: "512 КБ" },
              ]}
            />
            <Event title="С кнопкой" timestamp="10:00" buttonLabel="Подробнее" />
          </div>
        </StorySection>

        <StorySection
          title="Лента событий"
          description="Коннектор связывает соседние события; у последнего его нет."
        >
          <div className="w-full">
            <Event title="Заявка создана" timestamp="09:00" author="Иванов И.И." />
            <Event
              type="tag"
              title="На согласовании"
              status="attention"
              timestamp="09:15"
              signatories={[
                { status: "attention", name: "Петров П.П.", attribute: "Первая подпись" },
              ]}
            />
            <Event
              type="tag"
              title="Одобрено"
              status="success"
              timestamp="10:00"
              showConnector={false}
            />
          </div>
        </StorySection>
      </StoryShowcase>
    </div>
  ),
}
