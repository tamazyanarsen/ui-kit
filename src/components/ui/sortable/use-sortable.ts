import * as React from "react"
import { useLatest } from "@/lib/use-latest"

import { startAutoscroll } from "./autoscroll"
import { hideDragGhost } from "./drag-image"
import { exceedsGroupLimit, landingDepth, landingDepthOptions } from "./landing"

/**
 * Перетаскивание списка — единые правила кита по макету «03. ELK /
 * drag-and-drop». Действуют для таблиц, настройки главного
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
 *
 * ⚠️ Механика — нативный HTML5 drag&drop (`draggable`, `dragstart`,
 * `dragover`, `drop`); pointer-события только взводят строку по ручке.
 * Мобильные браузеры (Android Chrome, iOS Safari до 15) `dragstart` с
 * касания не шлют, поэтому на телефоне мышиного переноса НЕТ — порядок
 * меняется стрелками ↑/↓ на ручке (она фокусируемая кнопка). Экраны, где
 * перенос на мобильном нужен, должны показать альтернативу (кнопки
 * «Выше/Ниже» или режим редактирования) — сам хук pointer-перенос не
 * эмулирует (ревью 10.10, КК-5).
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
  /**
   * Предельное число строк в группе (только у `group`). У полной группы нет
   * линии под последней строкой: такой бросок ничего не меняет (дизайн-чек
   * 08.10, замечание 7). Место вместо последней строки остаётся доступным.
   */
  limit?: number
}

/** Подробности броска для `onReorder`. */
interface SortableDropMeta {
  /**
   * Глубина, на которой строка окажется после броска: 0 — верхний уровень,
   * 1 и глубже — внутри группы. По ней потребитель понимает, что строка
   * перешла в другую группу (и, если группа была полной, вытесняет из неё
   * последнюю строку).
   */
  depth: number
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
  onReorder: (from: number, to: number, meta: SortableDropMeta) => void
  /** Уронить элемент внутрь группы. Без него бросок в группу невозможен. */
  onDropInto?: (groupId: string, dragId: string) => void
  /** Раскрыть свёрнутую группу, над которой держат элемент. */
  onExpandGroup?: (groupId: string) => void
  /** Задержка раскрытия группы. По макету — 0,5 с. */
  expandDelay?: number
  disabled?: boolean
  /**
   * Дополнительный запрет переноса сверх `locked` (индексы в `items`).
   * Нужен, когда `items` — отфильтрованный вид, а неподвижная строка скрыта
   * между видимыми: без него линия вставки рисовалась бы над местом,
   * бросок на которое `onReorder` всё равно отклонит.
   */
  canMove?: (from: number, to: number, meta: SortableDropMeta) => boolean
}

/**
 * Перенос `from` → `to` не сдвигает ни одной закреплённой строки. Перенос
 * смещает на одну позицию ВСЕ строки между двумя индексами, поэтому
 * закреплённая мешает, где бы в этом отрезке она ни стояла, а не только
 * вплотную к переносимой: иначе стрелка или бросок над ней выдавливали бы
 * `locked`-строку с её места.
 *
 * `locked` здесь — только «строку нельзя двигать»; с закрепом колонки
 * (`pin`) он сам по себе не связан. Но в настройке столбцов неподвижными
 * обычно делают как раз закреплённые колонки — и если такую выдавить, перед
 * ней встаёт подвижная, а закреп считает отступ по всем предыдущим ячейкам
 * и едет вместе с ней.
 */
function canReorder(items: SortableEntry[], from: number, to: number) {
  if (from === to || items[from]?.locked) return false
  const [start, end] = from < to ? [from + 1, to] : [to, from - 1]
  for (let i = start; i <= end; i += 1) if (items[i]?.locked) return false
  return true
}

