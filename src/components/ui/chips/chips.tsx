import { ChevronUp, X } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Chips — "Чипсы": a plain, non-interactive pill for a value with an
// optional caption above it.
//
// Chips и Filter — один компонент-сет в Figma («ELK / chips, filter», нода
// 54887:29179) со свойством `Type` на пять значений. Раньше в коде жило
// только `Type=Chips`, а белый и серый вид считались чужими — «см. компонент
// Filter». На деле все пять вариантов это одна и та же коробка
// (`px-16`, радиус 8, значение P1 Medium, gap 8) и отличаются они заливкой,
// наличием строки подписи и шевроном:
//
//   Filter (White)           54887:29180  bg White 101,  hover Grey 106
//   Filter Subtitle (White)  54887:29200  то же + строка подписи сверху
//   Filter (Grey)            54887:29185  bg Grey 109,   hover Grey 106
//   Filter Subtitle (Grey)   54887:29206  то же + строка подписи сверху
//   Chips                    54887:29212  bg Grey 109,   hover Grey 114
//
// State=Active у типов Filter — рамка 2px Blue 223 поверх той же заливки
// (54887:29390), у Type=Chips рамки нет вовсе: там Active это заливка
// Grey 114, та же, что и на наведении (54887:29218).
//
// `Filter` при этом остаётся отдельным компонентом: он не про вид пилюли, а
// про поведение — поповер, выбранное значение и сброс. Вид его триггера тот
// же самый.
type ChipsType =
  | "chips"
  | "filter-white"
  | "filter-subtitle-white"
  | "filter-grey"
  | "filter-subtitle-grey"

/** Заливки по типу: обычная, на наведении и у выключенного. */
const CHIPS_TONE: Record<ChipsType, { base: string; hover: string }> = {
  chips: {
    base: "bg-[var(--chips-light-bg)]",
    hover: "hover:bg-[var(--chips-light-bg-hover)]",
  },
  "filter-white": {
    base: "bg-[var(--filter-white-bg)]",
    hover: "hover:bg-[var(--filter-white-bg-hover)]",
  },
  "filter-subtitle-white": {
    base: "bg-[var(--filter-white-bg)]",
    hover: "hover:bg-[var(--filter-white-bg-hover)]",
  },
  "filter-grey": {
    base: "bg-[var(--filter-grey-bg)]",
    hover: "hover:bg-[var(--filter-grey-bg-hover)]",
  },
  "filter-subtitle-grey": {
    base: "bg-[var(--filter-grey-bg)]",
    hover: "hover:bg-[var(--filter-grey-bg-hover)]",
  },
}

/** У каких типов есть строка подписи над значением. */
const HAS_SUBTITLE: Record<ChipsType, boolean> = {
  chips: true,
  "filter-white": false,
  "filter-subtitle-white": true,
  "filter-grey": false,
  "filter-subtitle-grey": true,
}

interface ChipsProps {
  children: React.ReactNode
  /** Свойство `Type` компонент-сета. По умолчанию — `Type=Chips`. */
  type?: ChipsType
  subtitle?: React.ReactNode
  /**
   * Свойство `Show Icon` компонент-сета — вспомогательная иконка справа от
   * значения. В макете её ставит дизайнер («иконка круга в компоненте
   * является примером»), поэтому проп принимает готовый узел.
   */
  icon?: React.ReactNode
  /**
   * Свойство `Show Select` — шеврон вызова Dropdown.
   *
   * В макете он есть только у типов `Filter …`: чипса выпадающего списка не
   * вызывает, значение с неё снимается крестиком. Здесь проп не запрещён и
   * для `Type=Chips` — компонент рисует то, что ему дали, — но по умолчанию
   * выключен.
   */
  showSelect?: boolean
  /**
   * Панель, которую открывает эта чипса, СЕЙЧАС РАСКРЫТА.
   *
   * Признак раскрытия обязателен: шеврон не переворачивался не из-за CSS, а
   * потому что компонент просто не знал, что панель открыта. Заодно это
   * `aria-expanded` — без него чипса-триггер молчит о своём состоянии.
   *
   * Сквозное правило кита: свёрнуто — вниз, развёрнуто — ВВЕРХ. Вправо или
   * влево шеврон разворачивания не смотрит никогда, даже там, где в сете он
   * нарисован вбок.
   */
  open?: boolean
  count?: number
  closable?: boolean
  onRemove?: () => void
  /**
   * Состояние `State=Active` — «выбрано».
   *
   * Дизайн-чек №19: раньше его нельзя было ни включить, ни увидеть в
   * матрице. У `Type=Chips` визуально совпадает с hover (в макете это одна и
   * та же заливка grey-114), но это отдельное состояние: оно держится без
   * курсора. У типов `Filter …` — брендовая рамка поверх той же заливки.
   */
  selected?: boolean
  disabled?: boolean
  className?: string
}

