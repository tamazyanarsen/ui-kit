import type { Meta, StoryObj } from "@storybook/react-vite"

import { Scrollbar } from "./scrollbar"
import { Checkbox } from "@/components/ui/checkbox"

const meta = {
  title: "Pattern/Scrollbar",
  component: Scrollbar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Scrollbar>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  // Zero-arg render hardcodes orientation/content — the inherited
  // `orientation` select control would sit in the panel doing nothing.
  parameters: { controls: { disable: true } },
  render: () => (
    <Scrollbar orientation="vertical" className="h-52 w-56 rounded-2xl border bg-white py-2 pr-2 pl-4">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <Checkbox label={`Label ${i + 1}`} />
          </li>
        ))}
      </ul>
    </Scrollbar>
  ),
}

export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Scrollbar orientation="horizontal" className="w-80 rounded-2xl border bg-white p-4">
      <div className="flex w-[900px] gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-16 w-32 shrink-0 rounded-lg bg-[var(--filter-grey-bg)]" />
        ))}
      </div>
    </Scrollbar>
  ),
}
