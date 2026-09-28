import * as React from "react"

import { cn } from "@/lib/utils"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { useComposedRefs } from "@/lib/compose-refs"
import { OverflowMeasureLayer } from "@/lib/overflow-measure"
import { Button } from "@/components/ui/button"

import { flattenChildren } from "@/lib/flatten-children"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

// Ряд команд, который НЕ ПЕРЕНОСИТСЯ: не поместившиеся кнопки уходят в меню
// «ещё» одной кнопкой в конце ряда.
//
// Вынесен из `ButtonMenu` отдельным компонентом по дизайн-чеку от 08.09,
// замечание 3: «По сути здесь нужно переиспользовать фронтово механизм,
// который лежит в Button Menu. Там уже в одну строку и уже реализовали уход
// команд в многоточие, если они не поместились. Оптимизируй код с этой точки
// зрения». До этого механизм жил внутри нижней панели, и любой другой ряд
// команд (например группа действий в карточке «О карте») верстался
// `flex-wrap` — то есть переносился, чего продукт не допускает.
//
// Размеров ряда два и оба из кита, а не выдуманы: нижняя панель собрана из
// `ELK / button` 56px и `ELK / selection button` 56×56,
// ряд внутри карточки — из тех же кнопок размера S (32).

type ButtonRowSize = "lg" | "sm"

/** Зазор между кнопками ряда: 16 у панели, 8 у ряда в карточке. */
const ROW_GAP: Record<ButtonRowSize, number> = { lg: 16, sm: 8 }
const ROW_GAP_CLASS: Record<ButtonRowSize, string> = {
  lg: "gap-4",
  sm: "gap-2",
}
/** Место под «…»: квадратная кнопка того же размера. */
const OVERFLOW_WIDTH: Record<ButtonRowSize, number> = { lg: 56, sm: 32 }

type ButtonElement = React.ReactElement<{
  children?: React.ReactNode
  onClick?: React.MouseEventHandler
  disabled?: boolean
  size?: string
  "aria-label"?: string
}>

const isButton = (node: React.ReactNode): node is ButtonElement =>
  React.isValidElement(node) && node.type === Button

/**
 * ⚠️ Сравнение по ТИПУ, а не по маркеру, поэтому меню «ещё» нужно передавать
 * самим `ButtonMenuOverflow`, а не своей обёрткой над ним. Обёртка —
 * отдельный тип, ряд её не узнаёт, и получается сразу два дефекта: своё меню
 * уходит в «остальное» и улетает вправо (дизайн-чек от 08.09, замечание 8), а
 * рядом появляется второе, собранное рядом из спрятанных кнопок (замечание 9).
 * Ровно это и было в витринах Button Menu.
 */
const isOverflow = (
  node: React.ReactNode
): node is React.ReactElement<{ children?: React.ReactNode; size?: ButtonRowSize }> =>
  React.isValidElement(node) && node.type === ButtonMenuOverflow

interface ButtonMenuRowProps extends React.ComponentProps<"div"> {
  /** Размер кнопок ряда. Панель — `lg`, ряд в карточке — `sm`. */
  size?: ButtonRowSize
}

