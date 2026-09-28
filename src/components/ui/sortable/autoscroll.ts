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
 * Запускает прокрутку, если курсор в краевой полосе. Возвращает функцию
 * остановки либо `null`, если прокручивать не нужно.
 *
 * ⚠️ Именно функцию, а не id кадра: цикл перезапускает себя каждым кадром,
 * и id первого кадра к моменту остановки уже отработал. Прежняя версия
 * отдавала его наружу, `cancelAnimationFrame` гасил пустое место, и после
 * броска у края список прокручивался бесконечно — по циклу на каждый
 * `dragover`, в том числе после размонтирования.
 */
function startAutoscroll(
  list: HTMLElement | null,
  clientY: number
): (() => void) | null {
  const scroller = findScrollParent(list)
  const top = scroller ? scroller.getBoundingClientRect().top : 0
  const bottom = scroller
    ? scroller.getBoundingClientRect().bottom
    : window.innerHeight

  let delta = 0
  if (clientY < top + AUTOSCROLL_EDGE) delta = -AUTOSCROLL_STEP
  else if (clientY > bottom - AUTOSCROLL_EDGE) delta = AUTOSCROLL_STEP
  if (!delta) return null

  let frame = requestAnimationFrame(function step() {
    if (scroller) scroller.scrollTop += delta
    else window.scrollBy(0, delta)
    frame = requestAnimationFrame(step)
  })
  return () => cancelAnimationFrame(frame)
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
