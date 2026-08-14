import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import { CREATE_ITEMS } from "@/stories/menu-fixtures"

import { CreateMenu } from "./create-menu"
import type { CreateMenuProps } from "./create-menu"

/* Как и меню навигации, панель создания живёт на затемнении под шапкой — на
   белом фоне её скругления снизу не читаются. */
function MenuStage({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-[var(--modal-backdrop)]/70 pb-8">{children}</div>
}

/* Дизайн-чек №17: количество плиток — ползунком по демо-набору, а не
   JSON-редактором массива. */
type PlaygroundArgs = Omit<CreateMenuProps, "items" | "className"> & {
  itemCount: number
  withIcons: boolean
}

function CreateMenuDemo({ itemCount = CREATE_ITEMS.length, withIcons = true }: Partial<PlaygroundArgs>) {
  const items = CREATE_ITEMS.slice(0, itemCount).map((item) =>
    withIcons ? item : { ...item, icon: undefined }
  )
  return (
    <MenuStage>
      <CreateMenu items={items} />
    </MenuStage>
  )
}

const meta = {
  title: "Компоненты/Раскрытое меню создания",
  component: CreateMenuDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    itemCount: {
      control: { type: "range", min: 1, max: CREATE_ITEMS.length, step: 1 },
      description: "Сколько плиток показать — при переполнении ряд переносится",
    },
    withIcons: {
      control: "boolean",
      description: "Плитка без иконки — вариант из макета (нода 70303:61213)",
    },
  },
  args: {
    itemCount: CREATE_ITEMS.length,
    withIcons: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="p-0">
      <StorySection
        title="Полный набор"
        description="Восемь плиток 160×152 в один ряд с интервалом 24px."
      >
        <CreateMenuDemo />
      </StorySection>

      <StorySection title="Короткий набор" description="Три плитки — ряд не переносится.">
        <CreateMenuDemo itemCount={3} />
      </StorySection>

      <StorySection
        title="Без иконок"
        description="Название занимает всю плитку — вариант плитки из макета без подложки с иконкой."
      >
        <CreateMenuDemo itemCount={4} withIcons={false} />
      </StorySection>
    </StoryShowcase>
  ),
}