const ButtonMenuRow = React.forwardRef<HTMLDivElement, ButtonMenuRowProps>(function ButtonMenuRow({
  size = "lg",
  className,
  children,
  ...props
}, forwardedRef) {
  const nodes = flattenChildren(children)
  const buttons = nodes.filter(isButton)
  const supplied = nodes.find(isOverflow)
  // Всё прочее (кнопка в своей обёртке, произвольная разметка) раньше молча
  // не рисовалось вовсе. Теперь рисуется как есть после видимых кнопок и в
  // «…» не уходит: ряд не берётся угадывать, что это и как оно сжимается.
  // Но место оно занимает — его ширина (с зазором) вычитается из доступной,
  // иначе кнопки не уходили в «…», а ряд вылезал за край. Кнопки
  // передавайте самим `Button` — хоть во фрагменте, он раскрывается.
  const others = nodes.filter((node) => !isButton(node) && !isOverflow(node))
  const othersRef = React.useRef<HTMLDivElement>(null)
  const [othersWidth, setOthersWidth] = React.useState(0)
  const hasOthers = others.length > 0
  React.useLayoutEffect(() => {
    const element = othersRef.current
    if (!element) {
      setOthersWidth(0)
      return
    }
    const measure = () => setOthersWidth(element.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [hasOthers])

  const gap = ROW_GAP[size]
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    buttons.length,
    OVERFLOW_WIDTH[size] + gap,
    gap,
    // Переданное меню стоит в ряду ВСЕГДА, поэтому его место входит и в
    // проверку «помещается всё» — раньше резерв был нулевым, и кнопки,
    // помещавшиеся впритык, заезжали под переданное «…».
    //
    // Сверено вживую (шаг 2 заявки на кредит, 375px): с нулевым резервом
    // ряд шириной 294 держал «Далее» + «Сохранить» + «…» на 360, и «…»
    // вылезало за край карточки на 66px. Теперь «Сохранить» уходит в меню.
    Boolean(supplied),
    // Зазор — по наличию обёртки, а не по её ширине: ребёнок, который
    // отрисовал `null` (компонент прав без доступа), оставляет обёртку
    // нулевой ширины, но флекс-зазор перед ней всё равно есть.
    hasOthers ? othersWidth + gap : 0
  )

  // Размер кнопкам ряд задаёт САМ, что бы ни передал вызывающий: ряд обязан
  // быть одной высоты, а собственное умолчание кнопки — Medium, то есть не
  // тот размер ни для панели, ни для карточки.
  //
  // Ключ НЕ подменяется индексом: `Children.toArray` уже выдал каждой кнопке
  // ключ из её собственного `key`. С индексом кнопка, вставленная в начало,
  // сдвигала бы все остальные, и React сопоставлял бы DOM и фокус не с теми
  // кнопками.
  const sized = (child: ButtonElement) => React.cloneElement(child, { size })

  const visible = buttons.slice(0, visibleCount).map(sized)
  const hidden = buttons.slice(visibleCount)
  const ref = useComposedRefs(containerRef, forwardedRef)

  function pressMeasured(index: number) {
    itemRefs.current[index]
      ?.querySelector<HTMLElement>('button, a, [role="button"]')
      ?.click()
  }

  // Спрятанная кнопка становится строкой меню. Подпись — её содержимое, а у
  // кнопки только со значком — её `aria-label`: иначе строка меню была бы
  // пустой и безымянной.
  //
  // Действие — нажатие САМОЙ кнопки в закадровой копии ряда, а не вызов её
  // `onClick`. Копия всегда отрисована, лежит в той же форме и несёт все
  // пропсы кнопки, поэтому вместе с обработчиком сохраняются `type="submit"`
  // и `form` (форма отправляется), `render` (кнопка-ссылка переходит) —
  // раньше из всего этого в меню доезжал только `onClick`.
  const hiddenItems = hidden.map((child, index) => {
    const label = child.props["aria-label"]
    return (
      <ButtonMenuOverflowItem
        key={`overflow-${child.key ?? index}`}
        text={child.props.children ?? label}
        aria-label={label}
        disabled={child.props.disabled}
        onClick={() => pressMeasured(visibleCount + index)}
      />
    )
  })

  let overflow: React.ReactNode = null
  if (supplied) {
    // Переданное меню остаётся тем же инстансом (у него свои Direction и
    // Show Dropdown) — в него лишь дописываются спрятанные команды, причём
    // В НАЧАЛО: они стояли левее в ряду.
    //
    // ⚠️ `showDropdown={false}` (голый триггер без списка) при спрятанных
    // командах не соблюдается: иначе они пропадали бы вовсе — ни мышью, ни с
    // клавиатуры до них было бы не добраться. Пока всё помещается, флаг
    // работает как раньше.
    const props =
      hiddenItems.length > 0 ? { size, showDropdown: true } : { size }
    overflow = React.cloneElement(supplied, props, [
      ...hiddenItems,
      ...React.Children.toArray(supplied.props.children),
    ])
  } else if (hiddenItems.length > 0) {
    overflow = <ButtonMenuOverflow size={size}>{hiddenItems}</ButtonMenuOverflow>
  }

  return (
    <div
      ref={ref}
      data-slot="button-menu-row"
      className={cn(
        "relative flex min-w-0 flex-1 items-center",
        ROW_GAP_CLASS[size],
        className
      )}
      {...props}
    >
      {visible}
      {hasOthers && (
        <div
          ref={othersRef}
          data-slot="button-menu-row-others"
          className={cn("flex shrink-0 items-center", ROW_GAP_CLASS[size])}
        >
          {others}
        </div>
      )}
      {overflow}
      <MeasureRow buttons={buttons} itemRefs={itemRefs} size={size} />
    </div>
  )
})

/**
 * Копия кнопки для мерного ряда. `ref` и `id` потребителя ей не достаются:
 * копия монтируется позже видимой кнопки, и ref получал бы невидимый узел
 * (`focus()` в никуда), а `id` оказывался бы в DOM дважды — `<label for>` и
 * `getElementById` находили бы не ту кнопку. `form`, `type`, `render` и
 * обработчики остаются: пункт «Ещё» нажимает именно эту копию.
 */
function measureCopy(child: ButtonElement, size: ButtonRowSize) {
  return React.cloneElement(child, {
    size,
    id: undefined,
    ref: null,
  } as Partial<ButtonElement["props"]> & { id?: string; ref: null })
}

/**
 * Всегда отрисованная невидимая копия ряда — источник ширин для
 * `useOverflowCount`: спрятанная кнопка мерялась бы нулём и счёт больше
 * никогда не вырос бы обратно.
 *
 * ⚠️ Обёртка `inset-0 overflow-hidden` обязательна: копия шире ряда по
 * определению, и хотя она абсолютная, в ОБЛАСТЬ ПРОКРУТКИ документа она
 * входит — без обрезки ряд раздвигал бы страницу вбок (ровно этот дефект
 * чинился в шапке, см. header/nav-row).
 */
function MeasureRow({
  buttons,
  itemRefs,
  size,
}: {
  buttons: ButtonElement[]
  itemRefs: ReturnType<typeof useOverflowCount>["itemRefs"]
  size: ButtonRowSize
}) {
  return (
    // Клик по копии (его делает пункт «Ещё») гасится на слое: кнопка своё
    // `onClick` и действие по умолчанию (отправка формы) уже получила, а
    // предкам ряда он был бы ВТОРЫМ кликом — пункт меню и так всплывает к
    // ним через портал.
    <OverflowMeasureLayer
      className={ROW_GAP_CLASS[size]}
      onClick={(event) => event.stopPropagation()}
    >
      {buttons.map((child, index) => (
        <div
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          className="shrink-0"
        >
          {measureCopy(child, size)}
        </div>
      ))}
    </OverflowMeasureLayer>
  )
}

export { ButtonMenuRow, isButton, isOverflow }
export type { ButtonMenuRowProps, ButtonRowSize }
