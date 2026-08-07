import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

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
}

function ToastLauncher({ type, title, description, buttons }: PlaygroundArgs) {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast.add({ type, title, description, data: buttonData(buttons) })
      }
    >
      Показать тост
    </Button>
  )
}

const meta = {
  title: "Status/Message/Toast Message",
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
  },
  args: {
    type: "checked",
    title: "Скопировано в буфер обмена",
    description: "",
    buttons: "none",
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
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
      rowHeader={RESPONSIVE_NOTE}
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

// Size=Mobile: 328px wide, 16px padding and a 16px close cross (Desktop is
// 480/24/24). Pinned through `globals` because `md:` is a viewport media
// query — see the note on Button's own mobile story.
export const MobileSize: Story = {
  name: "Mobile (328px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  args: {
    type: "checked",
    title: "Платёж отправлен",
    description: "Мы уведомим вас о статусе",
    buttons: "none",
  },
}
