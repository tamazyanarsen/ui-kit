import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  stateArgTypeOf,
  type PlaygroundState,
} from "@/stories/matrix"

import { UpButton, type UpButtonProps } from "./up-button"

// У `ELK / up button` ровно одно свойство — `State` (Default, Hover,
// Active), и других вариантов у компонента нет. Без него в Playground не
// было вообще ни одного контрола, повторяющего Figma.
type PlaygroundArgs = UpButtonProps & { state?: PlaygroundState }

const meta = {
  title: "Компоненты/Up Button",
  component: UpButton,
  parameters: { layout: "padded" },
  argTypes: {
    // Единственное свойство мастера.
    state: stateArgTypeOf(["default", "hover", "active"]),
    threshold: { control: "number" },
    hidden: { control: "boolean" },
    // scrollContainer — это React.RefObject<HTMLElement>, и никакое
    // значение JSON не способно создать настоящий ref на DOM, поэтому
    // контрол Storybook может собрать лишь пустой {}, который молча
    // откатывается на `window` (тот же класс непредставимых значений, что и
    // icon с iconPosition у Button, где это уже исправлено).
    scrollContainer: { control: false },
  },
  // threshold=-1 оставляет кнопку видимой сразу на холсте стори; в реальном
  // применении она появляется только после того, как страницу прокрутили за
  // порог.
  args: { threshold: -1, hidden: false, state: "default" as PlaygroundState },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

/* Дизайн-чек 3/3 №30: «кнопки съехали влево вверх относительно всей таблицы
   с матрицей состояний».

   Причина: сам компонент прибит к углу окна классами `fixed right-6 bottom-6`
   — так он и должен вести себя в продукте. Матрица гасила только `fixed`,
   подставляя `relative`; `right-6 bottom-6` при этом оставались в силе и
   сдвигали каждую кнопку на 24px вверх и влево от её ячейки. Класс `static`
   снимает обе беды разом: он тоже из группы `position` (значит, побеждает
   `fixed` в tailwind-merge), но, в отличие от `relative`, у статичного
   элемента смещения `right`/`bottom` вообще не применяются. */
const STORY_POSITION = "static"

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <div className="relative h-40 w-full">
      <PseudoBox state={state} className="absolute right-6 bottom-6">
        <UpButton {...args} className={STORY_POSITION} />
      </PseudoBox>
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<UpButtonProps>
      baseProps={{ threshold: -1 }}
      columns={[{ label: "Up Button" }]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Pressed", props: {}, pseudo: "active" },
        { label: "Focus", props: {}, pseudo: "focus-visible" },
        // `hidden` — это то, чем потребитель её подавляет (например, пока
        // открыто модальное окно): она угасает, а не размонтируется.
        { label: "Hidden", props: { hidden: true } },
      ]}
      render={(props) => <UpButton {...props} className={STORY_POSITION} />}
    />
  ),
}
