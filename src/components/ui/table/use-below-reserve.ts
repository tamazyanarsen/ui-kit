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
 * Положение узла в РАЗМЕТКЕ, а не на экране. Годится только для НЕлипкого
 * узла — см. {@link naturalBottom}.
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

/**
 * Низ липкого узла там, где он стоит в РАЗМЕТКЕ, — без сдвига прилипания.
 *
 * ⚠️ С самого липкого узла этого не снять: у залипшего узла Chrome включает
 * сдвиг и в `getBoundingClientRect()`, и в `offsetTop` (замер: 420 вместо
 * естественных 400 при прокрутке 440). Пересчёт, случившийся во время
 * прилипания (наблюдатель родителя, ресайз окна, появление нижней панели),
 * занижал хвост страницы на этот сдвиг, срабатывала ветка «хвост меньше
 * свободной высоты» — и окно таблицы схлопывалось до нескольких пикселей, а
 * прокрутка страницы прыгала в начало.
 *
 * Поэтому низ считается от РОДИТЕЛЯ, который не липнет: его низ минус его
 * нижние поле и рамка и всё, что стоит в блоке ниже таблицы, — вместе с
 * зазорами и внешними отступами соседей.
 */
function naturalBottom(root: HTMLElement) {
  const parent = root.parentElement
  if (!parent) return layoutTop(root) + root.offsetHeight

  const styles = getComputedStyle(parent)
  const px = (value: string) => Number.parseFloat(value) || 0
  const gap = px(styles.rowGap)
  let below =
    px(styles.paddingBottom) + px(styles.borderBottomWidth) + px(getComputedStyle(root).marginBottom)
  for (let node = root.nextElementSibling; node; node = node.nextElementSibling) {
    const rect = node.getBoundingClientRect()
    if (rect.height === 0) continue
    const own = getComputedStyle(node)
    below += gap + rect.height + px(own.marginTop) + px(own.marginBottom)
  }
  return layoutTop(parent) + parent.offsetHeight - below
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
  const inDocument = document.documentElement.scrollHeight - naturalBottom(root)

  // ⚠️ Хвост страницы учитывается ТОЛЬКО пока он меньше свободной высоты.
  // Если под таблицей лежит ещё пол-страницы содержимого, прокрутки заведомо
  // хватает, липкость успевает отработать и разжаться, а вычитание таких
  // величин просто раздавило бы окно в ноль. В этом случае считается только
  // то, что внутри блока.
  return (inDocument < free ? Math.max(inBlock, inDocument) : inBlock) + scrollbar
}

/**
 * Есть ли в блоке ниже таблицы видимые соседи (пагинатор, «показать ещё»).
 *
 * ⚠️ Пока они есть, липкость узла гасится. `sticky` ограничен коробкой
 * родителя, а не «до следующего соседа»: прилипший узел ехал вниз ровно на
 * высоту всего, что под ним в блоке, и НАКРЫВАЛ пагинатор — итоговая
 * проверка №5, 1400×800: при прокрутке 300…600 клик по кнопкам страниц
 * попадал в ячейку таблицы. Весь его ход приходится на соседей, поэтому
 * ограничить сдвиг «до верха пагинатора» значит просто не сдвигаться.
 * Страница при этом не страдает: окно уже короче на `--table-below`, и
 * блок в самом низу страницы укладывается целиком без прилипания.
 */
function hasSiblingsBelow(root: HTMLElement) {
  for (let node = root.nextElementSibling; node; node = node.nextElementSibling) {
    if (node.getBoundingClientRect().height > 0) return true
  }
  return false
}

/**
 * Гасит липкость. ⚠️ `top` обнуляется вместе с `position`: отступ липкости
 * (`--viewport-inset-top`, у песочных экранов 64) у `relative` становится
 * СДВИГОМ, и таблица съезжала бы на пагинатор уже без всякой прокрутки.
 */
function unstick(root: HTMLElement) {
  root.style.setProperty("position", "relative")
  root.style.setProperty("top", "0px")
}

function restoreSticky(root: HTMLElement) {
  root.style.removeProperty("position")
  root.style.removeProperty("top")
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
      restoreSticky(root)
      return
    }

    const update = () => {
      root.style.setProperty(VARIABLE, `${Math.round(measure(root))}px`)
      // См. `hasSiblingsBelow`: встроенный стиль бьёт утилиту `sticky`.
      if (hasSiblingsBelow(root)) unstick(root)
      else restoreSticky(root)
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
      restoreSticky(root)
    }
  }, [ref, enabled])
}

export { useBelowReserve }
