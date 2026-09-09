/**
 * Автопрокрутка окна при перетаскивании к краю видимой области — кадр 6
 * макета «03. ELK / drag-and-drop»: «при перетаскивании объекта к нижней
 * границе видимой области происходит прокрутка вниз, к верхней — прокрутка
 * вверх».
 *
 * Отдельным модулем от `use-sortable.ts`: там уже вся логика позиционирования
 * линии и раскрытия групп, а правило кита держит файл в трёхстах строках.
 */

/** Полоса у края видимой области, в которой начинается автопрокрутка. */
const AUTOSCROLL_EDGE = 48
/** Шаг автопрокрутки за кадр. */
const AUTOSCROLL_STEP = 12

/**
 * Запускает прокрутку, если курсор в краевой полосе. Возвращает идентификатор
 * кадра — вызывающий гасит его через `cancelAnimationFrame`, — либо `null`,
 * если прокручивать не нужно.
 */
function startAutoscroll(list: HTMLElement | null, clientY: number): number | null {
  const scroller = findScrollParent(list)
  const top = scroller ? scroller.getBoundingClientRect().top : 0
  const bottom = scroller
    ? scroller.getBoundingClientRect().bottom
    : window.innerHeight

  let delta = 0
  if (clientY < top + AUTOSCROLL_EDGE) delta = -AUTOSCROLL_STEP
  else if (clientY > bottom - AUTOSCROLL_EDGE) delta = AUTOSCROLL_STEP
  if (!delta) return null

  let frame = 0
  const step = () => {
    if (scroller) scroller.scrollTop += delta
    else window.scrollBy(0, delta)
    frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
  return frame
}

// Поиск начинается С САМОГО списка, а не с родителя: список настройки
// столбцов прокручивается сам (`max-h` + `overflow-y-auto`), и автопрокрутка
// у его края обязана двигать именно его.
function findScrollParent(node: HTMLElement | null): HTMLElement | null {
  let current = node
  while (current) {
    const overflow = getComputedStyle(current).overflowY
    if (
      (overflow === "auto" || overflow === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current
    }
    current = current.parentElement
  }
  return null
}

export { startAutoscroll, AUTOSCROLL_EDGE, AUTOSCROLL_STEP }
