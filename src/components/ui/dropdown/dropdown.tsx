import * as React from "react"
import { CheckIcon, X } from "@/icons"

import { cn } from "@/lib/utils"
import { usePressTracking } from "@/lib/use-press-tracking"
import { hasNode } from "@/lib/has-node"

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
    // Строки внутри сжимаются на зажатие (`press-scale-content`), а Base UI
    // гасит у них `mousedown` — нужен атрибут нажатия, см. хук.
    usePressTracking()
    return (
      <div
        ref={ref}
        data-slot="dropdown"
        data-size={size}
        // Мобильные формы поверхности — это мобильная форма всего, что в них
        // лежит (кнопка блока `Panel Button` S Mobile 12/16, а не 14/20 на
        // десктопном окне), поэтому корень сам объявляет скоуп, как это
        // делает `ViewportScope`. Свой `data-viewport` потребителя выигрывает.
        data-viewport={size === "desktop" ? undefined : "mobile"}
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

interface DropdownItemProps extends React.ComponentProps<"div"> {
  text: React.ReactNode
  description?: React.ReactNode
  /**
   * Отметка выбранного пункта (Правки UI-Kit от 25.10): не задано — строка
   * без галки и без места под неё; `false` — место справа 48 под галку
   * оставлено, галки нет; `true` — голубая галка 16 у правого поля, как у
   * `SelectItem`. Места под галку держат все строки списка, а не только
   * выбранная, — иначе текст выбранной переносился бы раньше соседних.
   */
  checked?: boolean
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
// Строка идёт от края до края, без собственных скруглений, с полем 16.
// Скруглён только сам контейнер Dropdown, и он же подрезает верхнюю и
// нижнюю строки по своим углам.
//
// Правки UI-Kit от 25.10 — одно поведение у всех строк выпадающих списков:
//   • наведение (только мышь) и подсветка с клавиатуры — Grey 114, нажатие —
//     Grey 124, смена цвета 200 мс `ease` — общий класс `menu-row`. Он
//     работает и по `:hover`, и по `data-highlighted`: строка законно
//     используется и сама по себе (витрина Dropdown), где Base UI
//     `data-highlighted` не ставит (дизайн-чек от 07.09, замечание 12);
//   • на зажатие содержимое сжимается к центру строки одним целым: всё
//     содержимое — в одной обёртке, и поля 16 лежат на ней, а не на строке,
//     поэтому центр обёртки и есть центр строки. Прежняя опора на левый
//     край (дизайн-чек 08.10, замечание 37) снята;
//   • текст переносится, многоточия нет — строка растёт по высоте;
//   • курсор — рука, у выключенной строки not-allowed (styles/rules-lists.css),
//     поэтому `pointer-events: none` у выключенной больше не ставится:
//     нажатие выключенного пункта гасит сам примитив Base UI.
const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem({ className, text, description, checked, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown-item"
        className={cn(
          "flex outline-none select-none menu-row press-scale-content data-disabled:opacity-40",
          className
        )}
        {...props}
      >
        <span
          data-slot="dropdown-item-content"
          className={cn(
            "relative flex w-full min-w-0 flex-col gap-1 p-4 [overflow-wrap:anywhere]",
            checked !== undefined && "pr-12"
          )}
        >
          <span className="text-p1-medium text-[var(--menu-item-fg)]">{text}</span>
          {hasNode(description) && (
            <span className="text-p3-medium text-[var(--menu-item-description-fg)]">{description}</span>
          )}
          {children}
          {checked && (
            <CheckIcon
              aria-hidden="true"
              data-slot="dropdown-item-check"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[var(--check-mark-fg)]"
            />
          )}
        </span>
      </div>
    )
  }
)

export { Dropdown, DropdownHeader, DropdownItem }
export type { DropdownItemProps, DropdownProps, DropdownSize }
