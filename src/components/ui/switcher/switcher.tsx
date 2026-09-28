import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon, type IconName } from "@/components/ui/icon"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { OverflowItemText } from "@/components/ui/button-menu/overflow-item-text"
import { Dropdown } from "@/components/ui/dropdown"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { useActiveIndicator } from "@/lib/use-active-indicator"

// Switcher — «Cell Switcher / Переключатель»: сегментированный контрол
// (контейнер-таблетка плюс скользящая активная таблетка), в
// противоположность Tabs с их подчёркиванием. Разделение по применению то
// же, что у Tabs: Large для переключателя первого уровня, Medium для
// второго. В матрице «Elements» макета эти два размера дополнительно
// подписаны «Desktop» и «Mobile» (верхняя матрица на той же странице
// по-прежнему говорит Large/Medium, поэтому это читается как добавленная
// подпись контекста применения, а не переименование пропса).
// `greyBackground` — это собственное свойство макета «Grey Background»:
// Grey Solid (true, активный сегмент становится белым) против White Solid
// (false, белому контейнеру нужны рамка и серый активный сегмент для
// контраста). `activeVariant="black"` — отдельный вариант «Active Black»
// (тёмная активная таблетка, независимо от фона контейнера).
//
// Перекрытие ведёт себя ровно как у Tabs (то же свойство «Show More», тот
// же макет выпадающего списка скрытых пунктов) — почему триггер здесь
// оформлен вручную, а не переиспользует триггер ButtonMenuOverflow
// целиком, см. в комментарии tabs.tsx.
interface SwitcherItem {
  value: string
  label: React.ReactNode
  badge?: number
  /**
   * `Type=Text Status` компонент-сета `Content Switcher (ELK)` — точка
   * статуса после подписи.
   */
  status?: boolean
  /** `Type=Icon` того же сета — иконка перед подписью. */
  icon?: IconName | React.ReactNode
  disabled?: boolean
}

interface SwitcherProps {
  items: SwitcherItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: "lg" | "md"
  greyBackground?: boolean
  activeVariant?: "surface" | "black"
  disabled?: boolean
  /**
   * Не поместившиеся сегменты уходят в «…».
   *
   * ⚠️ Ряд меряется по ширине самого переключателя. Корень — `inline-flex`,
   * то есть по умолчанию ужимается по содержимому: свернувшись, он сужается
   * до видимых сегментов и больше не разворачивается, сколько бы места ни
   * появилось у родителя. Если переключатель должен разворачиваться обратно,
   * дайте ему ширину снаружи — `className="flex w-full"` или `flex-1`, как в
   * витринах. Попытки мерить «место у родителя» ломали обычную вёрстку
   * (обрезаемый заголовок рядом, перенос строк) и были откачены.
   */
  showMore?: boolean
  className?: string
}

const GAP_PX = { lg: 4, md: 4 }
const GAP_CLASS = { lg: "gap-1", md: "gap-1" }
const SEGMENT_PADDING = { lg: "px-8 py-3 text-p1-medium", md: "px-6 py-2.5 text-p2-medium" }
// Место под «…» — зазор ряда перед кнопкой + сама кнопка: `p-3` (12 × 2)
// вокруг значка 24 (lg) или 16 (md). Было 56 и 40: у md резерв был меньше
// кнопки на 4px, и ряд с шириной снаружи вылезал за рамку.
const ELLIPSIS_RESERVED = { lg: 4 + 12 * 2 + 24, md: 4 + 12 * 2 + 16 }
const ELLIPSIS_ICON_SIZE = { lg: "size-6", md: "size-4" }

