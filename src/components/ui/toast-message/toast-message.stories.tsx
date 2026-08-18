import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { ToastCard, ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"
import type { ToastType } from "./variants"
import { Button } from "@/components/ui/button"

const TYPES: ToastType[] = ["checked", "attention", "error", "information"]

// Figma's own "Type (Button)" property: Two Buttons / Black Button (primary
// only) / White Button (secondary only) / none.
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
  buttons: ToastButtons
  viewport?: Viewport
}

function ToastLauncher({
  type,
  title,
  description,
  buttons,
  viewport,
}: PlaygroundArgs) {
  const toast = useToast()
  return (
    // Тост уезжает в портал `Toaster`, поэтому скоуп ставится не здесь, а
    // на самом слое тостов — см. `ToastProvider` в декораторе ниже.
    <ViewportScope viewport={viewport}>
      <Button
        onClick={() =>
          toast.add({ type, title, description, data: buttonData(buttons) })
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
  // `ToastLauncher` is a plain function declared locally in this file rather
  // than imported from its own component module — Storybook's docgen
  // (react-docgen-typescript) only reliably extracts props from component
  // modules, so none of this wrapper's props got a Controls row at all.
  // Declare them explicitly so they're actually reachable.
  argTypes: {
    type: { control: "select", options: TYPES },
    title: { control: "text" },
    description: { control: "text" },
    buttons: { control: "select", options: ["none", "two", "black", "white"] },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    type: "checked",
    title: "Скопировано в буфер обмена",
    description: "",
    buttons: "none",
    viewport: "auto" as Viewport,
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

/* The matrix renders `ToastCard` directly rather than firing `toast.add()`
   for every cell — going through the provider would stack them in one corner
   on an 8s timer instead of laying them out. */
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
