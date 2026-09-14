import type { Meta, StoryObj } from "@storybook/react-vite"

import { PseudoBox, StatesMatrix, sizeArgType, toggleArgType } from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"
import { IssueItem, type IssueStatus } from "@/components/ui/issue-item"

import { ListOfErrors, type ListOfErrorsProps } from "./list-of-errors"

/**
 * List of Errors — список проблем (`ELK / list-errors`, сет 70427:3561,
 * Version 1.0.0, Release 68.34; бывш. Issue List — переименован по
 * дизайн-чеку от 13.09, замечание 9).
 *
 * Панель «Свойства компонента» сета:
 *
 *     Size     Desktop, Mobile
 *     Value    1, 2, 3, 4, 5
 *
 * Высоты сходятся один в один: Desktop 48 / 80 / 112 / 144 / 176,
 * Mobile 36 / 64 / 92 / 120 / 148.
 *
 * ⚠️ `Value` пропом быть не должно — это перечисленные примеры количества,
 * а количество приходит содержимым. В истории оно переключается подстановкой
 * разного числа строк.
 *
 * Разделитель документация сета называет опциональным элементом — отсюда
 * булево «показывать разделитель» (умолчание — включено, как во всех
 * символах).
 */
const ISSUES: { status: IssueStatus; text: string }[] = [
  { status: "error", text: "Не заполнено обязательное поле «ИНН организации»" },
  { status: "error", text: "Сумма транша превышает остаток лимита по договору" },
  { status: "attention", text: "Срок действия доверенности истекает через 5 дней" },
  { status: "attention", text: "Не приложен акт выполненных работ" },
  { status: "info", text: "Заявка будет рассмотрена в течение двух рабочих дней" },
]

type PlaygroundArgs = ListOfErrorsProps & {
  viewport?: Viewport
  count?: number
}

function issues(count: number) {
  return ISSUES.slice(0, count).map((issue, index) => (
    <IssueItem key={index} status={issue.status}>
      {issue.text}
    </IssueItem>
  ))
}

const meta = {
  title: "Компоненты/List of Errors",
  component: ListOfErrors,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    count: {
      name: "Value",
      description:
        "В сете это перечисленные примеры количества (1…5), а не проп: количество приходит содержимым",
      control: { type: "number", min: 1, max: ISSUES.length },
      table: { category: "Контент" },
    },
    showDivider: toggleArgType(
      "Divider",
      "Опциональный элемент сета: список ставится и там, где линия уже есть выше. Выключение убирает и линию, и отступ над первой строкой разом"
    ),
  },
  args: {
    viewport: "desktop" as Viewport,
    count: 3,
    showDivider: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, count = 3, ...args }) => (
    <PseudoBox viewport={viewport}>
      <div className="w-full max-w-[880px]">
        <ListOfErrors {...args}>{issues(count)}</ListOfErrors>
      </div>
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Ось Value сета — от одной строки до пяти. Высоты: Desktop
          48 / 80 / 112 / 144 / 176, Mobile 36 / 64 / 92 / 120 / 148. */}
      <StatesMatrix<PlaygroundArgs>
        responsive
        columns={[1, 2, 3, 4, 5].map((count) => ({
          label: `Value = ${count}`,
          props: { count },
        }))}
        rows={[
          { label: "С разделителем", props: { showDivider: true } },
          { label: "Без разделителя", props: { showDivider: false } },
        ]}
        render={({ count = 1, showDivider }) => (
          <div className="w-[320px]">
            <ListOfErrors showDivider={showDivider}>{issues(count)}</ListOfErrors>
          </div>
        )}
      />

      {/* Разделитель принадлежит СПИСКУ, а не строке: два списка подряд
          дадут две линии — так он лежит и в сете. */}
      <StatesMatrix<PlaygroundArgs>
        responsive
        columns={[{ label: "Два списка подряд", props: {} }]}
        rows={[{ label: "Ошибки → предупреждения", props: {} }]}
        render={() => (
          <div className="flex w-[440px] flex-col gap-6">
            <ListOfErrors>{issues(2)}</ListOfErrors>
            <ListOfErrors>
              <IssueItem status="attention">{ISSUES[2].text}</IssueItem>
              <IssueItem status="info">{ISSUES[4].text}</IssueItem>
            </ListOfErrors>
          </div>
        )}
      />
    </div>
  ),
}
