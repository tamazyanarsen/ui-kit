import * as React from "react"

import { startAutoscroll } from "./autoscroll"

/**
 * Перетаскивание списка — единые правила кита по макету «03. ELK /
 * drag-and-drop» (нода 42995:34194). Действуют для таблиц, настройки главного
 * меню, настройки избранного и любого следующего раздела: визуал задаётся
 * здесь, а не переизобретается на каждом экране (до этой правки таких мест
 * было три, и все три выглядели по-разному).
 *
 * Что описывает макет и что из этого делает хук:
 *
 *   1. «Захват для перетаскивания происходит по иконке. Перетаскиваемый
 *      элемент окрашивается в цвет Active (Grey 124)» — `handleProps`
 *      взводит перетаскивание, `itemProps` отдаёт `data-dragging`.
 *   2. «При перетаскивании между объектами в абсолютной позиции появляется
 *      чёрная линия высотой 2 px… При этом элементы списка НЕ раздвигаются» —
 *      отсюда `indicator` с координатами, а не вставка пустого места в поток.
 *   3. «Чтобы вставить раздел в группу, надо перетащить его на заголовок
 *      свёрнутой группы — появляется серая заливка Hover (Grey 106), после
 *      чего с задержкой 0,5 секунды она разворачивается» — `data-drop-into`
 *      и таймер `expandDelay`.
 *   4. «При наведении на нижнюю половину последнего раздела группы появляется
 *      более короткая линия» / «при наведении на верхнюю половину раздела под
 *      группой — стандартная линия… абсолютная позиция обеих линий находится
 *      на одном уровне» — из этого следует правило отступа: линия наследует
 *      глубину ТОЙ строки, над половиной которой стоит курсор, а место
 *      вставки берётся из половины (верхняя — перед строкой, нижняя — после).
 *   5. «При перетаскивании объекта к нижней границе видимой области
 *      происходит прокрутка вниз, к верхней — вверх» — автопрокрутка ниже.
 */
interface SortableEntry {
  id: string
  /** Вложенность строки. Задаёт отступ короткой линии вставки. */
  depth?: number
  /** Строка — заголовок группы. */
  group?: boolean
  /** Группа раскрыта. Свёрнутая раскрывается при наведении. */
  expanded?: boolean
  /** Строку нельзя ни двигать, ни ронять на неё. */
  locked?: boolean
}

interface SortableIndicator {
  /** Отступ линии сверху, в пикселях от верха списка. */
  top: number
  /** Левый отступ — 0 у обычной линии, `--dnd-indicator-nested-inset` × depth. */
  depth: number
}

interface UseSortableOptions {
  items: SortableEntry[]
  /** Перенести элемент `from` на позицию `to` (индексы в `items`). */
  onReorder: (from: number, to: number) => void
  /** Уронить элемент внутрь группы. Без него бросок в группу невозможен. */
  onDropInto?: (groupId: string, dragId: string) => void
  /** Раскрыть свёрнутую группу, над которой держат элемент. */
  onExpandGroup?: (groupId: string) => void
  /** Задержка раскрытия группы. По макету — 0,5 с. */
  expandDelay?: number
  disabled?: boolean
}

