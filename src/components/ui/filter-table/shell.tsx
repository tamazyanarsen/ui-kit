import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { ChevronDown, X } from "@/icons"

import { cn } from "@/lib/utils"
import { POPUP_COLLISION } from "@/lib/popup-position"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { useViewportAttr } from "@/lib/viewport"
import { filterTablePillClass } from "./filter-table"
import { Badge } from "@/components/ui/badge"
import { Dropdown } from "@/components/ui/dropdown"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

import { FitLabel } from "./fit-label"

// FilterShell — триггер-чип и всплывающее окно, общие для всех видов
// фильтра.
//
// «Фильтрация (ЕЛК)» описывает один триггер и несколько видов выпадающего
// окна, которые к нему подвешиваются (Множественный выбор / Date / Сумма /
// Search / Булев). Правила триггера у всех общие:
//
//   • «Минимальная ширина — 80 px, максимальная ширина — 256 px. Если
//     название не умещается в максимальную ширину, то оно скрывается в
//     многоточие».
//   • «Кнопки в фильтрах не блокируются» — «Сбросить» и «Применить» всегда
//     живые.
//
// По видам меняются только тело всплывающего окна и его ширина — именно эти
// две вещи оболочка и берёт у вызывающего кода.
//
// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (уже 1280, `useIsDesktop()`) окно — не поповер у
// триггера, а штора `Modal` кита: заголовок — название фильтра, ниже тело
// (`sheetBody`, без него — те же `children`), внизу кнопки во всю ширину
// (`sheetFooter`). Триггер тот же; крестик сброса на нём работает, не
// открывая шторы.

const ICON_SIZE = "size-4"

/**
 * `Type` фильтра — из чего собран его элемент вызова.
 *
 * Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 6. В макете
 * (`ELK / filter-table`) это два независимых булевых свойства `Select` и
 * `Counter`, но встречаются они только по одному: символов `Select=True,
 * Counter=True` в сете нет. Дизайнер и свёл их в один список из трёх
 * значений — здесь ровно он.
 *
 * ⚠️ Триггер фильтра в ките ОДИН — этот. Раньше у `FilterTableSelect` был
 * свой (`select-trigger.tsx`) с тем же видом, и правки расходились: обёртка
 * под узкую колонку и минимальная ширина 80 из правил триггера жили только
 * в одной из копий (ревью 10.10, п. 10 и КК-2).
 */
type FilterType = "text" | "select" | "counter"

// Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 5: коробка chips-filter
// из фильтра убрана целиком — элемент вызова у всех видов фильтра один и тот
// же, пилюля `ELK / filter-table`. Свойства коробки (`Type` со значениями
// Filter White/Grey/Subtitle) реализует компонент `Chips`, и дублировать их
// здесь больше нельзя.
interface FilterShellProps {
  label: React.ReactNode
  /**
   * Вид элемента вызова: `select` — с шевроном (умолчание всех видов окна),
   * `text` — подпись без значка, `counter` — с плашкой счётчика. Крестик
   * сброса у выбранного фильтра — при любом виде.
   */
  type?: FilterType
  /** Текст, который показывается вместо подписи, когда фильтр применён. */
  valueLabel?: React.ReactNode
  count?: number
  disabled?: boolean
  active?: boolean
  onClear?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Ширина всплывающего окна в пикселях — 384 для большинства видов, 560 для даты. */
  width?: number
  /**
   * Короткая подпись выбранного фильтра — показывается, если `valueLabel` не
   * помещается в чип (FilterRange: сумма без названия).
   */
  valueLabelShort?: React.ReactNode
  /** Тело мобильной шторы. Без него в шторе рисуются `children`. */
  sheetBody?: React.ReactNode
  /** Кнопки подвала мобильной шторы — во всю ширину, см. `FilterSheetButtons`. */
  sheetFooter?: React.ReactNode
  /** Что получает фокус при открытии поповера (строка одиночного выбора). */
  initialFocus?: React.RefObject<HTMLElement | null>
  children?: React.ReactNode
  className?: string
}

