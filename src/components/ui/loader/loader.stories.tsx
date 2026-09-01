import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, optionsArgType } from "@/stories/matrix"

import { Loader, type LoaderProps } from "./loader"

/* Дизайн-чек Storybook 2 (от Notification до Loader) №6: панель и матрица
   пересобраны по компонент-сету `icon / loader` (страница ALL ICONS, раздел
   «24. Loaders», нода 70326:21335). У него ровно две оси:

     Size   16х16 | 24х24 | 40х40
     Color  Green | Yellow | White

   В коде размеры называются sm/md/lg, а цвета — brand/warning/white: «Green»
   это имя из старого бренда, и в текущей палитре тот же слот голубой. */
const SIZE_LABELS: Record<NonNullable<LoaderProps["size"]>, string> = {
  sm: "16х16",
  md: "24х24",
  lg: "40х40",
}

const COLOR_LABELS: Record<NonNullable<LoaderProps["color"]>, string> = {
  brand: "Green",
  warning: "Yellow",
  white: "White",
}

const meta = {
  title: "Компоненты/Loader",
  component: Loader,
  parameters: { layout: "centered" },
  argTypes: {
    size: optionsArgType("Size", SIZE_LABELS, "inline-radio"),
    color: optionsArgType("Color", COLOR_LABELS, "inline-radio"),
    label: {
      control: "text",
      description: "Подпись для скринридера; без неё элемент от него скрыт",
      table: { category: "Контент" },
    },
  },
  args: {
    color: "brand",
    size: "md",
  },
} satisfies Meta<LoaderProps>

export default meta
type Story = StoryObj<LoaderProps>

export const Playground: Story = {
  // Белый лоудер на белом холсте не виден — в макете эта строка тоже стоит на
  // серой плашке (Rectangle 2519 под рядом White, Grey 124 #E6E6E6).
  render: (args) => (
    <div
      className={
        args.color === "white"
          ? "flex items-center justify-center rounded-2xl bg-[#E6E6E6] p-6"
          : undefined
      }
    >
      <Loader {...args} />
    </div>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<LoaderProps>
      columnGroups={[
        {
          label: "Size",
          columns: (
            Object.keys(SIZE_LABELS) as NonNullable<LoaderProps["size"]>[]
          ).map((size) => ({ label: SIZE_LABELS[size], props: { size } })),
        },
      ]}
      rows={(
        Object.keys(COLOR_LABELS) as NonNullable<LoaderProps["color"]>[]
      ).map((color) => ({ label: COLOR_LABELS[color], props: { color } }))}
      // Плашка под белым вариантом — как в макете, иначе третья строка
      // выглядит пустой.
      render={(props) => (
        <div
          className={
            props.color === "white"
              ? "flex items-center justify-center rounded-lg bg-[#E6E6E6] p-2"
              : undefined
          }
        >
          <Loader {...props} />
        </div>
      )}
    />
  ),
}