function useSortable({
  items,
  onReorder,
  onDropInto,
  onExpandGroup,
  expandDelay = 500,
  disabled = false,
  canMove,
}: UseSortableOptions) {
  // Последний `canMove` — в ref: колбэки ниже не должны пересоздаваться
  // из-за новой функции на каждом рендере потребителя.
  const canMoveRef = useLatest(canMove)
  // `to === from` с другой глубиной — переход в группу или из неё на том же
  // индексе: закреплённых строк он не сдвигает, `canReorder` для него не нужен.
  const allowed = React.useCallback(
    (entries: SortableEntry[], from: number, to: number, depth: number) =>
      (to === from ? !entries[from]?.locked : canReorder(entries, from, to)) &&
      (canMoveRef.current?.(from, to, { depth }) ?? true),
    [canMoveRef]
  )
  const listRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef(new Map<string, HTMLElement>())
  const [armedId, setArmedId] = React.useState<string | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dropIntoId, setDropIntoId] = React.useState<string | null>(null)
  const [indicator, setIndicator] = React.useState<SortableIndicator | null>(null)
  /** Куда встанет элемент, если отпустить сейчас. Индекс в `items`. */
  const dropIndex = React.useRef<number | null>(null)
  /** Глубина приземления для текущего `dropIndex`. */
  const dropDepth = React.useRef(0)
  const expandTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Остановка текущего цикла автопрокрутки; цикл всегда один. */
  const stopScroll = React.useRef<(() => void) | null>(null)

  const cancelExpand = React.useCallback(() => {
    if (expandTimer.current) clearTimeout(expandTimer.current)
    expandTimer.current = null
  }, [])

  const stopAutoscroll = React.useCallback(() => {
    stopScroll.current?.()
    stopScroll.current = null
  }, [])

  /** Перетаскивание уже началось: `pointercancel` от его старта не снимает взвод. */
  const draggingRef = React.useRef(false)

  const reset = React.useCallback(() => {
    cancelExpand()
    stopAutoscroll()
    // Бросок мог перенести строку в другой родитель (в группу): узел
    // пересоздан, и `dragend` до React не доходит — флаг без сброса навсегда
    // отключал снятие взвода по `pointerup`.
    draggingRef.current = false
    setArmedId(null)
    setDragId(null)
    setDropIntoId(null)
    setIndicator(null)
    dropIndex.current = null
  }, [cancelExpand, stopAutoscroll])

  React.useEffect(() => reset, [reset])

  // Взвод держится, только пока нажатие, начатое на ручке, не отпущено.
  // Раньше его снимал лишь `pointerup` на самой ручке: отпущенная за ней
  // кнопка или `pointercancel` (палец начал прокрутку списка) оставляли
  // строку `draggable`, и следующий `dragstart` с её текста переносил
  // строку — вопреки правилу макета «захват по иконке».
  React.useEffect(() => {
    if (armedId === null) return
    const disarm = () => {
      if (!draggingRef.current) setArmedId(null)
    }
    window.addEventListener("pointerup", disarm)
    window.addEventListener("pointercancel", disarm)
    return () => {
      window.removeEventListener("pointerup", disarm)
      window.removeEventListener("pointercancel", disarm)
    }
  }, [armedId])

  // Автопрокрутка у границ видимой области — «при перетаскивании объекта к
  // нижней границе видимой области происходит прокрутка вниз, к верхней —
  // вверх» (кадр 6 макета). Механика в `autoscroll.ts`.
  const autoscroll = React.useCallback(
    (clientY: number) => {
      stopAutoscroll()
      stopScroll.current = startAutoscroll(listRef.current, clientY)
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
      // Только если группе есть что с этим делать: уронить внутрь
      // (`onDropInto`) или раскрыть, чтобы бросить между её строками
      // (`onExpandGroup`). Без обоих заливка обещала бросок, который потом
      // молча ничего не делал (ревью 10.10, п. 15), — тогда заголовок
      // остаётся обычной строкой с линией.
      if (
        (onDropInto || onExpandGroup) &&
        hovered.group &&
        !hovered.expanded &&
        hovered.id !== dragId &&
        !hovered.locked
      ) {
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

      // Место вставки, которое сдвинуло бы закреплённую строку, запрещено:
      // линии нет, бросок ничего не делает.
      const insertAt = half === "top" ? hoverIndex : hoverIndex + 1
      const from = items.findIndex((item) => item.id === dragId)
      const target = insertAt > from ? insertAt - 1 : insertAt
      const depth = landingDepth(items, dragId, insertAt, hovered.depth ?? 0)
      // Строка над самой собой на своей же глубине — бросок ничего не
      // меняет, линия остаётся как была (проверять тут нечего).
      const noop = target === from && depth === (items[from]?.depth ?? 0)
      if (
        !noop &&
        (!allowed(items, from, target, depth) ||
          exceedsGroupLimit(items, dragId, insertAt, depth))
      ) {
        setIndicator(null)
        dropIndex.current = null
        return
      }
      dropIndex.current = insertAt
      dropDepth.current = depth
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
    [items, dragId, dropIntoId, cancelExpand, onExpandGroup, onDropInto, expandDelay, allowed]
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
        // Та же позиция, но другая глубина — переход в группу или из неё:
        // это тоже перенос, хотя индекс и не меняется.
        const moved = to !== from || dropDepth.current !== (items[from].depth ?? 0)
        if (moved && allowed(items, from, to, dropDepth.current)) {
          onReorder(from, to, { depth: dropDepth.current })
        }
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
        // `dragstart` всплывает и от draggable-потомка невзведённой строки:
        // протянутое выделение текста, ссылка, картинка. Такой жест — не
        // перенос строки (макет: «захват по иконке»), и данные браузера мы
        // ему не подменяем (ревью 10.10, п. 4).
        if (!movable || armedId !== id) return
        // Данные обязательны: Firefox не начинает перетаскивание без них.
        if (event.dataTransfer) {
          event.dataTransfer.setData("text/plain", id)
          event.dataTransfer.effectAllowed = "move"
        }
        // Фантома у курсора нет — только заливка на месте и линия вставки.
        hideDragGhost(event.dataTransfer)
        draggingRef.current = true
        setDragId(id)
      },
      onDragEnd: () => {
        draggingRef.current = false
        reset()
      },
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
        const to =
          event.key === "ArrowUp" ? index - 1 : event.key === "ArrowDown" ? index + 1 : -1
        if (to < 0 || to >= items.length) return
        event.preventDefault()
        // Место вставки в координатах `items` до изъятия строки — как у мыши.
        const insertAt = to < index ? to : to + 1
        const depth = landingDepthOptions(items, id, insertAt, items[index].depth ?? 0).find(
          (option) =>
            !exceedsGroupLimit(items, id, insertAt, option) && allowed(items, index, to, option)
        )
        if (depth !== undefined) onReorder(index, to, { depth })
      },
    }
  }

  return { listProps, itemProps, handleProps, indicator, dragId, dropIntoId }
}

export { useSortable, canReorder }
export type { SortableDropMeta, SortableEntry, SortableIndicator, UseSortableOptions }
