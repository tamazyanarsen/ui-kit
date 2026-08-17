import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronUp, ChevronsUpDown, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dropdown } from "@/components/ui/dropdown"
import { SelectionButton, type SelectionButtonItem } from "@/components/ui/selection-button"
import { Tag, type TagColor } from "@/components/ui/tag"
import { Tooltip } from "@/components/ui/tooltip"

import {
  TableScrollContext,
  useHorizontalScrollState,
  usePinnedCell,
  useTableScrollState,
  type TablePin,
} from "./pin"
import { TableScrollbar } from "./scrollbar"

// Table — "Проектирование таблиц ЕЛК" (node 70279:6891). Anatomy per spec: a
// Title Cell row (the header, `<thead>`) and a Cell grid of data rows
// (`<tbody>`/`TableRow`). Built on real `<table>`/`<thead>`/`<tbody>`/`<tr>`/
// `<th>`/`<td>` — the spec's cell "Type" variants (Checkbox/Collapse/Text/
// Number/Tag/Button) are genuinely heterogeneous per-column content, which
// real table semantics (row/column screen-reader navigation, `scope="col"`)
// support directly; nothing in the rest of this kit's div-based components
// (Item, Accordion List) covers a data grid like this.
//
// Row states ("Варианты — Line Fill", node 70279:7145): Default has no fill,
// Hover/Active are plain CSS `:hover`/`:active` — but *only on a row that
// navigates somewhere*, since the spec says "если переход невозможен, строка
// не меняет цвет и сохраняет стандартный курсор, исключая состояния
// наведения и активности", hence the explicit `clickable` prop. `selected`
// is the multi-select fill (checkbox checked) and `added` marks a
// just-created row, which fades itself out over 2000ms (see `--table-added`
// keyframes in index.css).

/**
 * Horizontal padding for one cell. Base is the 8px both sides that keeps
 * every row on the same grid ("Для совпадения левого отступа все строки
 * таблицы используют внутренние паддинги по 8px с обеих сторон"); a pinned
 * block then drops the padding on the side it is anchored to — "Если есть
 * левый закреп — то у закрепа левый паддинг 8px, правый 0. У подвижной части
 * — левый паддинг 0px, правый 8px", and the right pin "не получает
 * дополнительных отступов, поскольку содержит только кнопку с иконкой и
 * имеет строго фиксированную ширину".
 *
 * Two cell types are exempt because their own master pins their width and
 * would be broken by the grid rule (`ownPadding`): the action cell's 10px
 * ring around a 32px icon button is what makes the pinned column exactly
 * 52px wide, and the body Checkbox cell is `pl-8 pr-16` around its 24px box
 * (48px total) rather than symmetric — read off `ELK / table-cell` in the
 * anatomy frame (node 70279:6915), where Figma's own annotations label the
 * gap after the checkbox as 16.
 */
function cellPaddingXClass(pin: TablePin | undefined, ownPadding: boolean) {
  if (ownPadding) return undefined
  if (pin === "left") return "pr-0 pl-2"
  if (pin === "right") return "px-0"
  return "px-2"
}

/** Tooltip-on-overflow: the spec shows a hint with the full value whenever a
 * cell's text is clipped ("При наведении на усечённый текст появляется
 * подсказка с полным содержимым"). Re-measures on column resize. */
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    // +1px guard: sub-pixel text metrics can make scrollWidth exceed
    // clientWidth on text that visually fits (same guard as Input's).
    setTruncated(el.scrollWidth > el.clientWidth + 1)
  }, [])

  // Two effects on purpose. Content can change without the box resizing, so
  // this one re-measures on every render (writing the same boolean bails out
  // before React re-renders, so it can't loop)...
  React.useLayoutEffect(measure)

  // ...and the box can resize without a render — dragging a column border
  // never re-renders the body cells — so this one watches it, and is set up
  // once instead of being torn down and rebuilt for every cell on every
  // render of the table.
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return { ref, truncated }
}

interface TableProps extends React.ComponentProps<"table"> {
  /** `table-layout: fixed`. Required for the spec's truncation and column
   * resizing to mean anything — with the default `auto` layout a cell grows
   * to fit its content instead of clipping it. */
  fixed?: boolean
  /**
   * Sticky header: "Шапка (закрепляется всегда при достижении верха
   * вьюпорта, открепляется вместе с достижением низа блока данных)".
   *
   * It sticks to the top of the table's *own* scrolling viewport, so pair it
   * with a height on `containerClassName` (e.g. `max-h-[480px]`). That is
   * not a shortcut: a box that scrolls horizontally is a scroll container on
   * both axes by CSS rule (`overflow-x: auto` forces `overflow-y` off
   * `visible`), which scopes `position: sticky` inside it — the header
   * physically cannot pin to the page viewport while the same box provides
   * the spec's horizontal scrolling. `--table-header-top` offsets the row
   * below a fixed site header.
   */
  stickyHeader?: boolean
  className?: string
  /** Styles the horizontally scrolling viewport that wraps the table. */
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

function Table({
  className,
  fixed = false,
  stickyHeader = false,
  containerClassName,
  containerRef,
  ...props
}: TableProps) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(containerRef, () => innerRef.current as HTMLDivElement)