function SegmentButton({
  item,
  active,
  greyBackground,
  activeVariant,
  onClick,
  innerRef,
  className,
  /**
   * Заливку активного сегмента рисует общий бегунок (см. `Switcher` ниже) —
   * ему и ехать. Измерительной копии бегунок не нужен, там флаг выключен и
   * заливка остаётся на самом сегменте.
   */
  sharedFill = false,
  measure = false,
}: {
  item: SwitcherItem
  active: boolean
  /** Закадровая копия для замера: состояние выбора ей объявлять незачем. */
  measure?: boolean
  greyBackground: boolean
  activeVariant: "surface" | "black"
  onClick?: () => void
  innerRef?: (el: HTMLButtonElement | null) => void
  className: string
  sharedFill?: boolean
}) {
  const activeFg =
    activeVariant === "black"
      ? "data-active:text-[var(--switcher-active-black-fg)]"
      : "data-active:text-[var(--switcher-fg)]"
  const activeBg = sharedFill
    ? activeFg
    : cn(
        activeVariant === "black"
          ? "data-active:bg-[var(--switcher-active-black-bg)]"
          : greyBackground
            ? "data-active:bg-[var(--switcher-active-bg)]"
            : "data-active:bg-[var(--switcher-active-bg-on-white)]",
        activeFg
      )

  return (
    <button
      ref={innerRef}
      type="button"
      disabled={item.disabled}
      onClick={onClick}
      data-slot="switcher-item"
      data-value={item.value}
      data-active={active || undefined}
      // Выбранный сегмент объявляется как нажатая кнопка: раньше он был
      // отмечен только `data-active`, и скринридер не мог сказать, какой
      // вариант выбран. `aria-pressed`, а не радиогруппа: у сегментов
      // остаются привычные для кнопок Tab, Enter и Space.
      aria-pressed={measure ? undefined : active}
      className={cn(
        // Насыщенность живёт в text-pN-medium внутри SEGMENT_PADDING (она
        // приходит ниже через `className`), а не здесь: размер и
        // насыщенность идут вместе одним именованным стилем макета на
        // каждый размер.
        // `relative` — чтобы подпись лежала ПОВЕРХ бегунка: тот
        // абсолютный и в потоке идёт после сегментов.
        "relative flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[16px] whitespace-nowrap text-[var(--switcher-fg-inactive)] outline-none focus-visible:focus-ring transition-colors not-data-active:hover:bg-[var(--switcher-hover-bg)] not-data-active:hover:text-[var(--switcher-fg)] disabled:cursor-not-allowed disabled:text-[var(--switcher-disabled-fg)] disabled:hover:bg-transparent disabled:hover:text-[var(--switcher-disabled-fg)]",
        activeBg,
        className
      )}
    >
      {typeof item.icon === "string" ? (
        <Icon name={item.icon} aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        item.icon
      )}
      {item.label}
      {item.badge !== undefined && (
        <Badge type="counter" value={item.badge} color="light-grey" disabled={item.disabled} />
      )}
      {item.status && <Badge type="point" color="red" disabled={item.disabled} />}
    </button>
  )
}

