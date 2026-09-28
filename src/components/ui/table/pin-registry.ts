// Реестр закреплённых ячеек таблицы: ОДИН ResizeObserver и ОДИН
// MutationObserver на таблицу вместо пары на каждую закреплённую ячейку.
//
// ⚠️ Раньше каждая закреплённая ячейка каждой строки заводила свои
// наблюдатели за всей своей строкой и на любое изменение размера сама
// перемеряла всех соседей. На 300 строках (чекбокс, левый закреп, действия
// справа) это ~3000 ResizeObserver, ~900 MutationObserver и ~11 тыс.
// вызовов `observe`, а при перетаскивании границы колонки — ~9 тыс.
// принудительных замеров раскладки на кадр.
//
// Ширины колонок у настоящей `<table>` общие для всех строк, поэтому
// изменение ширины любой колонки видно по ячейкам ОДНОЙ строки — первой
// строки шапки (или первой строки вообще, если шапки нет). Состав строк
// (включили `selectable`, переставили колонки, пришли новые строки)
// отслеживает один MutationObserver на всё дерево таблицы, с отсевом
// записей, которые строк не касаются. Замер — один проход по всем
// зарегистрированным ячейкам с кэшем ширин по строкам.

type Pin = "left" | "right"

interface PinnedCellState {
  /** Отступ `left` или `right` для липкой ячейки, в пикселях. */
  offset: number
  /** Истинно у ячейки на внутреннем крае своего закреплённого блока. */
  edge: boolean
}

interface Entry {
  el: HTMLElement
  pin: Pin
  set: (state: PinnedCellState) => void
}

/** Узлы, изменение детей которых меняет состав строк или ячеек. */
const STRUCTURE = new Set(["TABLE", "THEAD", "TBODY", "TFOOT", "TR"])

const registries = new WeakMap<Element, PinRegistry>()

/**
 * Дробная ширина, а не `offsetWidth`: округлённое целое оставляет между
 * двумя соседними закреплёнными ячейками субпиксельный зазор, сквозь который
 * прокручиваемые колонки просвечивают полоской в 1px.
 */
function rowWidths(row: Element, cache?: Map<Element, number[]>) {
  const cached = cache?.get(row)
  if (cached) return cached
  const widths = Array.from(row.children, (cell) => cell.getBoundingClientRect().width)
  cache?.set(row, widths)
  return widths
}

/**
 * Отступ складывается из ширин ячеек, мимо которых закреплённый блок
 * заякорен: всех предшествующих для левого закрепа и всех последующих для
 * правого. `offsetLeft` ненадёжен: в некоторых движках залипшая ячейка
 * сообщает уже смещённую коробку, и это подмешалось бы в её же отступ.
 */
function measureCell(entry: Entry, cache?: Map<Element, number[]>): PinnedCellState | null {
  const { el, pin } = entry
  const row = el.parentElement
  if (!row || !el.isConnected) return null
  const cells = row.children
  const index = Array.prototype.indexOf.call(cells, el) as number
  const widths = rowWidths(row, cache)
  let offset = 0
  if (pin === "left") {
    for (let i = 0; i < index; i++) offset += widths[i]
    const next = cells[index + 1] as HTMLElement | undefined
    return { offset, edge: !next || next.dataset.pin !== "left" }
  }
  for (let i = index + 1; i < cells.length; i++) offset += widths[i]
  const previous = cells[index - 1] as HTMLElement | undefined
  return { offset, edge: !previous || previous.dataset.pin !== "right" }
}

class PinRegistry {
  private readonly entries = new Set<Entry>()
  private readonly root: Element
  private readonly resize: ResizeObserver
  private readonly mutations: MutationObserver

  constructor(root: Element) {
    this.root = root
    this.resize = new ResizeObserver(() => this.measureAll())
    this.mutations = new MutationObserver((records) => {
      if (!records.some((record) => STRUCTURE.has(record.target.nodeName))) return
      this.observeWidths()
      this.measureAll()
    })
    this.mutations.observe(root, { childList: true, subtree: true })
    this.observeWidths()
  }

  /** Ячейки одной строки несут ширины всех колонок таблицы. */
  private observeWidths() {
    this.resize.disconnect()
    this.resize.observe(this.root)
    const row = this.root.querySelector("thead tr") ?? this.root.querySelector("tr")
    if (row) for (const cell of Array.from(row.children)) this.resize.observe(cell)
  }

  measureAll() {
    const cache = new Map<Element, number[]>()
    for (const entry of this.entries) {
      const state = measureCell(entry, cache)
      if (state) entry.set(state)
    }
  }

  register(entry: Entry) {
    this.entries.add(entry)
    // Первый замер — сразу, до отрисовки: вызывается из layout-эффекта.
    const state = measureCell(entry)
    if (state) entry.set(state)
    return () => {
      this.entries.delete(entry)
      if (this.entries.size > 0) return
      this.resize.disconnect()
      this.mutations.disconnect()
      registries.delete(this.root)
    }
  }
}

/** Регистрирует закреплённую ячейку в реестре её таблицы; возвращает отписку. */
function registerPinnedCell(
  el: HTMLElement,
  pin: Pin,
  set: (state: PinnedCellState) => void
) {
  const root = el.closest("table") ?? el.parentElement ?? el
  let registry = registries.get(root)
  if (!registry) {
    registry = new PinRegistry(root)
    registries.set(root, registry)
  }
  return registry.register({ el, pin, set })
}

export { registerPinnedCell }
export type { PinnedCellState }