  const scrollState = useHorizontalScrollState(innerRef)

  return (
    <TableScrollContext.Provider value={scrollState}>
      {/* Обёртка нужна полосе прокрутки: она стоит РЯДОМ с прокручиваемым
          узлом, а не внутри него (внутри она ехала бы вместе с колонками), и
          показывается по наведению на всю зону таблицы — отсюда `group`. */}
      <div data-slot="table-root" className="group/table relative">
        <div
          ref={innerRef}
          data-slot="table-container"
          // `themed-scrollbar` оставлен ради ВЕРТИКАЛЬНОЙ полосы (её растит
          // липкая шапка с ограниченной высотой контейнера); горизонтальная
          // нативная погашена в index.css — вместо неё своя, см.
          // `scrollbar.tsx`.
          className={cn(
            "themed-scrollbar w-full overflow-x-auto",
            containerClassName
          )}
        >
          <table
            data-slot="table"
            data-sticky-header={stickyHeader || undefined}
            className={cn(
              "w-full border-separate border-spacing-0 bg-[var(--table-bg)] text-p2-regular text-[var(--table-fg)]",
              fixed && "table-fixed",
              className
            )}
            {...props}
          />
        </div>
        <TableScrollbar scrollRef={innerRef} />
      </div>
    </TableScrollContext.Provider>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

interface TableRowProps extends React.ComponentProps<"tr"> {
  /** Multi-select fill (the row's checkbox is checked). */
  selected?: boolean
  /** "Added" — a just-created row. The highlight lives 2000ms: 1000ms static
   * then 1000ms fading out, per "Добавление новой строки/строк". */
  added?: boolean
  /** The row navigates to a detail page: enables the Hover/Active fills and
   * the pointer cursor. Without it the spec keeps the row inert. */
  clickable?: boolean
}

function TableRow({
  className,
  selected,
  added,
  clickable,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected || undefined}
      data-added={added || undefined}
      data-clickable={clickable || undefined}
      className={cn(
        // Every row carries an explicit fill rather than inheriting the
        // table's: pinned cells paint themselves with `bg-inherit`, so a
        // transparent row would let the scrolling columns show through them.
        "bg-[var(--table-bg)] transition-colors",
        // Выбранная чекбоксом строка — Grey 124. Состояния `Selected` в сете
        // «line fill» нет: цвет снят с макетов режима множественного выбора.
        selected
          ? "bg-[var(--table-row-active-bg)]"
          : added
            ? "animate-[table-row-added_2000ms_linear_forwards]"
            : undefined,
        // ⚠️ Ховер ПЕРЕБИВАЕТ выбор и делает выбранную строку СВЕТЛЕЕ:
        // покой 124 → наведение 114 → нажатие снова 124. Клиент должен
        // видеть реакцию строки и понимать, что провалиться можно и при
        // включённом чекбоксе, — поэтому `selected` тут больше не гасит
        // ховер. Работает это только благодаря порядку каскада: Tailwind
        // печатает вариантные утилиты после безвариантных, так что
        // `hover:` бьёт голый `bg-*` при равной специфичности, а `active:`
        // бьёт `hover:` и возвращает строку в 124.
        clickable &&
          "cursor-pointer hover:bg-[var(--table-row-hover-bg)] active:bg-[var(--table-row-active-bg)]",
        // "Hover, работа с кнопкой действий (изменения от 19.12.2025):
        // Строка также меняет цвет — для понимания пользователя, к какой
        // именно строке относятся раскрытые действия." The fill has to
        // outlive the cursor, which moves off the row and onto the portalled
        // menu, so it keys off the trigger's own open state rather than
        // `:hover`. Independent of `clickable`: this is about attributing the
        // open menu, not about navigating.
        "has-[[data-popup-open]]:bg-[var(--table-row-hover-bg)]",
        className
      )}
      {...props}
    />
  )
}

// Shared geometry for the sticky/pinned cells. The `edge` cell of a block
// carries the divider line that marks the block off, and only while the
// scroll position actually hides content behind it.
//
// ⚠️ Here used to sit the kit's Universal shadow — the primitive Figma
// actually draws (`Left Shadow` 3805:19990 / `Right Shadow` 3805:19991,
// drop-shadow #8B99A93D 0/4/12). It is gone on purpose: the product is
// dropping shadow elements, and the pinned block is now marked off by a 1px
// Grey 134 line on its inner side — left block along its right edge, right
// block along its left. The same change is queued for the kit itself, so a
// later pass finding "Figma says shadow" should NOT put it back.
function usePinPresentation<T extends HTMLTableCellElement>(
  pin: TablePin | undefined,
  header: boolean
) {
  const { ref, offset, edge } = usePinnedCell<T>(pin)
  const { scrolledFromStart, scrolledFromEnd } = useTableScrollState()

  // «Блок реально перекрывает прокручиваемый контент». Отдельно от линии,
  // потому что её рисует только крайняя ячейка блока (`edge`), а вот
  // собственная непрозрачная заливка нужна всем ячейкам блока.
  const covers =
    (pin === "left" && scrolledFromStart) ||
    (pin === "right" && scrolledFromEnd)

  const style: React.CSSProperties | undefined = pin
    ? pin === "left"
      ? { left: offset }
      : { right: offset }
    : undefined

  // Header cells sit above body cells, and a pinned header cell above the
  // rest of the header — otherwise the scrolling columns slide over the
  // corner where the two stickies meet.
  // Note: no background here on purpose — a pinned cell must be opaque, but
  // *which* opaque fill differs (the header keeps white, a body cell takes
  // the row's own Line Fill), so each call site appends its own after this
  // class string.
  const className = pin
    ? cn("relative sticky", header ? "z-30" : "z-10")
    : header
      ? "relative z-20"
      : "relative"

  // A real element rather than `::after`: `<th>` already spends both of its
  // pseudo-elements on the header's bottom rule and the column divider.
  // Absolutely positioned so it can't take a pixel off the block's width the
  // way a `border` would — that pixel is exactly what would let the header
  // drift out of alignment with the body.
  const divider =
    pin && edge ? (
      <span
        aria-hidden="true"
        data-slot="table-pin-divider"
        className={cn(
          "pointer-events-none absolute inset-y-0 z-[1] w-px bg-[var(--table-pin-divider)] transition-opacity duration-150 ease-out",
          pin === "left" ? "right-0" : "left-0",
          covers ? "opacity-100" : "opacity-0"
        )}
      />
    ) : null

  return { ref, style, className, covers, divider }
}

type TableHeadCellType =
  | "checkbox"
  | "collapse"
  | "subtitle-left"
  | "subtitle-right"
  | "icon"
  | "button"
  | "filler"

interface TableHeadCellProps
  extends Omit<React.ComponentProps<"th">, "children" | "onSelect"> {
  type?: TableHeadCellType
  children?: React.ReactNode
  /** "Show Sort" — renders the ⇅ toggle next to Subtitle Left/Right text. */
  sortable?: boolean
  /**
   * Which way this column is currently sorted. Set it (i.e. non-`null`) and
   * the cell renders the spec's Active state: dark title text plus the
   * matching chevron of the sort icon darkened. `null` is Default/Hover.
   *
   * ⚠️ Отдельного состояния `Active` у ячейки шапки нет намеренно, хотя в
   * ките оно есть третьим значением `State`: активность — это и есть
   * `sortDirection !== null`. «Active без отмеченной сортировки» не бывает, и
   * невозможную комбинацию лучше не давать выразить; к тому же у типов
   * Checkbox / Icon / Button подписи нет, а состояние меняет только её цвет.
   */
  sortDirection?: "asc" | "desc" | null
  /**
   * ⚠️ **Круг сортировки замкнут на двух направлениях**: «нет → по
   * возрастанию → по убыванию → по возрастанию → …». Нажатием сортировку не
   * сбросить — иначе строки остались бы переставленными, а действующий
   * критерий пропал бы из виду. Состояние живёт у вызывающей стороны, так что
   * это правило нужно соблюсти в обработчике (см. `table-demo.tsx`).
   */
  onSortClick?: () => void
  /** "Show Icon" — an optional leading icon before Subtitle text. */
  icon?: React.ReactNode
  checked?: boolean
  indeterminate?: boolean
  /**
   * ⚠️ Круг чекбокса «выбрать всё»: **пусто → всё, частично → ВСЁ, всё →
   * пусто**. То есть добрать до полного выбора можно из любого состояния, а
   * сбросить — только из полного.
   *
   * Это правка к документации кита («повторное нажатие сбрасывает сразу все
   * выбранные значения»): по букве доки из частичного состояния выбор
   * обнулялся бы, и набранную вручную выборку можно было бы потерять одним
   * кликом. Выбор живёт у вызывающей стороны, поэтому круг соблюдает она.
   */
  onCheckedChange?: (checked: boolean) => void
  menu?: React.ReactNode
  /**
   * Collapse-all control ("Сворачивание/разворачивание всех строк"). Chevron
   * down = everything collapsed to the first level, up = fully expanded.
   *
   * The spec bars this column from the other two header affordances: "в
   * таблицах со сворачиванием/разворачиванием не предусмотрена
   * пользовательская сортировка — она невозможна без нарушения
   * вложенностей", and "он также не может менять ширину столбца,
   * идентифицирующего иерархию. Его ширина опредяется в момент
   * проектирования". So `sortable` and `resizable` are ignored here rather
   * than silently rendering controls the design forbids.
   */
  collapsible?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Drag the right border to resize the column ("при наведении на правую
   * границу ячейки курсор меняется на вертикальную черту с двунаправленной
   * стрелкой"). Checkbox and Collapse columns are excluded by the spec. */
  resizable?: boolean
  /** Column width in px. Uncontrolled when only `defaultWidth` is given. */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  /** "Минимальная ширина столбцов — 48px." */
  minWidth?: number
  pin?: TablePin
}

const MIN_COLUMN_WIDTH = 48

// Fixed widths for the control columns, straight off their Figma masters:
// the Checkbox title cell is 48 wide (pl-8 + 24 + gap-15 + the 1px rule),
// Collapse and Icon are 32 (px-8 around a 16px glyph), and Button/Filler are
// the 52px of the pinned action block ("столбец ... имеет строго
// фиксированную ширину"). Content can't establish these under
// `table-layout: fixed`, where only the first row's declared widths count —
// without them the checkbox column collapses to its padding.
const CONTROL_COLUMN_WIDTH: Partial<
  Record<TableHeadCellType, number>
> = {
  checkbox: 48,
  collapse: 32,
  icon: 32,
  button: 52,
  filler: 52,
}

function TableHeadCell({
  className,
  type = "subtitle-left",
  children,
  sortable = false,
  sortDirection = null,
  onSortClick,
  icon,
  checked,
  indeterminate,
  onCheckedChange,
  menu,
  collapsible = false,
  expanded = true,
  onExpandedChange,
  resizable = false,
  width,
  defaultWidth,
  onWidthChange,
  minWidth = MIN_COLUMN_WIDTH,
  pin,
  style,
  ...props
}: TableHeadCellProps) {
  const isSubtitle = type === "subtitle-left" || type === "subtitle-right"
  const isRight = type === "subtitle-right"

  // The hierarchy column is neither sortable nor resizable — see the
  // `collapsible` prop docs for the two spec lines that rule both out.
  const canSort = sortable && !collapsible
  const canResize = resizable && !collapsible

  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(defaultWidth)
  const resolvedWidth =
    width ?? uncontrolledWidth ?? CONTROL_COLUMN_WIDTH[type]

  const pinned = usePinPresentation<HTMLTableHeaderCellElement>(pin, true)
  const title = useTruncated<HTMLSpanElement>()

  // Per-type vertical padding, pixel-confirmed against the spec's own
  // "ELK / table-title-cell" master: Subtitle is py-[14px] (the default
  // below), Checkbox py-3 (12px), Icon and Collapse py-4 (16px around their
  // 16/24px box) and Filler py-3 around a bare 24px divider. Button
  // collapses to a uniform p-2 (8px) since it wraps its own 32px `icon-sm`
  // Button already. This matters beyond pixel-pedantry: a `<tr>`'s rendered
  // height is the max over its cells' own boxes, so one wrong type stretches
  // the whole header row past the spec's 48px.
  const headCellPadding =
    type === "checkbox"
      ? "py-3"
      : type === "icon" || type === "collapse"
        ? "py-4"
        : type === "button"
          ? "p-2"
          : type === "filler"
            ? "py-3"
            : "py-[14px]"
  // `p-2` on Button already sets the horizontal padding.

  // Column divider — a 1px × 24px rounded rule at the cell's right edge,
  // drawn by `ELK / table-title-cell` itself for every titled type as well
  // as the Filler that sits above the pinned action block ("Филлер
  // размещается над правым закрепленным блоком действий"). Icon and Button
  // have none. It is a pseudo-element rather than a real node so it can't
  // disturb the cell's flex/inline layout.
  const hasDivider = type === "checkbox" || isSubtitle || type === "filler"

  // ⚠️ Асимметрия из кита, и это НЕ промах: справа 7, потому что оставшийся
  // пиксель забирает разделитель колонок — визуально поля одинаковые по 8.
  // Действует только там, где разделитель действительно есть и где ячейку не
  // прижимает закреп (у закрепа свои поля: слева 8, справа 0).
  const headPaddingX =
    type === "button"
      ? undefined // `p-2` ниже задаёт горизонталь сам
      : pin
        ? cellPaddingXClass(pin, false)
        : hasDivider
          ? "pl-2 pr-[7px]"
          : "px-2"

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const cell = event.currentTarget.parentElement as HTMLElement | null
    if (!cell) return

    const startX = event.clientX
    const startWidth = cell.offsetWidth
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)

    const onMove = (moveEvent: PointerEvent) => {
      const next = Math.max(minWidth, startWidth + moveEvent.clientX - startX)
      if (width === undefined) setUncontrolledWidth(next)
      onWidthChange?.(next)
    }
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
      handle.releasePointerCapture(event.pointerId)
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
  }

