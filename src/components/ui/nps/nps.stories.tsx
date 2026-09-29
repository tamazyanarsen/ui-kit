import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { StatesMatrix } from "@/stories/matrix"
import { orderedOptionLabels } from "@/stories/options"

import { Nps, type NpsEstimateType, type NpsProps, type NpsShowChips } from "./nps"

/* Дизайн-чек №4 №11: контрол оценки называется «Estimate Type» и выбирается
   из None, 1–5 — по элементу «Estimate (ELK)».
   Дизайн-чек №4 №12: отдельного `defaultValue` в контролах нет — оценка
   задаётся одним этим контролом (история пересоздаётся, чтобы звёзды
   оставались кликабельными). */
const ESTIMATE_TYPES = ["None", 1, 2, 3, 4, 5] as const
type EstimateType = (typeof ESTIMATE_TYPES)[number]

/* Дизайн-чек №4 №13: «Show Chips» — тоже None, 1–5: сколько предлагаемых
   ответов показать (таблица свойств компонента). */
const SHOW_CHIPS: NpsShowChips[] = ["none", 1, 2, 3, 4, 5]

type PlaygroundArgs = NpsProps & { estimateType?: EstimateType }

const meta = {
  title: "Компоненты/NPS",
  component: Nps,
  parameters: { layout: "centered" },
  // `title` объявлен как React.ReactNode, но всякое реальное использование
  // (включая собственное умолчание компонента во время выполнения) — это
  // обычная строка: закрепляем текстовый контрол, чтобы незаданное значение
  // не откатывалось на заглушку «Set object» в Storybook.
  argTypes: {
    estimateType: {
      name: "Estimate Type",
      control: { type: "select", labels: orderedOptionLabels(ESTIMATE_TYPES) },
      options: ESTIMATE_TYPES,
    },
    // Оценка задаётся контролом «Estimate Type» — сырые пропы скрыты.
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    chips: { table: { disable: true } },
    showDescription: { control: "boolean", name: "Show Description" },
    showChips: {
      name: "Show Chips",
      // `none` показываем как «None» — ровно как в таблице свойств.
      control: {
        type: "select",
        labels: orderedOptionLabels(SHOW_CHIPS, { none: "None" }),
      },
      options: SHOW_CHIPS,
    },
    submitted: { control: "boolean" },
    autoCloseMs: {
      control: { type: "number", min: 0, step: 500 },
      description:
        "Через сколько мс после «Спасибо за оценку» вызвать onClose. 0 — не закрывать",
    },
    title: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    // Дизайн-чек от 07.09, замечания 21 и 22.
    floating: {
      name: "Плавающее окно",
      control: "boolean",
      description:
        "Правый нижний угол вьюпорта, слоем выше тостов (--z-nps > --z-toast)",
    },
    question: {
      control: "text",
      description:
        "Вопрос под звёздами. Пусто — считается от оценки: у «Отлично» он другой",
    },
    // Дизайн-чек №4 №8: className — не свойство компонента из макета.
    className: { table: { disable: true } },
  },
  args: {
    estimateType: "None",
    showDescription: true,
    showChips: 5,
    submitted: false,
    floating: false,
    autoCloseMs: 2000,
    // `onClose` Playground подключает сам (см. NpsLive): без него не было бы
    // ни строки «Окно закроется автоматически», ни самого закрытия.
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

/* Живая карточка: отправка переводит её в «Спасибо за оценку», а по таймеру
   (`autoCloseMs`) и по крестику вызывается `onClose` — карточка убирается, на
   её месте кнопка «Показать снова». Так же ведёт себя продукт: компонент
   только зовёт `onClose`, убирает ли его из DOM, решает потребитель.
   Строки под карточкой показывают то, что пришло в колбэки, — по ним
   поведение проверяется без внутренностей компонента. */
function NpsLive({
  estimateType = "None",
  submitted: submittedArg = false,
  ...args
}: Omit<PlaygroundArgs, "value" | "defaultValue">) {
  const [closed, setClosed] = React.useState(false)
  const [closes, setCloses] = React.useState(0)
  const [session, setSession] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(submittedArg)
  const [rating, setRating] = React.useState<number | null>(null)
  const [sent, setSent] = React.useState<{ value: number; comment: string } | null>(null)
  const restoreRef = React.useRef<HTMLButtonElement>(null)
  const cardBoxRef = React.useRef<HTMLDivElement>(null)
  const wasClosed = React.useRef(false)

  // Контрол `submitted` переключили — карточка следует за ним.
  const [lastArg, setLastArg] = React.useState(submittedArg)
  if (lastArg !== submittedArg) {
    setLastArg(submittedArg)
    setSubmitted(submittedArg)
  }

  // Фокус с убранной карточки уходит на «Показать снова», а не на body; при
  // возврате — на первую кнопку карточки (крестик).
  React.useEffect(() => {
    if (closed && !wasClosed.current) restoreRef.current?.focus()
    if (!closed && wasClosed.current) {
      cardBoxRef.current?.querySelector<HTMLElement>("button")?.focus()
    }
    wasClosed.current = closed
  }, [closed])

  function restore() {
    setClosed(false)
    setSession((n) => n + 1)
    setSubmitted(submittedArg)
    setRating(null)
    setSent(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {closed ? (
        <Button
          ref={restoreRef}
          type="button"
          variant="secondary-grey"
          size="sm"
          onClick={restore}
        >
          Показать снова
        </Button>
      ) : (
        // Оценка приходит контролом, но звёзды должны оставаться живыми,
        // поэтому она задаётся начальным значением, а история пересоздаётся
        // по ключу.
        <div ref={cardBoxRef}>
          <Nps
            key={`${String(estimateType)}-${session}`}
            {...args}
            defaultValue={estimateType === "None" ? null : (estimateType as NpsEstimateType)}
            submitted={submitted}
            onValueChange={setRating}
            onSubmit={(data) => {
              setSent(data)
              setSubmitted(true)
            }}
            onClose={() => {
              setClosed(true)
              setCloses((n) => n + 1)
            }}
          />
        </div>
      )}
      <div className="flex flex-col items-center text-p3-medium text-[var(--nps-subtitle-fg)]">
        <p data-slot="story-status-rating">Оценка: {rating ?? "нет"}</p>
        <p data-slot="story-status-sent">
          {sent ? `Отправлено: ${sent.value}, «${sent.comment}»` : "Не отправлено"}
        </p>
        <p data-slot="story-status-closed">Закрыто раз: {closes}</p>
      </div>
    </div>
  )
}

export const Playground: Story = {
  render: ({ value: _value, defaultValue: _default, ...args }) => <NpsLive {...args} />,
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<NpsProps>
      stretch
      cellClassName="min-w-[420px]"
      columns={[{ label: "Feedback (NPS)" }]}
      rows={[
        { label: "Estimate Type: None", props: {} },
        { label: "Estimate Type: 4", props: { defaultValue: 4 } },
        { label: "Estimate Type: 2", props: { defaultValue: 2 } },
        // Оба блока продолжения включаются независимо.
        { label: "Show Chips: none", props: { defaultValue: 3, showChips: "none" } },
        { label: "Show Chips: 2", props: { defaultValue: 3, showChips: 2 } },
        {
          label: "Без поля комментария",
          props: { defaultValue: 3, showDescription: false },
        },
        // `onClose` — чтобы в матрице была строка «Окно закроется
        // автоматически», как в макете (см. `args` выше).
        { label: "Отправлено", props: { submitted: true, onClose: () => {} } },
      ]}
      render={(props) => <Nps {...props} />}
    />
  ),
}
