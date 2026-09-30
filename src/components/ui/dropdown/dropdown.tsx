import * as React from "react"
import { X } from "@/icons"

import { cn } from "@/lib/utils"

// Dropdown — всплывающая поверхность, которую макет описывает как
// отдельный переиспользуемый компонент (на канвасе самого Select лежат три
// разные таблицы свойств: Select, Menu Point и Dropdown, а фраза «Больше
// информации о выпадающем списке вы можете найти в разделе Select,
// Dropdown» — это перекрёстная ссылка между компонентами, а не просто общий
// внешний вид). Все плавающие списки опций и действий в ките — Select,
// Combobox, Autocomplete, перекрытие «...» у Button Menu, Selection Button —
// рисуются через этот один компонент, подставляясь в `render` каждого
// примитива, вместо того чтобы каждый заново выводил обрамление всплывающего
// окна из общей строки классов.
//
// forwardRef здесь обязателен, а не желателен: пропс `render` в Base UI
// пробрасывает ref в элемент, который подставляет (для позиционирования
// floating-ui и работы с фокусом), и обычный функциональный компонент этот
// ref молча потеряет.
/**
 * Свойство `Size` компонент-сета `ELK / dropdown`.
 *
 * Дизайн-чек Storybook (Аня Багрова) №27: «отсутствует вариант Mobile». В
 * макете их два и они отличаются не только шириной: Mobile Full Screen —
 * лист во весь экран без скруглений и тени, Mobile Bottom Sheet — лист
 * снизу со скруглением только сверху. Оба несут строку заголовка с
 * крестиком, поэтому рядом лежит {@link DropdownHeader}.
 */
type DropdownSize = "desktop" | "mobile-full-screen" | "mobile-bottom-sheet"

// Десктоп — габариты мастера `ELK / dropdown`: min-w 280, max-w 1008,
// max-h 504 (у мастера `min-h 56` тоже, но пустой список кит не показывает).
// Высота — меньшее из 504 и места до края окна (`--available-height`
// проставляет позиционер Base UI): у окна вне позиционера переменной нет, и
// без запасного значения `min()` целиком признавался бы недействительным.
// Прокрутка — у самого окна; потребитель с внутренним списком (`flex-col` и
// `overflow-hidden`) перекрывает её своей. Потребитель, которому нужна
// другая ширина, перекрывает `min-w-*`/`max-w-*` через `className`.
const DROPDOWN_SIZE: Record<DropdownSize, string> = {
  desktop:
    "max-h-[min(504px,var(--available-height,504px))] max-w-[1008px] min-w-70 overflow-x-hidden overflow-y-auto rounded-[16px] shadow-universal",
  "mobile-full-screen": "flex h-full w-full flex-col rounded-none",
  "mobile-bottom-sheet":
    "flex max-h-[80vh] w-full flex-col rounded-t-[24px] shadow-universal",
}

interface DropdownProps extends React.ComponentProps<"div"> {
  size?: DropdownSize
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown({ className, size = "desktop", children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown"
        data-size={size}
        className={cn(
          "group/dropdown bg-popover text-popover-foreground outline-none origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          DROPDOWN_SIZE[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

/**
 * Строка заголовка мобильных форм: название списка и крестик закрытия
 * (в макете — `Title` + `24x24 / Cross`, поля 16).
 */
function DropdownHeader({
  title,
  onClose,
  className,
}: {
  title: React.ReactNode
  onClose?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="dropdown-header"
      // Строка заголовка мобильной шторки: px 16, py 13 при заголовке 22/30
      // (Header, H2 Medium Mobile) — итого 56.
      className={cn("flex items-center gap-4 px-4 py-[13px]", className)}
    >
      <span className="min-w-0 flex-1 truncate text-h2-mobile text-[var(--menu-item-fg)]">
        {title}
      </span>
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-[var(--menu-item-fg)] outline-none focus-visible:focus-ring"
      >
        <X size={24} aria-hidden="true" className="size-6" />
      </button>
    </div>
  )
}

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

interface DropdownItemProps extends React.ComponentProps<"div"> {
  text: React.ReactNode
  description?: React.ReactNode
}

// Вариант строки «Menu Point», которым пользуются списки действий выше:
// заголовок плюс необязательное описание, подсветка по наведению и фокусу.
// У собственного SelectItem другой вид, построенный вокруг флажка (см.
// select/item.tsx), и он остаётся отдельным; здесь именно простая строка
// действия.
//
// Дизайн-чек №21: типографика и цвета здесь те же, что у общей строки меню
// (`@/components/ui/menu-item`) — P1 Medium на основной текст, P3 Medium на
// описание, `--menu-item-*` на цвета. Своей вёрстки строка не держит только
// потому, что у неё нет ведущего элемента: это колонка из двух строк, а не
// ряд «контрол + текст». Новые строки с чекбоксом или иконкой собирайте на
// `MenuItemContent`, как это делает Combobox.
//
// Строка идёт от края до края, без собственных скруглений, с отступом p-4 и
// плоской заливкой подсветки --menu-item-bg-highlighted (#F8F8F8). Сверено
// с литеральной разметкой «Menu Point (ELK)» внутри канонического компонента
// «ELK / dropdown» и с состоянием наведения «Уровень 2» на канвасе
// использования Select/Dropdown: пункты идут `p-[16px]` во всю ширину и без
// своего радиуса, с тем же цветом подсвеченной строки #F8F8F8, что и у
// пунктов Select и Combobox. Скруглён только сам контейнер Dropdown, и он же
// подрезает верхнюю и нижнюю строки по своим углам (см. `overflow-hidden`,
// который добавляет каждый потребитель).
const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem({ className, text, description, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown-item"
        className={cn(
          "flex cursor-pointer flex-col gap-1 p-4 outline-none transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-40",
          // ⚠️ ДВА селектора подсветки, а не один. `data-highlighted` ставит
          // примитив Base UI, когда строка лежит внутри его меню — этим
          // живут Select, Combobox, меню «ещё». Но `DropdownItem` законно
          // используется и сам по себе (так собрана вся витрина Dropdown), а
          // там `data-highlighted` не появляется НИКОГДА, и строка выглядела
          // мёртвой: дизайн-чек от 07.09, замечание 12 — «строки выпадающего
          // списка не меняют цвет при ховере, должны, см. компонент Menu
          // Item». Обычный `hover:` — та же половина правила, что у
          // `menuItemRowClass` (см. components/ui/menu-item).
          "hover:bg-[var(--menu-item-bg-highlighted)] data-highlighted:bg-[var(--menu-item-bg-highlighted)]",
          "data-disabled:hover:bg-transparent",
          className
        )}
        {...props}
      >
        <span className="text-p1-medium [overflow-wrap:anywhere] text-[var(--menu-item-fg)]">{text}</span>
        {hasValue(description) && (
          <span className="text-p3-medium [overflow-wrap:anywhere] text-[var(--menu-item-description-fg)]">{description}</span>
        )}
        {children}
      </div>
    )
  }
)

export { Dropdown, DropdownHeader, DropdownItem }
export type { DropdownItemProps, DropdownProps, DropdownSize }