function FilterShell({
  label,
  type = "select",
  valueLabel,
  count,
  disabled = false,
  active = false,
  onClear,
  open,
  onOpenChange,
  width = 384,
  valueLabelShort,
  sheetBody,
  sheetFooter,
  initialFocus,
  children,
  className,
}: FilterShellProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  // Поповер уходит порталом за `ViewportScope` — форму ему передаёт атрибут.
  const viewport = useViewportAttr()

  // Отключённый фильтр закрывается по-настоящему, а не только глушится
  // через `open={false}`: иначе внутреннее `open` владельца оставалось
  // истинным, и после включения окно открывалось само, без нажатия.
  React.useEffect(() => {
    if (disabled && open) onOpenChange(false)
  }, [disabled, open, onOpenChange])

  function renderTriggerAction() {
    if (active && onClear) {
      return (
        <button
          type="button"
          aria-label="Сбросить фильтр"
          disabled={disabled}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            onClear()
          }}
          // Правки UI-Kit от 25.10: зона нажатия — не меньше 32×32 (на всю
          // высоту чипа), а значок по-прежнему 16. Зону даёт прозрачный
          // `::before` с выносом 8 во все стороны; вид кнопки не меняется.
          className="relative text-current outline-none before:absolute before:-inset-2 focus-visible:focus-ring"
        >
          <X aria-hidden="true" className={ICON_SIZE} />
        </button>
      )
    }
    if (type !== "select") return null
    // Правки UI-Kit от 25.10, «Шеврон открытия — поворот, а не смена значка»:
    // один и тот же значок поворачивается на 180° за 200 мс (ease-out), а не
    // подменяется значком «вверх» — подмена читалась как вспышка.
    return (
      <ChevronDown
        aria-hidden="true"
        data-slot="filter-chevron"
        className={cn(
          ICON_SIZE,
          "shrink-0 text-current transition-[rotate] duration-200 ease-out motion-reduce:transition-none",
          open && "rotate-180"
        )}
      />
    )
  }

  const shownOpen = disabled ? false : open
  const fitLabel =
    active && valueLabel !== undefined && valueLabelShort !== undefined

  const triggerElement = (
    <div
      ref={anchorRef}
      data-slot="filter"
      data-type={type}
      data-checked={active || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/filter w-fit min-w-20 cursor-pointer outline-none select-none not-data-popup-open:focus-visible:focus-ring data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
        filterTablePillClass({ selected: active, disabled }),
        className
      )}
    />
  )

  const triggerContent = (
    <span className="relative flex w-full min-w-0 items-center gap-2">
      {fitLabel ? (
        <FitLabel full={valueLabel} short={valueLabelShort} />
      ) : (
        <span
          data-slot="filter-label"
          className={cn("min-w-0 truncate", !active && "flex-1 text-center")}
        >
          {active && valueLabel !== undefined ? valueLabel : label}
        </span>
      )}
      {count !== undefined && (
        <Badge
          type="counter"
          value={count}
          color="dark-grey"
          disabled={disabled}
        />
      )}
      <span className="ml-auto flex shrink-0 items-center empty:hidden">
        {renderTriggerAction()}
      </span>
    </span>
  )

  // Обёртка — флекс-контейнер с `max-w-full`, как у `FilterTableSelect`:
  // в блочном `w-fit` минимальная ширина пилюли — вся её подпись без
  // переноса, и колонка уже 256 выпускала чип за край. Флекс даёт пилюле
  // сжаться до колонки, а подписи — обрезаться многоточием (ревью 10.10,
  // п. 10: правка была только в одном из двух триггеров).
  if (!isDesktop) {
    return (
      <div className="flex w-fit max-w-full min-w-0">
        <Modal open={shownOpen} onOpenChange={onOpenChange}>
          <ModalTrigger
            disabled={disabled}
            nativeButton={false}
            render={triggerElement}
          >
            {triggerContent}
          </ModalTrigger>
          <ModalContent size="m" data-slot="filter-sheet">
            <ModalHeader>
              <ModalTitle>{label}</ModalTitle>
            </ModalHeader>
            {/* Поля тела задают сами виды фильтра: строкам выбора нужны
                отступы 16 на всю ширину шторы, полям — свои. */}
            <ModalBody className="p-0">{sheetBody ?? children}</ModalBody>
            {sheetFooter !== undefined && (
              <ModalFooter>{sheetFooter}</ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </div>
    )
  }

  return (
    <div className="flex w-fit max-w-full min-w-0">
      <PopoverPrimitive.Root open={shownOpen} onOpenChange={onOpenChange}>
        <PopoverPrimitive.Trigger
          disabled={disabled}
          nativeButton={false}
          render={triggerElement}
        >
          {triggerContent}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side="bottom"
            align="start"
            sideOffset={8}
            collisionAvoidance={POPUP_COLLISION}
            className="z-50"
          >
            <PopoverPrimitive.Popup
              data-slot="filter-content"
              data-viewport={viewport}
              initialFocus={initialFocus}
              // Аудит 13: в низком окне (400px) окно выше доступного места
              // уходило вниз, и «Применить» было не достать — позиционер
              // двигает окно вслед за прокруткой. Высота ограничена местом
              // до края окна; сжимается и прокручивается средняя часть
              // (список FilterSelect, календарь FilterDate), а поиск, поля и
              // подвал с кнопками остаются целиком.
              render={<Dropdown className="flex flex-col overflow-hidden" />}
              // Ширина из макета — не больше видимой области минус поля по
              // 16px: на узком экране окно 384 (а у FilterDate 560) выходило
              // за правый край и давало горизонтальную прокрутку страницы.
              style={{ width, maxWidth: "calc(100vw - 32px)" }}
            >
              {children}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
}

/** «Если выбранно несколько значений, то пишем количество в кнопке –
 * «Применить: 1»» — одна общая подпись, чтобы все виды фильтра
 * формулировали её одинаково. С Правок UI-Kit от 25.10 у FilterRange в
 * поповере — просто «Применить»; в мобильной шторе счётчик есть у всех. */
function filterApplyLabel(count: number) {
  return count > 0 ? `Применить: ${count}` : "Применить"
}

export { FilterShell, filterApplyLabel }
export type { FilterShellProps, FilterType }