function Switcher({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "lg",
  greyBackground = true,
  activeVariant = "surface",
  disabled = false,
  showMore = true,
  className,
}: SwitcherProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  // Неуправляемое значение, которого нет среди `items` (пункты пришли
  // асинхронно после пустого массива или набор заменили), откатывается на
  // первый доступный пункт — как у Tabs. Раньше умолчание считалось один
  // раз при монтировании, и выбранного сегмента не было вовсе.
  const fallbackValue = (items.find((item) => !item.disabled) ?? items[0])?.value
  const activeValue =
    value ??
    (items.some((item) => item.value === internalValue) ? internalValue : fallbackValue)

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  // `disabled` на всём переключателе (по собственному примеру «Disabled» в
  // макете, где разом гаснут все сегменты) накладывается поверх
  // собственного `disabled` каждого пункта, а не заменяет его.
  const resolvedItems = React.useMemo(
    () => (disabled ? items.map((item) => ({ ...item, disabled: true })) : items),
    [disabled, items]
  )

  // Внутренние отступы корня (`p-1`, или свои из `className`) — не место под
  // сегменты. Их вычитает сам `useOverflowCount` (для всех рядов, см. хук);
  // раньше Switcher передавал их `occupiedWidth`-ом, и после переноса в хук
  // они считались бы дважды.
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    resolvedItems.length,
    ELLIPSIS_RESERVED[size],
    // Зазор обязателен третьим аргументом — без него хук складывает только
    // ширины сегментов и считает переполненный ряд помещающимся (та же
    // ошибка, что нашлась в табах по дизайн-чеку 3/3 №12).
    GAP_PX[size]
  )

  const effectiveVisible = showMore ? visibleCount : resolvedItems.length
  const visibleItems = resolvedItems.slice(0, effectiveVisible)
  const hiddenItems = resolvedItems.slice(effectiveVisible)
  const hasOverflow = hiddenItems.length > 0
  const activeHidden = hiddenItems.some((item) => item.value === activeValue)

  const indicator = useActiveIndicator<HTMLDivElement>(activeValue, [
    effectiveVisible,
    size,
    hasOverflow,
    resolvedItems,
  ])

  // Дизайн-чек от 08.09, замечание 21: «В свитчере ездит заливка». Цвет
  // бегунка — ровно те же три варианта, что раньше стояли на самом сегменте.
  const indicatorBg =
    activeVariant === "black"
      ? "bg-[var(--switcher-active-black-bg)]"
      : greyBackground
        ? "bg-[var(--switcher-active-bg)]"
        : "bg-[var(--switcher-active-bg-on-white)]"
  // Цвет подписи активного сегмента: на заливке бегунка серое многоточие
  // «…» (активный сегмент спрятан) почти не читалось, особенно на чёрной.
  const indicatorFg =
    activeVariant === "black"
      ? "text-[var(--switcher-active-black-fg)]"
      : "text-[var(--switcher-fg)]"

  return (
    <div
      ref={containerRef}
      data-slot="switcher"
      className={cn(
        "relative inline-flex items-center rounded-[20px] border border-[var(--switcher-border)] p-1",
        greyBackground
          ? "bg-[var(--switcher-grey-bg)]"
          : "bg-[var(--switcher-white-bg)]",
        GAP_CLASS[size],
        className
      )}
    >
      <div
        ref={indicator.rowRef}
        data-slot="switcher-row"
        className={cn("relative flex items-center", GAP_CLASS[size])}
      >
        {/* Бегунок стоит ПЕРВЫМ, до сегментов: он без `z-index`, а подписи с
            `relative` — значит в порядке отрисовки они и так окажутся выше.
            Обратный порядок потребовал бы слоя у каждой подписи. */}
        <span
          aria-hidden="true"
          data-slot="switcher-indicator"
          className={cn(
            "pointer-events-none absolute inset-y-0 rounded-[16px]",
            indicatorBg,
            indicator.ready && "transition-[left,width] duration-200 ease-out",
            !indicator.visible && "opacity-0"
          )}
          style={{ left: indicator.left, width: indicator.width }}
        />

        {visibleItems.map((item) => (
          <SegmentButton
            key={item.value}
            item={item}
            active={item.value === activeValue}
            greyBackground={greyBackground}
            activeVariant={activeVariant}
            sharedFill
            onClick={() => !item.disabled && setValue(item.value)}
            className={SEGMENT_PADDING[size]}
          />
        ))}
      </div>

      {hasOverflow && (
        <MenuPrimitive.Root modal={false}>
          <MenuPrimitive.Trigger
            // Выключенный переключатель гасит и «Ещё»: раньше видимые
            // сегменты гасли, а многоточие оставалось живым — подсвечивалось,
            // открывало список из одних выключенных пунктов и при спрятанном
            // активном горело заливкой бегунка.
            disabled={disabled}
            render={
              <button
                type="button"
                aria-label="Ещё"
                data-slot="switcher-overflow-trigger"
                data-active={(activeHidden && !disabled) || undefined}
                // Активный сегмент ушёл в «Ещё» — бегунок в ряду погас, и
                // заливка переезжает на многоточие: иначе в ряду не было бы
                // видно, что выбрано вообще что-то.
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-[16px] p-3 text-[var(--switcher-fg-inactive)] outline-none focus-visible:focus-ring transition-colors",
                  disabled
                    ? "cursor-not-allowed text-[var(--switcher-disabled-fg)]"
                    : activeHidden
                      ? cn("cursor-pointer", indicatorBg, indicatorFg)
                      : "cursor-pointer hover:bg-[var(--switcher-hover-bg)]"
                )}
              />
            }
          >
            <Ellipsis aria-hidden="true" className={ELLIPSIS_ICON_SIZE[size]} />
          </MenuPrimitive.Trigger>
          <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
              side="bottom"
              align="start"
              sideOffset={8}
              className="isolate z-50"
            >
              <MenuPrimitive.Popup
                data-slot="switcher-overflow-content"
                render={<Dropdown className="min-w-48 overflow-hidden" />}
              >
                {hiddenItems.map((item) => {
                  const active = item.value === activeValue
                  return (
                    <ButtonMenuOverflowItem
                      key={item.value}
                      aria-current={active ? "true" : undefined}
                      text={
                        <OverflowItemText
                          label={item.label}
                          badge={item.badge}
                          status={item.status}
                          active={active}
                          disabled={item.disabled}
                          // Счётчик — как у сегмента в ряду: светло-серый,
                          // выключен только у выключенного пункта.
                          badgeColor="light-grey"
                          badgeDisabled={Boolean(item.disabled)}
                        />
                      }
                      disabled={item.disabled}
                      onClick={() => !item.disabled && setValue(item.value)}
                    />
                  )
                })}
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        </MenuPrimitive.Root>
      )}

      {/* Закадровая копия для замеров — см. комментарий в tabs.tsx, здесь
          рассуждение то же: пункты, спрятанные за триггером перекрытия,
          иначе сообщили бы нулевую ширину при следующем пересчёте. Слой с
          обрезкой обязателен: копия шире переключателя, когда часть пунктов
          ушла в «Ещё», и без обрезки раздвигала бы прокрутку страницы. */}
      <OverflowMeasureLayer style={{ gap: GAP_PX[size] }}>
        {resolvedItems.map((item, index) => (
          <SegmentButton
            key={item.value}
            item={item}
            active={item.value === activeValue}
            greyBackground={greyBackground}
            activeVariant={activeVariant}
            className={SEGMENT_PADDING[size]}
            measure
            innerRef={(el) => {
              itemRefs.current[index] = el
            }}
          />
        ))}
      </OverflowMeasureLayer>
    </div>
  )
}

export { Switcher }
export type { SwitcherProps, SwitcherItem }
