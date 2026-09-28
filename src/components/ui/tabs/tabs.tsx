import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { OverflowItemText } from "@/components/ui/button-menu/overflow-item-text"
import { Dropdown } from "@/components/ui/dropdown"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { useActiveIndicator } from "@/lib/use-active-indicator"

import { TabButton } from "./tab-button"
import type { TabItem, TabsSize } from "./types"

// Tabs — «Табы»: полоса вкладок с подчёркиванием. Значение — буквальное
// количество пунктов (2–12), но это ограничение содержания, а не то, что
// компонент проверяет: он рисует столько `items`, сколько ему дали.
//
// В `ELK / tabs` v1.2.0 прежнее свойство *уровня* Large/Medium заменено на
// адаптивную пару Size=Desktop/Mobile, поэтому полоса теперь переключается
// по вьюпорту, а не по пропсу: высота 44px с зазором 32px, подписи 16/24 и
// глиф перекрытия 24px от `desktop:` и выше; ниже — 40px, 24px, 14/20 и
// 16px. (У двух прежних размеров как раз и стояли эти два набора чисел.)
//
// Перекрытие («Show More»): как только ряд перестаёт помещаться, хвостовые
// вкладки уходят за триггер «...», открывающий выпадающий список (в макете:
// «часть табов может скрываться в многоточие. При клике на иконку
// многоточия открывается Dropdown»). Для строк списка переиспользуется
// ButtonMenuOverflowItem — тот самый компонент `button-menu/overflow.tsx`,
// уже сделанный ровно под такое всплывающее окно «Text / Text», — а вот сам
// триггер здесь оформлен по-своему: анатомия Tabs требует обычного
// строчного многоточия, а не обведённой серой кнопки ButtonMenu.
interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * `Size` компонент-сета — см. `TabsSize`. Умолчание `auto`: размер следует
   * за вьюпортом. `medium` нужен там, где лента разделов «мобильного»
   * размера стоит на десктопе, — внутри `Table Top`.
   */
  size?: TabsSize
  /**
   * `Show More` компонент-сета — показывать таб «…».
   *
   * Дизайн-чек 3/3 №12: раньше этот проп означал «схлопывать ли лишние
   * вкладки», поэтому в широком Playground, где ничего не переполнялось,
   * переключатель не давал никакого видимого эффекта. Теперь он делает ровно
   * то, что называется: принудительно показывает таб «Ещё». Схлопывание же
   * происходит всегда, когда ряд не помещается, — иначе выключённый
   * `showMore` прятал бы вкладки без способа до них добраться.
   */
  showMore?: boolean
  className?: string
}

// Зазор и место, зарезервированное под триггер «…», участвуют в замере
// перекрытия на JS, поэтому их нельзя оставить чисто в CSS, как размеры
// шрифта ниже.
//
// ⚠️ Резерв — это зазор ПЕРЕД триггером плюс сам глиф (24 на десктопе, 16 на
// мобиле; подчёркивание триггера — `w-full`, шире глифа оно не бывает). Цикл
// в `useOverflowCount` кладёт зазоры только МЕЖДУ пунктами, так что зазор до
// «…» обязан сидеть в резерве. Прежние 44/32 его недосчитывали на 12/8px, и
// ряд, признанный помещающимся, вылезал за контейнер ровно на эту разницу.
const GAP = { desktop: 32, mobile: 24 }
const ELLIPSIS_GLYPH = { desktop: 24, mobile: 16 }
const ELLIPSIS_RESERVED = {
  desktop: GAP.desktop + ELLIPSIS_GLYPH.desktop,
  mobile: GAP.mobile + ELLIPSIS_GLYPH.mobile,
}

