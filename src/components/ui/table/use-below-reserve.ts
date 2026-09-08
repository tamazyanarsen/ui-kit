import * as React from "react"

// Сколько высоты вьюпорта окно таблицы обязано оставить тому, что стоит НИЖЕ
// неё, — пагинатору, кнопке «показать ещё», хвосту страницы. Публикуется на
// липком узле таблицы переменной `--table-below`, а окно прокрутки вычитает
// её из своей предельной высоты.
//
// ⚠️ Зачем это нужно. Липкая таблица берёт под себя всю свободную высоту
// вьюпорта (`100dvh` минус занятые верх и низ) и прилипает к `--viewport-inset-top`.
// Но `position: sticky` ограничен коробкой РОДИТЕЛЯ: доехать до своего
// `top` липкий узел может только пока под ним в блоке есть запас. Когда его
// нет, узел упирается в низ блока — и наезжает на всё, что там стоит.
// Дизайн-чек от 08.09, замечание 11: «В деталке бизнес-карты пагинатор
// обрезался». Замер на 1280×640 показывал ровно это: окно 576px во всю
// свободную высоту, пагинатор с 540 по 585, последняя строка с 533 по 601 —
// пагинатор рисовался поверх строки просто потому, что стоит ниже в разметке.
//
// Отсюда правило: окно короче ровно на то, что под ним, — тогда в самом низу
// страницы блок укладывается целиком, и наезжать не на что.
const VARIABLE = "--table-below"

/**
 * Положение узла в РАЗМЕТКЕ, а не на экране.
 *
 * ⚠️ `getBoundingClientRect()` здесь не годится: липкий узел сдвинут
 * визуально, и любая величина, снятая с его прямоугольника во время
 * прилипания, врёт ровно на этот сдвиг. `offsetTop` — величина разметочная и
 * от прокрутки не зависит.
 */
function layoutTop(element: HTMLElement) {
  let top = 0
  for (
    let node: HTMLElement | null = element;
    node;
    node = node.offsetParent as HTMLElement | null
  ) {
    top += node.offsetTop
  }
  return top
}

/** Занятое соседями место внутри блока: их высоты плюс зазоры и поле снизу. */
function reserveInBlock(root: HTMLElement) {
  const parent = root.parentElement
  if (!parent) return 0

  let height = 0
  let siblings = 0
  for (let node = root.nextElementSibling; node; node = node.nextElementSibling) {
    const rect = node.getBoundingClientRect()
    // Ноль высоты — узел, которого сейчас нет (пустой результат, скрытый
    // пагинатор): ни высоты, ни зазора перед ним.
    if (rect.height === 0) continue
    height += rect.height
    siblings += 1
  }
  if (siblings === 0) return 0

  const styles = getComputedStyle(parent)
  const gap = Number.parseFloat(styles.rowGap) || 0
  return height + gap * siblings + (Number.parseFloat(styles.paddingBottom) || 0)
}

function measure(root: HTMLElement) {
  const inBlock = reserveInBlock(root)

  // ⚠️ `100dvh` — это высота ВЬЮПОРТА, вместе с горизонтальной полосой
  // прокрутки страницы, а видимой области остаётся на её толщину меньше.
  // Полоса у продукта появляется штатно: ниже 1280 он не сжимается (см.
  // `GridRoot`). Замерено на 1280×640 — 15px, ровно на столько окно таблицы
  // и наезжало на пагинатор после первой правки.
  const scrollbar = Math.max(
    0,
    window.innerHeight - document.documentElement.clientHeight
  )

  const styles = getComputedStyle(document.documentElement)
  const free =
    document.documentElement.clientHeight -
    (Number.parseFloat(styles.getPropertyValue("--viewport-inset-top")) || 0) -
    (Number.parseFloat(styles.getPropertyValue("--viewport-inset-bottom")) || 0)

  // Всё, что лежит ниже таблицы до конца прокручиваемой страницы: пагинатор
  // блока плюс хвост самой страницы. Именно этой величины не хватало
  // странице, чтобы дать липкому узлу доехать до своего `top`.
  const inDocument =
    document.documentElement.scrollHeight - (layoutTop(root) + root.offsetHeight)

  // ⚠️ Хвост страницы учитывается ТОЛЬКО пока он меньше свободной высоты.
  // Если под таблицей лежит ещё пол-страницы содержимого, прокрутки заведомо
  // хватает, липкость успевает отработать и разжаться, а вычитание таких
  // величин просто раздавило бы окно в ноль. В этом случае считается только
  // то, что внутри блока.
  return (inDocument < free ? Math.max(inBlock, inDocument) : inBlock) + scrollbar
}

/**
 * Держит `--table-below` на узле из `ref` в актуальном состоянии, пока
 * `enabled`. Выключенный хук переменную снимает — иначе окно осталось бы с
 * запасом под соседей, которых больше нет.
 */
function useBelowReserve(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    if (!enabled) {
      root.style.removeProperty(VARIABLE)
      return
    }

    const update = () => {
      root.style.setProperty(VARIABLE, `${Math.round(measure(root))}px`)
    }

    update()

    // Достаточно следить за РОДИТЕЛЕМ и окном: высота родителя меняется от
    // любого соседа, а размер вьюпорта — от самого окна. Состав ряда
    // (пагинатор появился, пустой результат исчез) высоту меняет не всегда,
    // отсюда третий наблюдатель.
    const parent = root.parentElement
    const size = new ResizeObserver(update)
    if (parent) size.observe(parent)
    size.observe(document.documentElement)
    const children = new MutationObserver(update)
    if (parent) children.observe(parent, { childList: true })
    window.addEventListener("resize", update)

    return () => {
      size.disconnect()
      children.disconnect()
      window.removeEventListener("resize", update)
      root.style.removeProperty(VARIABLE)
    }
  }, [ref, enabled])
}

export { useBelowReserve }
