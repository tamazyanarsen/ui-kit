/**
 * Сколько места переключателю РЕАЛЬНО доступно по ширине — под сегменты,
 * то есть без собственных внутренних отступов и рамки корня.
 *
 * Корень Switcher — `inline-flex`, то есть его ширина подгоняется под
 * содержимое. Меря сам корень, ряд сворачивался навсегда: после ухода
 * сегментов в «…» корень сужался до видимых сегментов, и «доступная» ширина
 * оставалась свёрнутой, сколько бы места у родителя ни появилось.
 *
 * Поэтому, пока корень ужат по содержимому, его на время замера растягивают
 * на всё, что даёт ЕГО строка, читают ширину и сразу возвращают стили — до
 * отрисовки, так что ни кадра, ни срабатывания ResizeObserver это не даёт.
 * Свободное место при этом считает сама раскладка, а не арифметика по
 * соседям (две такие попытки ломались на `ml-auto` соседа и на корне шире
 * родителя).
 *
 * ⚠️ Как именно растягивать — выверено по трём ловушкам:
 * - `flex: 1 1 AUTO`, а не `0%`: с нулевой основой корень в ряду с
 *   переносом (`flex-wrap`) на время замера «переезжал» в предыдущую строку
 *   и получал её остаток — свёрнутый переключатель на пустой строке;
 * - растущие соседи (распорка `flex-1`) на время замера не растут: иначе
 *   они делили свободное место с корнем, и ряд не разворачивался до конца.
 *   Распорка и так занимает только то, что осталось;
 * - `min-width: 0`: иначе grid-трек и flex-элемент не уже своего
 *   min-content (всего ряда), и корень шире родителя не сворачивался.
 *
 * Корень, которому ширину задали снаружи (`w-full`, `flex-1`,
 * фиксированная), шире своего содержимого или уже его — тогда меряется,
 * как раньше, он сам.
 */
function availableWidth(root: HTMLElement): number {
  const style = getComputedStyle(root)
  const px = (value: string) => Number.parseFloat(value) || 0
  const padding = px(style.paddingLeft) + px(style.paddingRight)
  const contentBox = (width: number) => Math.max(0, width - padding)

  const own = root.clientWidth
  const parent = root.parentElement
  if (!parent) return contentBox(own)

  // Дети в потоке: мерная копия (`aria-hidden`, абсолютная) в ширину корня
  // не входит.
  const flowChildren = Array.from(root.children).filter(
    (child) => child.getAttribute("aria-hidden") !== "true"
  )
  const content =
    flowChildren.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0) +
    px(style.columnGap) * Math.max(0, flowChildren.length - 1) +
    padding +
    px(style.borderLeftWidth) +
    px(style.borderRightWidth)
  const shrinkWrapped = Math.abs(root.getBoundingClientRect().width - content) < 1
  if (!shrinkWrapped) return contentBox(own)

  const parentStyle = getComputedStyle(parent)
  const isRow =
    parentStyle.display.includes("flex") &&
    !parentStyle.flexDirection.startsWith("column")

  const restore: Array<() => void> = []
  const set = (element: HTMLElement, property: "flex" | "flexGrow" | "minWidth" | "width", value: string) => {
    const previous = element.style[property]
    restore.push(() => {
      element.style[property] = previous
    })
    element.style[property] = value
  }

  if (isRow) {
    set(root, "flex", "1 1 auto")
    for (const sibling of Array.from(parent.children)) {
      if (sibling !== root && sibling instanceof HTMLElement) set(sibling, "flexGrow", "0")
    }
  } else {
    set(root, "width", "100%")
  }
  set(root, "minWidth", "0")
  const stretched = root.clientWidth
  for (const undo of restore.reverse()) undo()

  // Растяжение не дало места (grid-трек `auto`, родитель по содержимому):
  // ширина здесь сама зависит от содержимого, и вычет своих отступов из неё
  // скатывал ряд по сегменту за пересчёт до одного. Тогда — как раньше,
  // по своей ширине целиком.
  if (Math.abs(stretched - own) <= 1) return own
  return contentBox(stretched)
}

export { availableWidth }