function Chips({
  children,
  type = "chips",
  subtitle,
  icon,
  showSelect = false,
  open = false,
  count,
  closable = false,
  onRemove,
  selected = false,
  disabled = false,
  className,
}: ChipsProps) {
  const isFilter = type !== "chips"
  const withSubtitle = HAS_SUBTITLE[type] && Boolean(subtitle)
  const tone = CHIPS_TONE[type]

  return (
    <span
      data-slot="chips"
      data-type={type}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      data-open={(showSelect && open) || undefined}
      aria-expanded={showSelect ? open : undefined}
      className={cn(
        // Design-check #14: rounded-2xl (18px on this kit's custom radius
        // scale) reads as a full pill at this height — the Figma source
        // (ui/chips/chips, filter.svg) uses an 8px corner radius throughout,
        // which is rounded-md here, not rounded-2xl.
        "group/chips inline-flex w-fit max-w-64 flex-col items-start gap-0 rounded-md whitespace-nowrap transition-colors",
        withSubtitle ? "px-4 py-2" : "px-4 py-1.5",
        // Рамка держится постоянной и прозрачной, чтобы коробка не прыгала на
        // 2px при переходе в Active — тот же приём, что у триггера Filter.
        isFilter && "border-2 border-transparent bg-clip-padding",
        isFilter && selected && !disabled && "border-[var(--filter-active-border)]",
        disabled
          ? isFilter
            ? "bg-[var(--filter-disabled-bg)]"
            : "bg-[var(--chips-disabled-bg)]"
          : cn(
              tone.base,
              tone.hover,
              // У Type=Chips выбранное состояние — заливка, а не рамка.
              !isFilter && selected && "bg-[var(--chips-light-bg-hover)]"
            ),
        className
      )}
    >
      {withSubtitle && (
        <span
          className={cn(
            "truncate text-p3-medium",
            disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-subtitle-fg)]"
          )}
        >
          {subtitle}
        </span>
      )}
      <span className="flex w-full min-w-0 items-center gap-2">
        <span
          className={cn(
            "min-w-0 truncate text-p2-medium desktop:text-p1-medium",
            disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-fg)]"
          )}
        >
          {children}
        </span>
        {count !== undefined && (
          <Badge type="counter" value={count} color="light-grey" disabled={disabled} />
        )}
        {icon && (
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 [&_svg]:size-4",
              disabled
                ? "text-[var(--chips-disabled-fg)]"
                : "text-[var(--chips-fg)]"
            )}
          >
            {icon}
          </span>
        )}
        {showSelect && (
          <ChevronUp
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 transition-transform duration-150 ease-out",
              !open && "rotate-180",
              disabled
                ? "text-[var(--chips-disabled-fg)]"
                : "text-[var(--chips-fg)]"
            )}
          />
        )}
        {closable && (
          <button
            type="button"
            aria-label="Удалить"
            disabled={disabled}
            onClick={onRemove}
            className={cn(
              "ml-auto shrink-0 outline-none focus-visible:focus-ring",
              disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-fg)]"
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </span>
    </span>
  )
}

export { Chips }
export type { ChipsProps, ChipsType }
