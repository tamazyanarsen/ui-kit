import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import {
  EMPLOYEE_MENU_FAVOURITES,
  EMPLOYEE_MENU_FAVOURITES_MANY,
  EMPLOYEE_MENU_GROUPS,
} from "@/stories/menu-fixtures"
import { Grid, GridRoot } from "@/components/ui/grid"
import { Header } from "@/components/ui/header"

import { EmployeeMenu } from "./employee-menu"
import type { EmployeeMenuProps } from "./employee-menu"

/* Меню лежит на серой подложке главного экрана, а карточки в нём белые —
   на белом холсте Storybook их границ не было бы видно вовсе. Подложка
   здесь та же, что и у `Canvas` в макете. */
function MenuStage({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-[#F4F4F4] p-10">{children}</div>
}

type PlaygroundArgs = Omit<
  EmployeeMenuProps,
  "groups" | "favourites" | "onFavouriteToggle" | "className"
> & {
  groupCount: number
}

function EmployeeMenuDemo({
  groupCount = EMPLOYEE_MENU_GROUPS.length,
  ...props
}: Partial<PlaygroundArgs>) {
  /* Избранное живёт в состоянии истории, иначе звёзды не переключались бы:
     компонент его не хранит — владелец один и для меню, и для шапки. */
  const [favourites, setFavourites] = useState(EMPLOYEE_MENU_FAVOURITES)
  return (
    <MenuStage>
      <Grid>
        <EmployeeMenu
          {...props}
          groups={EMPLOYEE_MENU_GROUPS.slice(0, groupCount)}
          favourites={favourites}
          onFavouriteToggle={(value) =>
            setFavourites((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
            )
          }
        />
      </Grid>
    </MenuStage>
  )
}

const meta = {
  title: "Компоненты/Меню/Меню сотрудника",
  component: EmployeeMenuDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    groupCount: {
      name: "Группы страниц",
      control: { type: "range", min: 1, max: EMPLOYEE_MENU_GROUPS.length, step: 1 },
      description: "Сколько «Групп страниц» показать из демо-набора",
    },
    columns: {
      name: "Колонки",
      control: "inline-radio",
      options: [2, 3, 4],
      description:
        "Явное перекрытие: сам компонент берёт 4 колонки с 1536px и 3 ниже",
    },
    showFavourites: {
      name: "Звёзды «в избранное»",
      control: "boolean",
      description: "Выключается там, где закреплять некуда — меню без шапки",
    },
    activeLink: {
      name: "Текущий раздел",
      control: "select",
      options: [
        undefined,
        ...EMPLOYEE_MENU_GROUPS.flatMap((group) =>
          group.links.map((link) => link.value)
        ),
      ],
      description: "Подсвечивается брендовым цветом — так же, как на наведении",
    },
  },
} satisfies Meta<typeof EmployeeMenuDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    groupCount: EMPLOYEE_MENU_GROUPS.length,
    columns: 4,
    showFavourites: true,
    activeLink: "certificates",
  },
}

/* Целый экран — шапка плюс меню под ней. Только так видно главное:
   звезда у ссылки и пункт в верхней полосе — одно состояние. */
function EmployeeScreen({
  initialFavourites,
  columns,
  activeLink = "certificates",
}: {
  initialFavourites: string[]
  columns?: 2 | 3 | 4
  activeLink?: string
}) {
  const [favourites, setFavourites] = useState(initialFavourites)
  return (
    <GridRoot className="bg-[#F4F4F4]">
      <Header
        type="employee"
        employeeName="Константинопольский К. К."
        menuGroups={EMPLOYEE_MENU_GROUPS}
        favourites={favourites}
        onFavouritesChange={setFavourites}
        activeSection={activeLink}
        notificationItems={[]}
      />
      <Grid className="flex flex-col gap-6 py-10">
        <h1 className="text-h1 text-[var(--header-fg)]">Добрый день, Константин!</h1>
        <EmployeeMenu
          groups={EMPLOYEE_MENU_GROUPS}
          columns={columns}
          favourites={favourites}
          onFavouriteToggle={(value) =>
            setFavourites((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
            )
          }
          activeLink={activeLink}
        />
      </Grid>
    </GridRoot>
  )
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="bg-white p-0">
      <StorySection
        title="Мало избранного"
        description="Стартовый набор сотрудника из комментария макета: Письма, Справки, Платежи, Платежи СБП, Продуктовый каталог. Отмеченные звездой разделы стоят в верхней полосе в том же порядке."
      >
        <EmployeeScreen initialFavourites={EMPLOYEE_MENU_FAVOURITES} />
      </StorySection>
      <StorySection
        title="Нет избранного"
        description="Полоса подсказывает, откуда берутся её пункты: «Наведите курсор на элемент на главной и нажмите ☆ справа»."
      >
        <EmployeeScreen initialFavourites={[]} activeLink={undefined} />
      </StorySection>
      <StorySection
        title="Много избранного — лишнее уходит в «Ещё»"
        description="Пункты уезжают под «Ещё» по одному, как только перестают помещаться; текущий раздел помечен там галочкой."
      >
        <EmployeeScreen
          initialFavourites={EMPLOYEE_MENU_FAVOURITES_MANY}
          activeLink="ka-reports"
        />
      </StorySection>
      <StorySection
        title="Адаптив — три колонки"
        description="Ниже 1536px меню строится в три колонки по четыре колонки сетки (384px при полосе 1200)."
      >
        <EmployeeScreen
          initialFavourites={EMPLOYEE_MENU_FAVOURITES}
          columns={3}
        />
      </StorySection>
    </StoryShowcase>
  ),
}