function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "auto",
  showMore = true,
  className,
}: TabsProps) {
  const isDesktop = useIsDesktop()
  // `medium` держит «мобильные» числа и на десктопе, поэтому ключ размера
  // считается ДО вьюпорта, а не после: иначе десктопная ветка перебивала бы
  // закреплённый размер и в замере переполнения, и в CSS.
  const medium = size === "medium"
  const sizeKey = isDesktop && !medium ? "desktop" : "mobile"
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  // Неуправляемое значение, которого нет среди `items` (пункты пришли
  // асинхронно после пустого массива или активный пункт удалили), не
  // застывает, а откатывается на первую доступную вкладку. Раньше умолчание
  // считалось один раз при монтировании, и при `items=[]` на старте активной
  // вкладки не было никогда.
  const fallbackValue = (items.find((item) => !item.disabled) ?? items[0])?.value
  const activeValue =
    value ??
    (items.some((item) => item.value === internalValue) ? internalValue : fallbackValue)

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    items.length,
    ELLIPSIS_RESERVED[sizeKey],
    // Дизайн-чек 3/3 №12: третий аргумент — зазор — не передавался, и хук
    // складывал только ширины самих вкладок. На пяти табах это 4×32 = 128px
    // неучтённого зазора: ряд, который в реальности не помещался, считался
    // помещающимся, и таб «Ещё» не появлялся вообще никогда.
    GAP[sizeKey],
    // При `showMore` триггер виден и тогда, когда прятать нечего, поэтому его
    // место резервируется всегда, а не только при переполнении.
    showMore
  )

  // Схлопываем всегда, когда ряд не помещается; `showMore` лишь добавляет
  // таб «Ещё» даже тогда, когда прятать нечего (дизайн-чек 3/3 №12).
  const visibleItems = items.slice(0, visibleCount)
  const hiddenItems = items.slice(visibleCount)
  const hasOverflow = hiddenItems.length > 0
  const [menuOpen, setMenuOpen] = React.useState(false)
  // Прятать стало нечего — меню закрыто и после нового переполнения само
  // не откроется.
  if (!hasOverflow && menuOpen) setMenuOpen(false)
  const activeHidden = hiddenItems.some((item) => item.value === activeValue)
  const showOverflowTab = hasOverflow || showMore

  // В порядок Tab попадает активная вкладка, а если она спрятана за
  // многоточием или выключена — первая доступная видимая. Выбор только среди
  // доступных: выключенная кнопка фокус не принимает, и `tabIndex=0` на ней
  // при `-1` у всех остальных вычёркивал бы ленту из обхода по Tab целиком.
  const enabledVisible = visibleItems.filter((item) => !item.disabled)
  const focusValue = enabledVisible.some((item) => item.value === activeValue)
    ? activeValue
    : enabledVisible[0]?.value

  // Стрелки, Home и End — по видимым доступным вкладкам, с активацией при
  // переходе (паттерн WAI-ARIA Tabs с автоматической активацией).
  function onRowKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // Только нажатия на самих вкладках. События React всплывают по дереву
    // компонентов, а не по DOM, поэтому без проверки сюда доходили бы
    // стрелки из любого портала, отрисованного внутри ленты.
    const source = event.target as HTMLElement
    if (!event.currentTarget.contains(source) || source.getAttribute("role") !== "tab") return
    // Отсчёт — от вкладки, на которой стоит фокус, а не от активной: они
    // расходятся, когда активная выключена или спрятана за многоточием.
    const current = enabledVisible.findIndex((item) => item.value === source.dataset.value)
    const count = enabledVisible.length
    let next: number
    if (event.key === "ArrowRight") next = current < 0 ? 0 : (current + 1) % count
    else if (event.key === "ArrowLeft") next = current < 0 ? count - 1 : (current - 1 + count) % count
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = count - 1
    else return
    const target = enabledVisible[next]
    if (!target) return
    event.preventDefault()
    setValue(target.value)
    const tabs = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')
    Array.from(tabs)
      .find((el) => el.dataset.value === target.value)
      ?.focus()
  }

  const indicator = useActiveIndicator<HTMLDivElement>(activeValue, [
    visibleCount,
    sizeKey,
    showOverflowTab,
    items,
  ])

  return (
    <div
      ref={containerRef}
      data-slot="tabs"
      className={cn(
        // ⚠️ Разделитель — ВНУТРЕННЯЯ тень, а не `border-bottom`. Разделитель
        // 1px и линия активного таба 4px лежат в макете на одном месте: в
        // Figma stroke фрейма не занимает layout, а `border` при
        // `box-sizing: border-box` добавляет свой пиксель сверху. Замер до
        // правки: обёртка 45 при табе 44 — то есть весь ряд разъезжался с
        // соседними блоками на пиксель, и всё, что центрируется, вставало на
        // полпикселя выше. Та же грабля, что с линией под шапкой таблицы.
        //
        // Дизайн-чек от 08.09, замечание 16: «Разделитель снизу вкладок не
        // должен уходить дальше самих вкладок… Действует для Desktop, на
        // мобилах свои правила, там не править». Поэтому на десктопе тень
        // снимается с внешней коробки (она тянется на всю ширину блока —
        // ей нужна ширина для замера переполнения) и переносится на
        // внутренний ряд, который по ширине равен ряду вкладок.
        "relative flex items-center shadow-[inset_0_-1px_0_0_var(--tabs-border)] desktop:shadow-none",
        // У `medium` десктопной ветки нет: разделитель всегда на внутреннем
        // ряду, иначе он тянулся бы во всю ширину блока.
        medium && "shadow-none",
        className
      )}
    >
      <div
        data-slot="tabs-row"
        className={cn(
          "relative flex items-center desktop:shadow-[inset_0_-1px_0_0_var(--tabs-border)]",
          medium && "shadow-[inset_0_-1px_0_0_var(--tabs-border)]"
        )}
      >
        {/* `tablist` держит только вкладки (и бегунок под `aria-hidden`):
            триггер «Ещё» — не вкладка, и внутри `tablist` он нарушал
            обязательный состав детей роли. Поэтому он стоит рядом, а общий ряд
            с разделителем и зазором — снаружи обоих. Заодно события из
            выпадающего списка «Ещё» больше не всплывают в обработчик стрелок
            ленты. */}
        <div
          ref={indicator.rowRef}
          role="tablist"
          onKeyDown={onRowKeyDown}
          data-slot="tabs-list"
          className="relative flex items-center"
          style={{ gap: GAP[sizeKey] }}
        >
          {visibleItems.map((item) => (
            <TabButton
              key={item.value}
              item={item}
              active={item.value === activeValue}
              medium={medium}
              sharedUnderline
              focusable={item.value === focusValue}
              onClick={() => !item.disabled && setValue(item.value)}
            />
          ))}

          {/* Бегунок — общее подчёркивание активной вкладки (замечание 21).
              Живёт в ряду один и переезжает, а не перекрашивается: за это
              отвечает переход по `left`/`width`. Пока активная вкладка спрятана
              за многоточием, показывать нечего. */}
          <span
            aria-hidden="true"
            data-slot="tabs-indicator"
            className={cn(
              "pointer-events-none absolute bottom-0 h-1 rounded-t-[4px] bg-[var(--tabs-underline-active)]",
              indicator.ready && "transition-[left,width] duration-200 ease-out",
              !indicator.visible && "opacity-0"
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>

        {/* Зазор до «…» — отступом самого триггера, а не `gap` ряда: при
            `items=[]` пустой `tablist` всё равно flex-элемент, и `gap`
            отодвигал многоточие от начала ряда на пустом месте. */}
        {showOverflowTab && (
        <MenuPrimitive.Root
          modal={false}
          // Открытость — своя: триггер при `showMore` не размонтируется,
          // когда прятать стало нечего (ряд расширился), и открытое меню
          // оставалось висеть пустым попапом под выключенной кнопкой.
          open={menuOpen && hasOverflow}
          onOpenChange={setMenuOpen}
        >
          <MenuPrimitive.Trigger
            render={
              <button
                type="button"
                aria-label="Ещё"
                data-slot="tabs-overflow-trigger"
                data-active={activeHidden || undefined}
                // Таб виден по `showMore`, но открывать пустой Dropdown
                // незачем — пока за многоточием ничего не спрятано, он
                // просто не раскрывается.
                disabled={!hasOverflow}
                style={visibleItems.length > 0 ? { marginLeft: GAP[sizeKey] } : undefined}
                // Мобильный глиф 16px стоит против строки подписи 20px,
                // поэтому в макете ему дают отступ 2px и расширяют зазор до
                // 18px, чтобы триггер сохранил полные 40px, — иначе его
                // подчёркивание всплывает над нижней рамкой полосы.
                className={cn(
                  "group flex shrink-0 flex-col items-center gap-[18px] pt-0.5 text-[var(--tabs-fg)] outline-none focus-visible:focus-ring",
                  // Прятать нечего — кнопка выключена: ни руки, ни подсветки
                  // подчёркивания при наведении.
                  hasOverflow ? "cursor-pointer" : "cursor-default",
                  // Варианты `desktop:` при закреплённом размере не
                  // подмешиваются вовсе: медиазапрос перебил бы флаг, а не
                  // наоборот — `twMerge` разные префиксы не схлопывает.
                  !medium && "desktop:gap-4 desktop:pt-0",
                  // Спрятанная активная вкладка: многоточие берёт цвет её
                  // подписи, а не остаётся серым под тёмным подчёркиванием.
                  activeHidden && "text-[var(--tabs-fg-active)]"
                )}
              />
            }
          >
            <Ellipsis
              size={sizeKey === "desktop" ? 24 : 16}
              aria-hidden="true"
              className={cn("size-4", !medium && "desktop:size-6")}
            />
            {/* Активная вкладка ушла в «Ещё» — бегунок в ряду погас, и её
                подчёркивание переезжает на многоточие: иначе в ленте не
                было бы видно, что выбрано вообще что-то. */}
            <span
              aria-hidden="true"
              className={cn(
                "h-1 w-full shrink-0 rounded-t-[4px] transition-colors",
                activeHidden
                  ? "bg-[var(--tabs-underline-active)]"
                  : hasOverflow
                    ? "bg-transparent group-hover:bg-[var(--tabs-underline-hover)]"
                    : "bg-transparent"
              )}
            />
          </MenuPrimitive.Trigger>
          <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner
              side="bottom"
              align="start"
              sideOffset={8}
              className="isolate z-50"
            >
              <MenuPrimitive.Popup
                data-slot="tabs-overflow-content"
                render={<Dropdown className="themed-scrollbar min-w-48 max-h-(--available-height) overflow-x-hidden overflow-y-auto" />}
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
      </div>

      {/* Закадровая копия для замеров: она всегда рисует все пункты (в
          отличие от видимого ряда, который прячет часть за триггер
          перекрытия), чтобы useOverflowCount всегда имел настоящую ширину
          для замера — даже у пунктов, сейчас убранных в выпадающий
          список. Обёртка с обрезкой обязательна: копия шире ряда и без неё
          раздвигала бы прокрутку страницы вбок (см. `OverflowMeasureLayer`). */}
      <OverflowMeasureLayer style={{ gap: GAP[sizeKey] }}>
        {items.map((item, index) => (
          <TabButton
            key={item.value}
            item={item}
            active={item.value === activeValue}
            medium={medium}
            innerRef={(el) => {
              itemRefs.current[index] = el
            }}
          />
        ))}
      </OverflowMeasureLayer>
    </div>
  )
}

export { Tabs }
export type { TabsProps, TabItem, TabsSize }
