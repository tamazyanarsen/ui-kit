import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, optionsArgType } from "@/stories/matrix"
import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"
import { Scrollbar } from "@/components/ui/scrollbar"
import { Button } from "@/components/ui/button"

import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  type DropdownSize,
} from "./dropdown"

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
  showDescription: boolean
  maxHeight: number
}

const SIZE_LABELS: Record<DropdownSize, string> = {
  desktop: "Desktop",
  "mobile-full-screen": "Mobile Full Screen",
  "mobile-bottom-sheet": "Mobile Bottom Sheet",
}

/* Панель действий — тот же `ELK / button` в footer'е, что у Combobox:
   «Сбросить» слева, основное действие справа, разделённые вертикальным
   `ELK / divider`, вплотную к нижним углам поверхности. */
function Footer({ add }: { add: AddValue }) {
  if (add === "None") return null
  return (
    <>
      <Divider />
      <div className="flex items-stretch">
        {add === "Two Buttons" && (
          <>
            <Button variant="secondary-white" size="lg" className="min-w-0 flex-1 rounded-none">
              Сбросить
            </Button>
            <Divider orientation="vertical" />
          </>
        )}
        <Button variant="secondary-white" size="lg" className="min-w-0 flex-1 rounded-none">
          Выбрать
        </Button>
      </div>
    </>
  )
}

function DropdownDemo({
  size = "desktop",
  value = 5,
  add = "None",
  showDescription = true,
  maxHeight = 0,
}: Partial<PlaygroundArgs>) {
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
      {maxHeight > 0 ? (
        // У длинного списка появляется собственный ELK / scrollbar.
        <Scrollbar className="pr-2" style={{ maxHeight }}>
          {list}
        </Scrollbar>
      ) : (
        <div className={cn(mobile && "min-h-0 flex-1 overflow-y-auto")}>{list}</div>
      )}
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
    add: "None",
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
