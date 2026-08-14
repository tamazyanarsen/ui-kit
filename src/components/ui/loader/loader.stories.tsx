import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Loader, type LoaderProps } from "./loader"

const meta = {
  title: "Компоненты/Loader",
  component: Loader,
  parameters: { layout: "centered" },
  argTypes: {
    // Дизайн-чек №8: «У нас всегда задействуется лоудер брендового цвета…
    // как максимум можно добавить лоудер в цвете warning». Ровно два цвета —
    // третьего в Core Component быть не должно.
    color: { control: "inline-radio", options: ["brand", "warning"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
  },
  args: {
    color: "brand",
    size: "md",
  },
} satisfies Meta<LoaderProps>

export default meta
type Story = StoryObj<LoaderProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<LoaderProps>
      columns={[
        { label: "S (16px)", props: { size: "sm" } },
        { label: "M (24px)", props: { size: "md" } },
        { label: "L (32px)", props: { size: "lg" } },
      ]}
      rows={[
        { label: "Брендовый", props: { color: "brand" } },
        { label: "Warning", props: { color: "warning" } },
      ]}
      render={(props) => <Loader {...props} />}
    />
  ),
}
