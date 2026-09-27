import { Button } from "@/components/ui/button"
import {
  ButtonMenuBlack,
  ButtonMenuOverflow,
  ButtonMenuOverflowItem,
} from "@/components/ui/button-menu"

import { StoryContentArea, StorySection, StoryShowcase } from "./matrix"

// Витрина «Варианты использования» чёрной панели — 121 строка перечислений.
// Вынесена из файла историй: тот вырос до 377 строк, из которых 312 кода, а
// правило проекта — не больше 300 на файл.
//
// Лежит в `src/stories`, а не рядом с компонентом: см. тот же разбор в
// `block-widget-fixtures.tsx` — `components/ui` уезжает в декларации пакета,
// `src/stories` нет.

const BUTTON_COUNTS = [0, 1, 2, 3, 4] as const
type ButtonCount = (typeof BUTTON_COUNTS)[number]

/* ⚠️ «Tho» — опечатка самого кита в значении «Two». Не исправлена
   намеренно: имя значения здесь должно совпадать с панелью «Свойства
   компонента» посимвольно, иначе сверка со списком свойств перестаёт быть
   один в один. Чинить это надо в Figma, а не у себя. */
const FIGMA_BUTTON_NAMES: Record<ButtonCount, string> = {
  0: "None",
  1: "One",
  2: "Tho",
  3: "Three",
  4: "Four",
}

/* Подписи контрола — как в замечании дизайн-чека: «Button (1/2/3/4)». */
const FIGMA_BUTTON_LABELS: Record<ButtonCount, string> = {
  0: "None",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
}

const LABELS = ["Подписать", "Скачать", "Отправить", "Удалить"]

function blackButtons(count: ButtonCount) {
  // Вариант намеренно не передаётся: ButtonMenuBlack форсит secondary-white
  // для всех кнопок (дизайн-чек №12).
  return LABELS.slice(0, count).map((label) => <Button key={label}>{label}</Button>)
}

const INFO_COUNT = { label: "Выбрано", value: "3 документа" }
const INFO_SUM = { label: "Сумма", value: "1 200 101,16 ₽" }
const INFO_WRITE_OFF = { label: "Счёт списания", value: "40702810…1234" }
const INFO_ITEMS = [INFO_COUNT, INFO_SUM, INFO_WRITE_OFF]

function ButtonMenuBlackExamples() {
  return (
    <StoryShowcase>
      <StorySection
        title="Закреплена снизу (по умолчанию)"
        description="Панель подменяет собой белую, пока выделены строки таблицы, и стоит там же — у нижнего края контентной области."
      >
        <StoryContentArea height="h-72">
          <div className="flex flex-col gap-4 p-6">
            {Array.from({ length: 10 }, (_, index) => (
              <p key={index} className="text-p2-medium text-[var(--accordion-card-subtitle-fg)]">
                Выделенная строка {index + 1}
              </p>
            ))}
          </div>
          <ButtonMenuBlack
            className="mt-auto"
            info={[{ label: "Выбрано", value: "3 документа" }]}
            onClose={() => {}}
          >
            {blackButtons(2)}
          </ButtonMenuBlack>
        </StoryContentArea>
      </StorySection>

      <StorySection
        title="Свойство Button — от None до Four"
        description="Кнопки на тёмной панели всегда белые: брендового акцента здесь нет."
      >
        <div className="flex w-full flex-col gap-4">
          {BUTTON_COUNTS.map((count) => (
            <div key={count} className="flex flex-col gap-1">
              {/* Имя значения — как в Figma, чтобы сверка шла один в один. */}
              <span className="text-p3-medium text-[#999999]">
                Button = {FIGMA_BUTTON_NAMES[count]}
              </span>
              {/* Витрина: панели стоят стопкой образцами, поэтому
                  закрепление выключено — иначе все прилипли бы к низу разом.
                  Закрепление показано отдельной секцией ниже. */}
              <ButtonMenuBlack
                pinned={false}
                info={[{ label: "Выбрано", value: "3 документа" }]}
                onClose={() => {}}
              >
                {blackButtons(count)}
              </ButtonMenuBlack>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Информационный бар"
        description="Поля бара можно отключить частично или полностью."
      >
        <div className="flex w-full flex-col gap-4">
          {([3, 2, 1, 0] as const).map((fields) => (
            <ButtonMenuBlack
              pinned={false}
              key={fields}
              info={INFO_ITEMS.slice(0, fields)}
              onClose={() => {}}
            >
              {blackButtons(2)}
            </ButtonMenuBlack>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="С меню «ещё»"
        description="Когда действий больше трёх, лишнее уходит в More."
      >
        <div className="w-full">
          <ButtonMenuBlack
            info={[{ label: "Выбрано", value: "3 документа" }]}
            onClose={() => {}}
          >
            {blackButtons(3)}
            <ButtonMenuOverflow>
              <ButtonMenuOverflowItem text="Отправить по почте" />
              <ButtonMenuOverflowItem text="Архивировать" />
            </ButtonMenuOverflow>
          </ButtonMenuBlack>
        </div>
      </StorySection>

      <StorySection
        title="Размещение на сетке"
        description="Полная ширина — 12 колонок. Слева и справа полоса занимает заданное число колонок той же сетки, что и контент вокруг."
      >
        <div className="flex w-full flex-col gap-4">
          {(["full", "left", "right"] as const).map((placement) => (
            <ButtonMenuBlack
              key={placement}
              pinned={false}
              placement={placement}
              span={6}
              showSelectAllPages={false}
              info={[{ label: "Выбрано", value: "3 документа" }]}
              onClose={() => {}}
            >
              {blackButtons(2)}
            </ButtonMenuBlack>
          ))}
        </div>
      </StorySection>

      <StorySection title="Без крестика">
        <div className="w-full">
          <ButtonMenuBlack info={[{ label: "Выбрано", value: "3 документа" }]}>
            {blackButtons(2)}
          </ButtonMenuBlack>
        </div>
      </StorySection>
    </StoryShowcase>
  )
}

export {
  BUTTON_COUNTS,
  ButtonMenuBlackExamples,
  FIGMA_BUTTON_LABELS,
  FIGMA_BUTTON_NAMES,
  INFO_COUNT,
  INFO_ITEMS,
  INFO_SUM,
  INFO_WRITE_OFF,
  blackButtons,
}
export type { ButtonCount }