  return (
    <th
      ref={pinned.ref}
      data-slot="table-head-cell"
      data-type={type}
      data-pin={pin}
      scope="col"
      style={{ ...style, ...pinned.style, width: resolvedWidth }}
      className={cn(
        headCellPadding,
        headPaddingX,
        "font-medium",
        // The header's bottom rule is drawn per cell (`border-b` on
        // `ELK / table-title-cell`) so it stays put under sticky cells — but
        // as a pseudo-element, not a real border. Figma strokes frames on the
        // *inside*, so the rule lives within the cell's 48px rather than
        // adding a 49th pixel: measured on the canonical renders (the header
        // rule is the last pixel row of the 48px header in both node
        // 70279:10368 and node 70279:7390).
        "relative before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-[var(--table-divider)] before:content-['']",
        hasDivider &&
          "after:absolute after:top-1/2 after:right-0 after:h-6 after:w-px after:-translate-y-1/2 after:rounded-[1px] after:bg-[var(--table-divider)] after:content-['']",
        type === "checkbox" ||
          type === "icon" ||
          type === "button" ||
          type === "collapse" ||
          type === "filler"
          ? "w-px text-center"
          : isRight
            ? "text-right"
            : "text-left",
        pinned.className,
        // The header is always opaque white — `bg-inherit` would resolve to
        // the (transparent) `<tr>` and let the scrolling columns slide under
        // a pinned or sticky header cell.
        "bg-[var(--table-bg)]",
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать все строки"
        />
      )}

      {/* `flex`, not `inline-flex` — an inline-level box here would stay in
          the table cell's inline formatting context and inherit a 20px
          line-height "strut" from the table's text-sm, forcing the 16px
          icon's effective box up to 20px regardless of the cell's own
          declared padding. `flex` makes it a block box, which isn't subject
          to the strut. */}
      {type === "icon" && (
        <span className="flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "collapse" && (
        <TableCollapseToggle
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          label={expanded ? "Свернуть все строки" : "Развернуть все строки"}
        />
      )}

      {type === "button" && menu && (
        <TableRowMenu menu={menu} label="Настроить таблицу" />
      )}

      {/* Filler is deliberately empty — "соответствующие ячейки строк не
          содержат общих названий или групповых действий" — it exists only to
          carry the header's divider and bottom rule over the pinned action
          column. */}

      {isSubtitle && (
        <span
          className={cn("flex items-center gap-2", isRight && "justify-end")}
        >
          {collapsible && (
            <TableCollapseToggle
              expanded={expanded}
              onExpandedChange={onExpandedChange}
              label={expanded ? "Свернуть все строки" : "Развернуть все строки"}
            />
          )}
          {canSort ? (
            <button
              type="button"
              onClick={onSortClick}
              data-slot="table-sort"
              className={cn(
                // The colour shift alone is not a focus indicator — it is the
              // same darkening the cell already does on hover — so the sort
              // control carries the kit's standard ring as well.
              "flex min-w-0 cursor-pointer items-center gap-2 rounded-[4px] outline-none transition-colors hover:text-[var(--table-fg)] focus-visible:text-[var(--table-fg)] focus-visible:ring-3 focus-visible:ring-ring/50",
                isRight ? "justify-end" : "flex-1",
                sortDirection
                  ? "text-[var(--table-fg)]"
                  : "text-[var(--table-description-fg)]"
              )}
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              {/* "Текст обрезается многоточием / Индикатор сортировки
                  фиксируется на расстоянии 8px от усечённого текста /
                  Индикатор всегда остаётся видимым, независимо от длины
                  текста" — so the label truncates and the glyph never
                  shrinks. */}
              <Tooltip content={children} disabled={!title.truncated}>
                <span ref={title.ref} className="truncate">
                  {children}
                </span>
              </Tooltip>
              {/* 16px, gap 8 — `icon / sort` is a full-size glyph in the
                  spec. Its own two chevrons stay muted until the column is
                  actually sorted, which is why Hover only darkens the *text*
                  while Active darkens text + one chevron. */}
              <ChevronsUpDown
                aria-hidden="true"
                sort={sortDirection ?? "none"}
                className="size-4 shrink-0"
              />
            </button>
          ) : (
            <span
              className={cn(
                "flex min-w-0 items-center gap-2 text-[var(--table-description-fg)]",
                isRight ? "justify-end" : "flex-1"
              )}
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              <Tooltip content={children} disabled={!title.truncated}>
                <span ref={title.ref} className="truncate">
                  {children}
                </span>
              </Tooltip>
            </span>
          )}
        </span>
      )}

      {canResize && (
        // Sits on the column border itself, half in each neighbour, so the
        // cursor flips as soon as it touches the line. 9px of grab zone: the
        // line is 1px and a zone narrower than this is genuinely hard to hit.
        <span
          role="separator"
          aria-orientation="vertical"
          data-slot="table-resize-handle"
          onPointerDown={startResize}
          className="absolute inset-y-0 -right-[4.5px] z-10 w-[9px] cursor-col-resize touch-none select-none"
        />
      )}

      {pinned.divider}
    </th>
  )
}

