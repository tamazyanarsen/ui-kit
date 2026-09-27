import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ToastCard, ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"
import type { ToastBehavior } from "./use-toast"
import type { ToastType } from "./variants"
import { Button } from "@/components/ui/button"

const TYPES: ToastType[] = ["checked", "attention", "error", "information"]

// Собственное свойство макета «Type (Button)»: Two Buttons / Black Button
// (только primary) / White Button (только secondary) / без кнопок.
type ToastButtons = "none" | "two" | "black" | "white"

function buttonData(buttons: ToastButtons) {
  if (buttons === "none") return undefined
  return {
    primaryButtonLabel: buttons !== "white" ? "Повторить" : undefined,
    secondaryButtonLabel: buttons !== "black" ? "Отмена" : undefined,
  }
}

interface PlaygroundArgs {
  type: ToastType
  title: string
  description?: string
  // Дизайн-чек 3/3 №8: поле описания было, а тогла показа — нет; крестика
  // в контролах не было вовсе. Оба — свойства компонент-сета в Figma
  // (Show Description / Show Cross).
  showDescription?: boolean
  showCross?: boolean
  buttons: ToastButtons
  behavior: ToastBehavior
  viewport?: Viewport
}

function ToastLauncher({
  type,
  title,
  description,
  showDescription,
  showCross,
  buttons,
  behavior,
  viewport,
}: PlaygroundArgs) {
  const toast = useToast()
  return (
    // Тост уезжает в портал `Toaster`, поэтому скоуп ставится не здесь, а
    // на самом слое тостов — см. `ToastProvider` в декораторе ниже.
    <ViewportScope viewport={viewport}>
      <Button
        onClick={() =>
          toast.add({
            type,
            title,
            description: showDescription ? description : undefined,
            showCross,
            behavior,
            data: buttonData(buttons),
          })
        }
      >
        Показать тост
      </Button>
    </ViewportScope>
  )
}

const meta = {
  title: "Компоненты/Toast Message",
  component: ToastLauncher,
  parameters: { layout: "centered" },
  // `ToastLauncher` — обычная функция, объявленная локально в этом файле, а
  // не импортированная из модуля компонента. Docgen у Storybook
  // (react-docgen-typescript) надёжно извлекает пропсы только из модулей
  // компонентов, поэтому ни один пропс этой обёртки вообще не получал
  // строки в Controls. Объявляем их явно, чтобы до них можно было
  // добраться.
  /* Панель повторяет свойства компонент-сета `ELK / toast message`:
     Size / Type — плюс булевы слоты мастера и вложенный сет
     «Buttons (Desktop, ELK)» со своим Type. */
  argTypes: {
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: sizeArgType,
    type: optionsArgType<ToastType>("Type", {
      checked: "Checked",
      attention: "Attention",
      error: "Error",
      information: "Information",
    }),
    showDescription: toggleArgType("Show Description"),
    showCross: toggleArgType("Show Cross"),
    buttons: {
      ...optionsArgType<ToastButtons>("Type", {
        none: "None",
        two: "Two Buttons",
        black: "Black Button",
        white: "White Button",
      }),
      table: { category: "Buttons (ELK)" },
    },
    title: { control: "text", table: { category: "Контент" } },
    description: { control: "text", table: { category: "Контент" } },
    /* Дизайн-чек от 08.09, замечание 15: два поведения тоста — «заведи два
       поведения и пропс для разработчиков». Внешне они не отличаются, разница
       видна только в момент ухода, поэтому смотреть надо по таймауту или по
       крестику. */
    behavior: {
      control: "inline-radio",
      options: ["collected", "transient"] satisfies ToastBehavior[],
      name: "Судьба сообщения",
      description:
        "collected — остаётся в центре уведомлений и улетает туда; transient — отклик системы, гаснет на месте",
    },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок свойств мастера. */
  args: {
    viewport: "desktop" as Viewport,
    type: "checked",
    showDescription: false,
    showCross: true,
    buttons: "none",
    behavior: "collected",
    title: "Скопировано в буфер обмена",
    description: "Ссылка на документ сохранена",
  },
  decorators: [
    (Story, context) => (
      <ToastProvider>
        <Story />
        {/* Toaster рисует всплывающий слой, поэтому форму ему задаём
            отдельно: до него скоуп из истории не доходит. */}
        <ViewportScope viewport={context.args.viewport}>
          <Toaster />
        </ViewportScope>
      </ToastProvider>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

/* Матрица рисует `ToastCard` напрямую, а не вызывает `toast.add()` на
   каждую ячейку: через провайдер они сложились бы в стопку в одном углу по
   таймеру на 4 секунды вместо того, чтобы разложиться по сетке. */
interface Cell {
  type: ToastType
  description?: string
  buttons: ToastButtons
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<Cell>
      stretch
      cellClassName="min-w-[360px]"
      responsive
      columns={TYPES.map((type) => ({ label: type, props: { type } }))}
      rows={[
        { label: "Заголовок", props: { buttons: "none" } },
        {
          label: "+ описание",
          props: { buttons: "none", description: "Description" },
        },
        {
          label: "Black Button",
          props: { buttons: "black", description: "Description" },
        },
        {
          label: "White Button",
          props: { buttons: "white", description: "Description" },
        },
        {
          label: "Two Buttons",
          props: { buttons: "two", description: "Description" },
        },
      ]}
      render={({ type, description, buttons }) => (
        <ToastCard
          toast={{
            id: `${type}-${buttons}`,
            type,
            title: "Title",
            description,
            data: buttonData(buttons),
          }}
          onClose={() => {}}
        />
      )}
    />
  ),
}
