import type { Meta, StoryObj } from "@storybook/react-vite"

import { useState } from "react"

import { StorySection, StoryShowcase, optionsArgType } from "@/stories/matrix"
import { cn } from "@/lib/utils"
import { Scrollbar } from "@/components/ui/scrollbar"

import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  type DropdownSize,
} from "./dropdown"
import { DropdownFooter, DropdownFooterButton } from "./dropdown-footer"
import { DropdownHelp, DropdownSearch } from "./dropdown-search"

/**
 * Dropdown — поверхность выпадающего списка, которую Figma документирует
 * отдельным компонентом («Больше информации о выпадающем списке вы можете
 * найти в разделе Select, Dropdown» — это перекрёстная ссылка на компонент,
 * а не на общий вид). Истории у неё не было, хотя через неё рисуются
 * Select, Combobox, Autocomplete, меню «ещё» у Button Menu и Selection
 * Button.
 *
 * Свойства компонент-сета `ELK / dropdown` и что им соответствует здесь:
 *
 *   Value  1…11        — сколько строк в списке
 *   Add    None | One Button | Two Buttons — панель действий снизу
 *   Size   Desktop | Mobile Full Screen | Mobile Bottom Sheet
 *
 * Дизайн-чек Storybook (Аня Багрова) №27: «отсутствует вариант Mobile».
 * Раньше `Size` в контролах не было — считалось, что мобильные формы это
 * решение потребителя. Но в мастере они отличаются самой поверхностью: Full
 * Screen — во весь экран, без скруглений и тени; Bottom Sheet — лист снизу
 * со скруглением только сверху. Плюс обе несут строку заголовка с
 * крестиком. Всё это теперь умеет сам компонент.
 */

const ITEMS = [
  { text: "Платежи", description: "Переводы и платёжные поручения" },
  { text: "Счета", description: "Расчётные и специальные" },
  { text: "Операции и выписки", description: "История по всем счетам" },
  { text: "Бизнес-карты", description: "Выпуск и обслуживание" },
  { text: "Депозиты", description: "Размещение свободных средств" },
  { text: "Справки", description: "Документы по запросу" },
  { text: "Письма в банк", description: "Свободная форма" },
  { text: "Помощь", description: "Ответы на вопросы" },
  { text: "Зарплатный проект", description: "Ведомости и карты" },
  { text: "QR-коды СБП", description: "Приём оплаты" },
  { text: "Эскроу", description: "Счета для сделок" },
]

const ADD = ["None", "One Button", "Two Buttons"] as const
type AddValue = (typeof ADD)[number]

interface PlaygroundArgs {
  size: DropdownSize
  value: number
  add: AddValue
  showSearch: boolean
  showTextHelp: boolean
  showList: boolean
  showDescription: boolean
  maxHeight: number
}

const SIZE_LABELS: Record<DropdownSize, string> = {
  desktop: "Desktop",
  "mobile-full-screen": "Mobile Full Screen",
  "mobile-bottom-sheet": "Mobile Bottom Sheet",
}

/* Панель действий — свойство `Add` компонент-сета. Кнопки плоские и во всю
   ширину панели, а не пилюли `Button`: замер варианта Desktop даёт ячейку 56
   с полями 32/16, подписью P1 Medium и разделителями Grey 134 (дизайн-чек
   «Storybook 3», замечание 7). */
function Footer({ add }: { add: AddValue }) {
  if (add === "None") return null
  return (
    <DropdownFooter>
      {add === "Two Buttons" && (
        <DropdownFooterButton>Сбросить</DropdownFooterButton>
      )}
      <DropdownFooterButton>Выбрать</DropdownFooterButton>
    </DropdownFooter>
  )
}

