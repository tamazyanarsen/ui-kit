import * as React from "react"

import { cn } from "@/lib/utils"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { Button } from "@/components/ui/button"

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
// `ELK / button` 56px и `ELK / selection button` 56×56 (нода 41357:45664),
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

function ButtonMenuRow({
  size = "lg",
  className,
  children,
  ...props
}: ButtonMenuRowProps) {
  const nodes = React.Children.toArray(children)
  const buttons = nodes.filter(isButton)
  const supplied = nodes.find(isOverflow)

  const gap = ROW_GAP[size]
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    buttons.length,
    // Место под «…» резервируется только когда ему есть куда деться: если
    // вызывающий уже передал меню, оно и так занимает место в ряду.
    supplied ? 0 : OVERFLOW_WIDTH[size] + gap,
    gap
  )

  // Размер кнопкам ряд задаёт САМ, что бы ни передал вызывающий: ряд обязан
  // быть одной высоты, а собственное умолчание кнопки — Medium, то есть не
  // тот размер ни для панели, ни для карточки.
  const sized = (child: ButtonElement, key: React.Key) =>
    React.cloneElement(child, { key, size })

  const visible = buttons.slice(0, visibleCount).map(sized)
  const hidden = buttons.slice(visibleCount)

  // Спрятанная кнопка становится строкой меню: подпись — её содержимое,
  // действие — её же обработчик. Ничего третьего у кнопки ряда нет.
  const hiddenItems = hidden.map((child, index) => (
    <ButtonMenuOverflowItem
      key={`overflow-${index}`}
      text={child.props.children}
      disabled={child.props.disabled}
      onClick={child.props.onClick as (() => void) | undefined}
    />
  ))

  let overflow: React.ReactNode = null
  if (supplied) {
    // Переданное меню остаётся тем же инстансом (у него свои Direction и
    // Show Dropdown) — в него лишь дописываются спрятанные команды, причём
    // В НАЧАЛО: они стояли левее в ряду.
    overflow = React.cloneElement(supplied, { size }, [
      ...hiddenItems,
      ...React.Children.toArray(supplied.props.children),
    ])
  } else if (hiddenItems.length > 0) {
    overflow = <ButtonMenuOverflow size={size}>{hiddenItems}</ButtonMenuOverflow>
  }

  return (
    <div
      ref={containerRef}
      data-slot="button-menu-row"
      className={cn(
        "relative flex min-w-0 flex-1 items-center",
        ROW_GAP_CLASS[size],
        className
      )}
      {...props}
    >
      {visible}
      {overflow}
      <MeasureRow buttons={buttons} itemRefs={itemRefs} size={size} />
    </div>
  )
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
    <div
      aria-hidden="true"
      className="pointer-events-none invisible absolute inset-0 overflow-hidden"
    >
      <div className={cn("absolute top-0 left-0 flex", ROW_GAP_CLASS[size])}>
        {buttons.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="shrink-0"
          >
            {React.cloneElement(child, { size })}
          </div>
        ))}
      </div>
    </div>
  )
}

export { ButtonMenuRow, isButton, isOverflow }
export type { ButtonMenuRowProps, ButtonRowSize }