// The collapse/expand chevron shared by the header ("свернуть весь блок до
// строк первого уровня") and by every parent row. The spec draws its hit
// area as a full-height band around the 16px glyph ("Кликабельная область
// ограничена белой зоной"), which a pseudo-element gives without changing
// the cell's own flex layout.
//
// Сквозное правило проекта: **свёрнуто — шеврон вниз, развёрнуто — вверх**,
// вправо он не смотрит никогда, даже если так нарисовано в ките
// (документация таблиц описывала свёрнутую строку данных как «шеврон
// вправо» — расхождение закрыто в пользу «вниз/вверх», внутри одной таблицы
// двух логик быть не может).
//
// Техника тоже часть правила, иначе компоненты кита разъедутся:
//  • иконка ОДНА и переворачивается, а не подменяется на вторую — подмена не
//    даёт плавного переворота, а он здесь читается как одно событие;
//  • крутится ИКОНКА, а не кнопка: коробка кнопки шире глифа, и поворот
//    кнопки увёл бы шеврон в сторону;
//  • состояние берётся из `aria-expanded` — второго источника правды не
//    заводим.
function TableCollapseToggle({
  expanded,
  onExpandedChange,
  label,
}: {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      data-slot="table-collapse-toggle"
      aria-expanded={expanded}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onExpandedChange?.(!expanded)
      }}
      // The glyph is already at full contrast, so a colour change would be
      // no focus indicator at all — it gets the kit's ring like every other
      // control in the table.
      className="group/collapse relative flex shrink-0 cursor-pointer rounded-[4px] text-[var(--table-fg)] outline-none before:absolute before:-inset-x-2 before:-inset-y-4 before:content-[''] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ChevronUp
        aria-hidden="true"
        className="size-4 transition-transform duration-150 ease-out group-aria-[expanded=false]/collapse:rotate-180"
      />
    </button>
  )
}