function DropdownDemo({
  size = "desktop",
  value = 5,
  add = "None",
  showSearch = false,
  showTextHelp = false,
  showList = true,
  showDescription = true,
  maxHeight = 0,
}: Partial<PlaygroundArgs>) {
  const [query, setQuery] = useState("")
  const items = ITEMS.slice(0, value)
  const list = items.map((item) => (
    <DropdownItem
      key={item.text}
      text={item.text}
      description={showDescription ? item.description : undefined}
    />
  ))
  const mobile = size !== "desktop"

  const surface = (
    <Dropdown size={size} className={cn("overflow-hidden", !mobile && "w-96")}>
      {mobile && <DropdownHeader title="Выберите раздел" />}
      {showSearch && (
        <DropdownSearch
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
      )}
      {showTextHelp && <DropdownHelp>Начните вводить параметры поиска</DropdownHelp>}
      {showList &&
        (maxHeight > 0 ? (
          // У длинного списка появляется собственный ELK / scrollbar.
          <Scrollbar inset="dropdown" style={{ maxHeight }}>
            {list}
          </Scrollbar>
        ) : (
          <div className={cn(mobile && "min-h-0 flex-1 overflow-y-auto")}>{list}</div>
        ))}
      <Footer add={add} />
    </Dropdown>
  )

  if (!mobile) return surface

  // Мобильные формы показываются внутри рамки телефона: без неё «во весь
  // экран» и «лист снизу» на холсте Storybook выглядят одинаково.
  return (
    <div className="relative flex h-[560px] w-[360px] flex-col overflow-hidden rounded-[24px] border border-[var(--divider)] bg-[var(--card-bg)]">
      {size === "mobile-bottom-sheet" && (
        <div className="absolute inset-0 bg-[var(--modal-backdrop)]/70" />
      )}
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col",
          size === "mobile-bottom-sheet" && "justify-end"
        )}
      >
        {surface}
      </div>
    </div>
  )
}

const meta = {
  title: "Компоненты/Dropdown",
  component: DropdownDemo,
  parameters: { layout: "padded" },
  argTypes: {
    size: optionsArgType("Size", SIZE_LABELS),
    value: {
      name: "Value (строк)",
      control: { type: "range", min: 1, max: ITEMS.length, step: 1 },
      description: "Свойство Value компонент-сета ELK / dropdown",
    },
    add: {
      name: "Add",
      control: "inline-radio",
      options: ADD,
      description: "Панель действий снизу: нет, одна кнопка или две",
    },
    showSearch: {
      control: "boolean",
      name: "Show Search",
      description: "Строка поиска сверху: 56, глиф 24, нижний разделитель",
    },
    showTextHelp: {
      control: "boolean",
      name: "Show Text Help",
      description:
        "Подсказка под поиском — по спецификации поля поиска стоит на месте списка, пока не введены три символа",
    },
    showList: {
      control: "boolean",
      name: "Show List",
      description: "Сам список строк",
    },
    showDescription: {
      control: "boolean",
      name: "Описание в строке",
      description: "Строка меню со вторым уровнем текста (P3 Medium)",
    },
    maxHeight: {
      control: { type: "range", min: 0, max: 400, step: 20 },
      description: "Максимальная высота списка; 0 — без ограничения и без скролла",
    },
  },
  args: {
    size: "desktop",
    value: 5,
    add: "Two Buttons",
    showSearch: true,
    showTextHelp: false,
    showList: true,
    showDescription: true,
    maxHeight: 0,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Add = None"
        description="Обычный список действий — так его рисуют меню «ещё» у Button Menu и Selection Button."
      >
        <DropdownDemo value={4} showDescription={false} />
      </StorySection>

      <StorySection
        title="Add = One Button / Two Buttons"
        description="Панель действий вплотную к нижним углам: кнопки — настоящие ELK / button, разделённые вертикальным ELK / divider."
      >
        <div className="flex items-start gap-6">
          <DropdownDemo value={3} add="One Button" showDescription={false} />
          <DropdownDemo value={3} add="Two Buttons" showDescription={false} />
        </div>
      </StorySection>

      <StorySection
        title="Show Search + Show Text Help"
        description="Строка поиска — часть самого списка: 56 в высоту, глиф 24, нижний разделитель Grey 134 и никакой собственной коробки. Подсказка занимает место списка, пока в поиск не ввели три символа."
      >
        <div className="flex items-start gap-6">
          <DropdownDemo value={4} showSearch showDescription={false} />
          <DropdownDemo value={0} showSearch showTextHelp showList={false} />
        </div>
      </StorySection>

      <StorySection
        title="Строка с описанием"
        description="Основной текст P1 Medium, описание P3 Medium — те же токены, что у общей строки меню (дизайн-чек №21)."
      >
        <DropdownDemo value={4} />
      </StorySection>

      <StorySection
        title="Size = Mobile Full Screen / Mobile Bottom Sheet"
        description="Мобильные формы поверхности: во весь экран без скруглений и лист снизу со скруглением только сверху. Обе несут строку заголовка с крестиком."
      >
        <div className="flex items-start gap-6">
          <DropdownDemo size="mobile-full-screen" value={6} />
          <DropdownDemo size="mobile-bottom-sheet" value={4} />
        </div>
      </StorySection>

      <StorySection
        title="Value = 11 со своим скроллом"
        description="Когда список не помещается, у поверхности появляется собственный ELK / scrollbar."
      >
        <DropdownDemo value={11} maxHeight={280} showDescription={false} />
      </StorySection>
    </StoryShowcase>
  ),
}