function useSortable({
  items,
  onReorder,
  onDropInto,
  onExpandGroup,
  expandDelay = 500,
  disabled = false,
}: UseSortableOptions) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef(new Map<string, HTMLElement>())
  const [armedId, setArmedId] = React.useState<string | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dropIntoId, setDropIntoId] = React.useState<string | null>(null)
  const [indicator, setIndicator] = React.useState<SortableIndicator | null>(null)
  /** Куда встанет элемент, если отпустить сейчас. Индекс в `items`. */
  const dropIndex = React.useRef<number | null>(null)
  const expandTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollFrame = React.useRef<number | null>(null)

  const cancelExpand = React.useCallback(() => {
    if (expandTimer.current) clearTimeout(expandTimer.current)
    expandTimer.current = null
  }, [])

  const stopAutoscroll = React.useCallback(() => {
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
    scrollFrame.current = null
  }, [])

  const reset = React.useCallback(() => {
    cancelExpand()
    stopAutoscroll()
    setArmedId(null)
    setDragId(null)
    setDropIntoId(null)
    setIndicator(null)
    dropIndex.current = null
  }, [cancelExpand, stopAutoscroll])

  React.useEffect(() => reset, [reset])

  // Автопрокрутка у границ видимой области — «при перетаскивании объекта к
  // нижней границе видимой области происходит прокрутка вниз, к верхней —
  // вверх» (кадр 6 макета). Механика в `autoscroll.ts`.
  const autoscroll = React.useCallback(
    (clientY: number) => {
      stopAutoscroll()
      scrollFrame.current = startAutoscroll(listRef.current, clientY)
    },
    [stopAutoscroll]
  )

  // Разбор позиции курсора: над какой строкой он стоит, над какой её
  // половиной, и что из этого следует.
  const resolve = React.useCallback(
    (clientY: number) => {
      const list = listRef.current
      if (!list || !dragId || !Number.isFinite(clientY)) return
      const listTop = list.getBoundingClientRect().top

      let hoverIndex = -1
      let half: "top" | "bottom" = "top"
      let boundary = 0
      for (let i = 0; i < items.length; i += 1) {
        const node = rowRefs.current.get(items[i].id)
        if (!node) continue
        const rect = node.getBoundingClientRect()
        if (clientY < rect.bottom || i === items.length - 1) {
          hoverIndex = i
          half = clientY < rect.top + rect.height / 2 ? "top" : "bottom"
          boundary = half === "top" ? rect.top : rect.bottom
          break
        }
      }
      if (hoverIndex < 0) return

      const hovered = items[hoverIndex]

      // Свёрнутая группа под курсором — бросок ВНУТРЬ неё, линии нет.
      if (hovered.group && !hovered.expanded && hovered.id !== dragId && !hovered.locked) {
        setIndicator(null)
        dropIndex.current = null
        if (dropIntoId !== hovered.id) {
          cancelExpand()
          setDropIntoId(hovered.id)
          expandTimer.current = setTimeout(() => {
            onExpandGroup?.(hovered.id)
          }, expandDelay)
        }
        return
      }

      if (dropIntoId) {
        cancelExpand()
        setDropIntoId(null)
      }

      dropIndex.current = half === "top" ? hoverIndex : hoverIndex + 1
      setIndicator({
        // Линия НЕ раздвигает список: её место считается от границы строки, а
        // 1px вычитается, чтобы двухпиксельная полоса села на границу
        // симметрично (в макете `y=279` при строке 224…280).
        //
        // ⚠️ `scrollTop` обязателен. Абсолютный потомок отсчитывается от
        // НАЧАЛА содержимого контейнера, а `getBoundingClientRect()` даёт его
        // видимый верх — у прокрученного списка (а список настройки столбцов
        // именно такой) эти точки расходятся ровно на прокрутку, и линия
        // вставала бы тем выше, чем ниже прокручен список.
        top: boundary - listTop + list.scrollTop - 1,
        depth: hovered.depth ?? 0,
      })
    },
    [items, dragId, dropIntoId, cancelExpand, onExpandGroup, expandDelay]
  )

  const listProps = {
    ref: listRef,
    onDragOver: (event: React.DragEvent) => {
      if (!dragId) return
      // Без `preventDefault` браузер считает область запрещённой для сброса и
      // не шлёт `drop` вовсе.
      event.preventDefault()
      // Обращение через `?.` не перестраховка: у синтетического события из
      // тестов (jsdom не создаёт `DataTransfer` сам) поля нет, и без проверки
      // весь обработчик падал бы, не дойдя до расчёта линии.
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
      resolve(event.clientY)
      autoscroll(event.clientY)
    },
    onDragLeave: (event: React.DragEvent) => {
      // `dragleave` прилетает и при переходе между строками ВНУТРИ списка —
      // сбрасываем подсветку только когда курсор ушёл из списка целиком.
      if (event.currentTarget.contains(event.relatedTarget as Node)) return
      cancelExpand()
      stopAutoscroll()
      setDropIntoId(null)
      setIndicator(null)
      dropIndex.current = null
    },
    onDrop: (event: React.DragEvent) => {
      if (!dragId) return
      event.preventDefault()
      const from = items.findIndex((item) => item.id === dragId)
      if (dropIntoId && onDropInto) {
        onDropInto(dropIntoId, dragId)
      } else if (from >= 0 && dropIndex.current !== null) {
        // Индекс вставки посчитан ДО изъятия элемента, поэтому при движении
        // вниз он на единицу больше конечного.
        const to = dropIndex.current > from ? dropIndex.current - 1 : dropIndex.current
        if (to !== from) onReorder(from, to)
      }
      reset()
    },
  }

  function itemProps(id: string) {
    const item = items.find((entry) => entry.id === id)
    const movable = !disabled && !item?.locked
    return {
      ref: (node: HTMLElement | null) => {
        if (node) rowRefs.current.set(id, node)
        else rowRefs.current.delete(id)
      },
      draggable: movable && armedId === id,
      "data-dragging": dragId === id || undefined,
      "data-drop-into": dropIntoId === id || undefined,
      onDragStart: (event: React.DragEvent) => {
        if (!movable) return
        // Данные обязательны: Firefox не начинает перетаскивание без них.
        if (event.dataTransfer) {
          event.dataTransfer.setData("text/plain", id)
          event.dataTransfer.effectAllowed = "move"
        }
        setDragId(id)
      },
      onDragEnd: reset,
    }
  }

  /**
   * Ручка захвата. `draggable` включается только на время нажатия на неё —
   * иначе перетаскивалась бы вся строка (макет: «захват происходит по
   * иконке»), а если повесить `draggable` на саму иконку, браузер возьмёт в
   * призрак её одну, а не строку.
   */
  function handleProps(id: string) {
    const item = items.find((entry) => entry.id === id)
    const movable = !disabled && !item?.locked
    return {
      onPointerDown: () => movable && setArmedId(id),
      onPointerUp: () => setArmedId(null),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (!movable) return
        const index = items.findIndex((entry) => entry.id === id)
        if (event.key === "ArrowUp" && index > 0) {
          event.preventDefault()
          onReorder(index, index - 1)
        } else if (event.key === "ArrowDown" && index < items.length - 1) {
          event.preventDefault()
          onReorder(index, index + 1)
        }
      },
    }
  }

  return { listProps, itemProps, handleProps, indicator, dragId, dropIntoId }
}

export { useSortable }
export type { SortableEntry, SortableIndicator, UseSortableOptions }