// The "..." action trigger for Title Cell's Button type — a Menu built the
// same way as `ButtonMenuOverflow`, at icon-sm size and `secondary-white`
// (bg white/hover Grey114/active Grey106, pixel-confirmed against the spec's
// own Default/Hover/Active kebab swatch — no bespoke "ghost" button variant
// needed). Row actions use `SelectionButton` instead, which the spec names
// directly ("используя белый компонент Selection Button").
function TableRowMenu({
  menu,
  label = "Открыть меню строки",
}: {
  menu: React.ReactNode
  label?: string
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <Button
            variant="secondary-white"
            size="sm"
            icon={Ellipsis}
            iconPosition="only"
            aria-label={label}
          />
        }
      />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <MenuPrimitive.Popup
            data-slot="table-row-menu-content"
            render={<Dropdown className="min-w-48 overflow-hidden" />}
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

type TableCellType =
  | "checkbox"
  | "collapse"
  | "icon"
  | "text"
  | "number"
  | "tag"
  | "button"

/**
 * Ставит каждую цифру в коробку одинаковой ширины — синтез табличных цифр.
 *
 * ⚠️ Нужен потому, что **в Object Sans табличных цифр нет вовсе**: фичи
 * `tnum` в шрифте не существует (проверено по всем поставляемым начертаниям
 * в `src/assets/Object Sans/`), а ширины цифр разные. Браузер синтезировать
 * их не умеет, поэтому `font-variant-numeric: tabular-nums` в этом шрифте —
 * пустая строка, и «запятая под запятой» из него не получается. Второе
 * шрифтовое семейство запрещено правилом проекта, значит одинаковую ширину
 * даёт сама ячейка: цифра встаёт в коробку `1ch` (`ch` — это как раз ширина
 * нуля, самой широкой цифры).
 *
 * Правило `tabular-nums` в CSS при этом оставлено: появится фича в шрифте —
 * заработает без правок здесь.
 *
 * Разряды, запятая и минус ширину не меняют — они одинаковы во всех строках
 * колонки, и трогать их не нужно. Не строка — возвращается как есть:
 * разбирать чужие узлы компонент не должен.
 */
function withTabularDigits(node: React.ReactNode): React.ReactNode {
  if (typeof node !== "string" && typeof node !== "number") return node
  const text = String(node)
  if (!/\d/.test(text)) return node
  return Array.from(text).map((char, index) =>
    char >= "0" && char <= "9" ? (
      <span key={index} className="inline-block w-[1ch] text-center">
        {char}
      </span>
    ) : (
      char
    )
  )
}

/** Неразрывный пробел — настоящим символом, а не отступом: так знак не
 * отрывается от числа переносом и копируется вместе с ним («1 200,00 ₽»). */
const NBSP = "\u00A0"

interface TableCellProps
  extends Omit<React.ComponentProps<"td">, "children" | "onSelect"> {
  type?: TableCellType
  children?: React.ReactNode
  /** "Show Description" — a muted second line under Text/Number cells. */
  description?: React.ReactNode
  icon?: React.ReactNode
  tagColor?: TagColor
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Row actions, rendered as the spec's white `SelectionButton`. */
  actions?: SelectionButtonItem[]
  /** The single-action form: "Для строк с единственным действием допускается
   * замена на кнопку с пиктограммой и обязательной текстовой подсказкой при
   * наведении, поясняющей её назначение" — hence `label` is required, it is
   * both the tooltip and the accessible name. Wins over `actions`. */
  action?: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
    onClick?: () => void
  }
  /** Escape hatch for a bespoke popup (`ButtonMenuOverflowItem` children).
   * `actions` is the spec-shaped API and wins when both are given. */
  menu?: React.ReactNode
  align?: "left" | "right"
  /** Nesting depth, 0-based: "С каждым уровнем вложенности контент
   * сдвигвается вправо на 16px". */
  level?: number
  /** Renders the row's collapse chevron before the content. Omit it on the
   * deepest level — the spec keeps the indent but drops the control. */
  expandable?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Colours a Number cell's value: incoming money is the kit's success
   * green ("+31 922 980 133 515,05 ₽" in the spec's own sample). */
  tone?: "default" | "positive"
  /**
   * Знак после значения: `₽`, `$`, `%`, `шт.` Стоит **в ячейке через
   * неразрывный пробел после числа**, а не в заголовке столбца: в одной
   * колонке значения бывают в разных единицах, и заголовок «Сумма, ₽» это
   * выразить не может. Заголовок остаётся чистым — «Сумма».
   *
   * Пустая строка — «у этого значения знака нет», но место под него
   * сохраняется (см. `unitVariants`), и разряды не разъезжаются.
   */
  unit?: string
  /**
   * Все знаки, встречающиеся в КОЛОНКЕ. Когда их больше одного, слот знака
   * резервирует ширину по самому широкому: невидимые двойники лежат в той же
   * клетке грида, что и видимый, и растягивают её по фактической ширине
   * глифов. Иначе строка с «шт.» сдвинула бы своё число влево относительно
   * строки с «₽» и «запятая под запятой» сломалась бы.
   *
   * ⚠️ Считать ширину в `ch` здесь нельзя: «₽» и «$» одной длины, но разной
   * ширины. Заполняет вызывающая сторона — ячейка своей колонки не видит.
   */
  unitVariants?: string[]
  pin?: TablePin
}

const NESTING_INDENT = 16

function TableCell({
  className,
  type = "text",
  children,
  description,
  icon,
  tagColor = "green",
  checked,
  onCheckedChange,
  actions,
  action,
  menu,
  align = "left",
  level = 0,
  expandable = false,
  expanded = true,
  onExpandedChange,
  tone = "default",
  unit,
  unitVariants,
  pin,
  style,
  ...props
}: TableCellProps) {
  const pinned = usePinPresentation<HTMLTableDataCellElement>(pin, false)
  const value = useTruncated<HTMLSpanElement>()
  const sub = useTruncated<HTMLSpanElement>()
  const tag = useTruncated<HTMLSpanElement>()

  // Like the header, each Cell type carries its own vertical padding so that
  // every one of them lands on the spec's 52px row: Checkbox py-14 around a
  // 24px box, Icon/Collapse py-18 around 16px, Text py-16 around a 20px
  // line, Tag py-15 around the 22px tag and Button p-10 around the 32px icon
  // button (get_design_context on `ELK / table-cell`). A `<tr>` is as tall
  // as its tallest cell, so a single wrong type stretches the whole row.
  const cellPadding =
    type === "checkbox"
      ? "py-[14px] pl-2 pr-4"
      : type === "icon" || type === "collapse"
        ? "py-[18px]"
        : type === "tag"
          ? "py-[15px]"
          : type === "button"
            ? "p-[10px]"
            : "py-4"

  const isRight = align === "right" || type === "number"

  // Слот знака. Знака нет вовсе (`unit === undefined`) — нет и слота, а
  // пустая ячейка знака не получает никогда: «₽» в одиночестве читается как
  // значение, которого нет, и выравнивать в пустой строке нечего.
  const unitList = React.useMemo(
    () =>
      unit === undefined
        ? []
        : Array.from(new Set([unit, ...(unitVariants ?? [])])).filter(Boolean),
    [unit, unitVariants]
  )
  const hasValue = children !== undefined && children !== null && children !== ""

  let unitSlot: React.ReactNode = null
  if (unit !== undefined && unitList.length > 0 && hasValue) {
    unitSlot =
      unitList.length === 1 ? (
        // Один знак на колонку (обычный случай) — просто текст в потоке.
        // Резервировать нечего, а коробка со своим `display` вставила бы в
        // выделение перенос строки: значение копировалось бы как
        // «1 250 000,00\n ₽».
        <span data-slot="table-cell-unit">{NBSP + unit}</span>
      ) : (
        // Разные знаки в одной колонке — вот тут коробка нужна: видимый
        // вариант и невидимые двойники лежат в ОДНОЙ клетке грида, и она
        // получает ширину самого широкого глифа. Двойники держат ширину, но
        // не читаются ни глазом, ни скринридером (`invisible` = `visibility:
        // hidden` убирает узел и из дерева доступности).
        <span
          data-slot="table-cell-unit"
          className="inline-grid grid-cols-1 grid-rows-1 justify-items-start align-baseline"
        >
          {unitList.map((variant) => (
            <span
              key={variant}
              className={cn(
                "col-start-1 row-start-1 whitespace-pre",
                variant !== unit && "invisible"
              )}
              aria-hidden={variant === unit ? undefined : true}
            >
              {NBSP + variant}
            </span>
          ))}
        </span>
      )
  }

  return (
    <td
      ref={pinned.ref}
      data-slot="table-cell"
      data-type={type}
      data-pin={pin}
      style={{ ...style, ...pinned.style }}
      className={cn(
        cellPadding,
        cellPaddingXClass(pin, type === "button" || type === "checkbox"),
        // No rule between data rows. Verified at 1:1 against two independent
        // canonical renders (nodes 70279:7390 and 70279:10368): scanning an
        // empty column top-to-bottom finds exactly two #DEDEDE lines — the
        // one under the table top and the header's own — and none between
        // rows, which are separated by whitespace alone. An earlier pass had
        // put a divider under every row.
        type === "checkbox" ||
          type === "icon" ||
          type === "button" ||
          type === "collapse"
          ? "w-px text-center"
          : isRight
            ? "text-right"
            : "text-left",
        pinned.className,
        // ⚠️ Заливка строки идёт ВО ВСЮ ширину, включая правый закреп с
        // действиями: закреплённая ячейка — часть строки и наследует её Line
        // Fill. Непрозрачность закрепу при этом нужна всегда, иначе на
        // прокрутке сквозь него просвечивают подвижные ячейки, — её и даёт
        // `inherit` от непрозрачной строки.
        //
        // Заход в обратную сторону (правый закреп держит белый, как нарисован
        // на макете множественного выбора) откачен: у кнопки `Secondary
        // (White)` ховер и нажатие — Grey 114 / Grey 124, то есть РОВНО цвета
        // заливки строки, и кнопка исчезала ровно в момент наведения на неё.
        // Читаемость на залитой строке даёт сама кнопка — она остаётся белой
        // (правило в index.css), а не подложка под ней.
        pin ? "bg-inherit" : undefined,
        className
      )}
      {...props}
    >
      {type === "checkbox" && (
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label="Выбрать строку"
        />
      )}

      {/* See the header's note on `flex` vs `inline-flex` and the 20px
          line-height strut. */}
      {type === "icon" && (
        <span className="flex text-[var(--table-fg)]" aria-hidden="true">
          {icon}
        </span>
      )}

      {type === "collapse" && (
        <span
          className="flex"
          style={level ? { paddingLeft: level * NESTING_INDENT } : undefined}
        >
          {expandable && (
            <TableCollapseToggle
              expanded={expanded}
              onExpandedChange={onExpandedChange}
              label={expanded ? "Свернуть строку" : "Развернуть строку"}
            />
          )}
        </span>
      )}

      {(type === "text" || type === "number") && (
        <span
          className={cn(
            "flex min-w-0 items-center gap-2",
            isRight && "justify-end"
          )}
          style={
            level && type === "text"
              ? { paddingLeft: level * NESTING_INDENT }
              : undefined
          }
        >
          {expandable && type === "text" && (
            <TableCollapseToggle
              expanded={expanded}
              onExpandedChange={onExpandedChange}
              label={expanded ? "Свернуть строку" : "Развернуть строку"}
            />
          )}
          {/* One tooltip for the whole cell, not one per line: the spec
              anchors a single `ELK / tooltip & hint` over the cell and fills
              it with the value on the first line (Medium) and the
              description on the second (Regular) — see node 70279:7012,
              whose hint reads "Длинный текст в ячейке / Длинное пояснение в
              ячейке". It opens when *either* line is clipped. */}
          <Tooltip
            content={
              description ? (
                <span className="flex flex-col gap-2">
                  <span className="text-p3-medium">{children}</span>
                  <span>{description}</span>
                </span>
              ) : (
                children
              )
            }
            disabled={!value.truncated && !sub.truncated}
          >
            <span
              className={cn("flex min-w-0 flex-col", isRight && "items-end")}
              data-truncated={value.truncated || sub.truncated || undefined}
            >
              <span
                ref={value.ref}
                className={cn(
                  "truncate font-medium",
                  // "Ячейка для финансовых показателей использует
                  // моноширинный шрифт для всех символов, обеспечивая
                  // выравнивание чисел по разрядам («запятая под запятой»)".
                  // Второе шрифтовое семейство запрещено правилом проекта, а
                  // `tabular-nums` в Object Sans ничего не даёт — фичи `tnum`
                  // в шрифте нет вовсе, и браузер табличные цифры не
                  // синтезирует. Выравнивание даёт `withTabularDigits`;
                  // правило оставлено на будущее, см. его JSDoc.
                  type === "number" && "tabular-nums",
                  tone === "positive"
                    ? "text-[var(--table-number-positive-fg)]"
                    : "text-[var(--table-fg)]"
                )}
              >
                {type === "number" ? withTabularDigits(children) : children}
                {unitSlot}
              </span>
              {/* Round-2 font-weight audit: confirmed Object Sans Regular
                  against get_design_context (node 10623:48132), not a gap. */}
              {description && (
                <span
                  ref={sub.ref}
                  className={cn(
                    "truncate text-p3-regular text-[var(--table-description-fg)]",
                    type === "number" && "tabular-nums"
                  )}
                >
                  {description}
                </span>
              )}
            </span>
          </Tooltip>
        </span>
      )}

      {/* The Tag itself is `w-fit whitespace-nowrap` and would spill out of a
          narrow column, so the spec wraps it in a clipping box (node
          70279:7063 is `overflow-clip w-[40px]`) and hangs a tooltip with the
          full status off the cell. Tag's own spec says it never shows a
          tooltip — that hint belongs to the cell, not to the Tag. */}
      {type === "tag" && (
        <Tooltip content={children} disabled={!tag.truncated}>
          <span
            className="flex min-w-0 overflow-hidden"
            data-truncated={tag.truncated || undefined}
          >
            <Tag color={tagColor} className="min-w-0">
              <span ref={tag.ref} className="truncate">
                {children}
              </span>
            </Tag>
          </span>
        </Tooltip>
      )}

      {type === "button" &&
        (action ? (
          <Tooltip content={action.label}>
            <Button
              variant="secondary-white"
              size="sm"
              icon={action.icon}
              iconPosition="only"
              aria-label={action.label}
              onClick={(event) => {
                event.stopPropagation()
                action.onClick?.()
              }}
            />
          </Tooltip>
        ) : actions && actions.length > 0 ? (
          <SelectionButton
            items={actions}
            size="sm"
            direction="down-left"
            triggerLabel="Действия со строкой"
          />
        ) : (
          menu && <TableRowMenu menu={menu} />
        ))}

      {pinned.divider}
    </td>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
  MIN_COLUMN_WIDTH,
  NESTING_INDENT,
}
export type {
  TableProps,
  TableRowProps,
  TableHeadCellProps,
  TableCellProps,
  TableHeadCellType,
  TableCellType,
}
