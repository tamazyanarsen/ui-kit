import * as React from "react"
import { CloseCross } from "@/components/ui/close-cross"

import { cn } from "@/lib/utils"
import { useViewportInsetBottom } from "@/lib/use-viewport-inset-bottom"
import { Button } from "@/components/ui/button"

import { ButtonMenuOverflow } from "./overflow"

// ButtonMenuBlack — "ELK / button menu (black)" (node 700:54288, v1.0.0).
// Figma documents this as its own component, not a variant of the white
// ButtonMenu: while the user has table rows selected, this bar *replaces*
// the white one, and closing it brings the white one back ("Когда
// пользователь выделяет один или несколько элементов таблицы, Button Menu
// заменяется черной панелью").
//
// Geometry off the Button=Three symbol (4270:51380): fixed 72px tall,
// px-24/py-16, top corners rounded 16px only (it sits flush against the
// bottom edge, same as ButtonMenu), actions hugging left with an 8px gap,
// and the info bar + close cross pinned right with a 32px gap.

// Закрепление у нижней края — поведение по умолчанию, а не опция «на
// всякий случай»: в макете так и написано — «Панель всегда закреплена в
// нижней части экрана» (Button Menu) и «Button Menu всегда закрепляется в
// нижней части контентной области и занимает всю ширину» (Black).
//
// Именно `sticky`, а не `fixed`: панель остаётся в потоке и упирается в
// низ своего контейнера, поэтому не наезжает на контент — макет отдельно
// оговаривает «Панель не должна перекрывать кнопку „Показать ещё“».
// `fixed` вырвал бы её из потока и как раз перекрыл бы. Из этого же
// следует, что закрепление работает относительно прокручиваемого
// контейнера: панель прижимается к низу контентной области, а не окна.
const PINNED_CLASS = "sticky bottom-0 z-30"

interface ButtonMenuBlackInfoItem {
  label: React.ReactNode
  value: React.ReactNode
  /** Figma fixes the first ("Выбрано") column at 64px; the rest size to
   * content. Pass a width class here rather than baking one in. */
  className?: string
}

interface ButtonMenuBlackProps extends React.ComponentProps<"div"> {
  /** The "Information (ELK)" bar (node 4008:20902) — label/value pairs
   * describing the current selection. Omit it entirely for the `showBar =
   * false` form. */
  info?: ButtonMenuBlackInfoItem[]
  /** Dismisses the bar. Figma draws this as a bare 24px `icon / close
   * cross`, not an `ELK / button` instance — то есть это ПЛОСКИЙ крестик
   * кита (`CloseCross`), а не кнопка на плашке. */
  onClose?: () => void
  /**
   * Прижимать панель к низу контейнера. По умолчанию включено — она
   * подменяет собой закреплённую белую панель, пока выделены строки
   * таблицы, и стоит там же.
   */
  pinned?: boolean

  /**
   * `Show Button` — кнопка «Выбрать на всех страницах (N)» над полосой.
   *
   * Умолчание снимается с мастера Figma: возможность, спрятанная по
   * умолчанию, просто не находится. Экран, которому массовый выбор за
   * пределы страницы не нужен, гасит её явно.
   *
   * (Сравните со сводкой у Table Top: там умолчание, наоборот, выключено —
   * потому что документация кита прямо называет её дополнительной функцией.)
   */
  showSelectAllPages?: boolean
  /**
   * N в подписи — сколько строк под текущим отбором СО ВСЕХ страниц.
   *
   * Считать это число обязан табличный блок, а не экран: отбор живёт в нём
   * (поиск по всем ячейкам, чипы по колонкам, фильтр вкладок, дерево с
   * детьми), и вторая копия расчёта на странице разошлась бы молча — в
   * кнопке одно число, выбралось бы другое. Готовую функцию отдаёт
   * `selectableRowKeys` из ui/table.
   *
   * Не передано — скобок нет вовсе, а не «(0)».
   */
  selectAllPagesCount?: number
  /**
   * Сколько строк выбрано сейчас. Нужно ровно для одного правила: кнопка
   * ПРОПАДАЕТ, когда выбрано всё, и возвращается, как только снята хотя бы
   * одна галка. Правило живёт в компоненте, а не на экране — оба числа у
   * полосы уже есть, а оставленное экрану оно повторялось бы на каждом
   * реестре.
   */
  selectedCount?: number
  /**
   * Обработчик кнопки. Без него кнопка не рисуется даже при включённом
   * `showSelectAllPages`: она называла бы событие, которого не происходит.
   */
  onSelectAllPages?: () => void
}

function ButtonMenuBlack({
  className,
  info,
  onClose,
  pinned = true,
  showSelectAllPages = true,
  selectAllPagesCount,
  selectedCount,
  onSelectAllPages,
  children,
  ...props
}: ButtonMenuBlackProps) {
  // Same reasoning as ButtonMenu's own sizing pass: the spec draws every
  // action at a uniform 32px pill (px-16/py-6, radius 16 — Button's `sm`).
  //
  // Дизайн-чек №12: вариант тоже форсится, а не подставляется по умолчанию —
  // «для button menu black используются только белые кнопки». Раньше здесь
  // стоял `variant ?? "secondary-white"`, и вызывающий код мог поставить
  // брендовую кнопку на тёмную панель (что и попало в дизайн-чек: «Подписать»
  // была голубой). Брендового акцента на этой панели не существует: она сама
  // и есть акцент.
  const sizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Button) {
      const element = child as React.ReactElement<{
        size?: string
        variant?: string
      }>
      return React.cloneElement(element, {
        size: "sm",
        variant: "secondary-white",
      })
    }
    // Меню «ещё» — такая же кнопка панели, значит тоже белая и 32px.
    if (React.isValidElement(child) && child.type === ButtonMenuOverflow) {
      return React.cloneElement(child as React.ReactElement<{ tone?: "light" | "dark" }>, {
        tone: "dark",
      })
    }
    return child
  })

  // Пока панель закреплена, она публикует занятую высоту в
  // `--viewport-inset-bottom`: горизонтальная полоса прокрутки таблицы липнет
  // к низу СВОБОДНОЙ части вьюпорта, а не к кромке экрана, — иначе она
  // уходила бы под панель ровно тогда, когда таблицей активно пользуются.
  // ⚠️ Занятый низ вьюпорта — это СПЛОШНАЯ ПОЛОСА, а не габарит блока.
  // Между кнопкой и панелью прозрачный зазор 32, и липкая полоса прокрутки
  // таблицы (8px) помещается в нём целиком. Меряя блок целиком, мы отрывали
  // полосу прокрутки от панели на 64 и подвешивали её в пустоте — поэтому
  // ref висит на ПАНЕЛИ, а не на внешнем узле.
  const ref = React.useRef<HTMLDivElement>(null)
  useViewportInsetBottom(ref, pinned)

  // Кнопка пропадает, когда выбрано всё, и возвращается, как только снята
  // хотя бы одна галка.
  const allSelected =
    selectAllPagesCount !== undefined &&
    selectedCount !== undefined &&
    selectedCount >= selectAllPagesCount
  const withSelectAll = showSelectAllPages && !!onSelectAllPages && !allSelected

  const panel = (
    <div
      ref={ref}
      data-slot="button-menu-black"
      data-pinned={pinned || undefined}
      className={cn(
        "flex max-h-[72px] min-h-[72px] w-full items-center justify-between rounded-tl-[16px] rounded-tr-[16px] bg-[var(--button-menu-black-bg)] px-6 py-4",
        // Приём указателя возвращается панели: внешний узел его не
        // принимает (см. ниже).
        withSelectAll && "pointer-events-auto",
        pinned && !withSelectAll && PINNED_CLASS,
        className
      )}
      {...props}
    >
      <div
        data-slot="button-menu-black-actions"
        className="flex shrink-0 items-start gap-2"
      >
        {sizedChildren}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-8">
        {info && info.length > 0 && (
          <div
            data-slot="button-menu-black-info"
            className="flex items-center gap-8 text-p2-medium"
          >
            {info.map((item, index) => (
              <div
                key={index}
                className={cn("flex flex-col items-start", item.className)}
              >
                <span className="text-[var(--button-menu-black-muted-fg)]">
                  {item.label}
                </span>
                <span className="overflow-hidden text-ellipsis text-[var(--button-menu-black-fg)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {onClose && (
          /* Ступень нажатия переопределена: общее умолчание темнит глиф до
             Grey 1514, а на чёрной панели это сделало бы его невидимым. */
          <CloseCross
            size={24}
            onClick={onClose}
            className="text-[var(--button-menu-black-fg)] [--close-cross-fg-active:var(--button-menu-black-muted-fg)]"
          />
        )}
      </div>
    </div>
  )

  if (!withSelectAll) return panel

  return (
    // ⚠️ Прозрачный зазор ловил указатель. Блок занимает всю ширину и 136
    // высоты, а нарисовано в нём двое — панель и кнопка; курсор до липкой
    // полосы прокрутки таблицы, которая живёт в зазоре, не доезжал, таблица
    // теряла наведение, полоса гасла на подходе.
    //
    // Лечится тем, что ВНЕШНИЙ узел указатель не принимает, а панель и
    // обёртка кнопки возвращают себе приём; обёртка кнопки при этом ужата
    // по самой кнопке (`w-fit`), чтобы не перекрывать зазор по бокам.
    // Проверяется не глазами, а попаданием в точку: что лежит под центром
    // дорожки прокрутки (`document.elementFromPoint`).
    //
    // Место в потоке страницы при этом держится за ВЕСЬ блок (136, а не
    // 72) — иначе контент уезжает под кнопку. Это две разные величины, и
    // путать их нельзя: занятый низ вьюпорта публикует панель (см. ref
    // выше), а место в потоке занимает этот узел.
    <div
      data-slot="button-menu-black-block"
      className={cn(
        "pointer-events-none flex w-full flex-col items-center gap-8",
        pinned && PINNED_CLASS
      )}
    >
      <div className="pointer-events-auto w-fit">
        {/* Кнопка — не «таблетка» со своей заливкой, а инстанс кнопки кита
            (`ELK / button` 68723:17347): `secondary-black` — это как раз
            Dark blue 1412 #012F42, а `sm` даёт 32 по высоте, радиус 16,
            поля 6/16 и P2 Medium. Своя вёрстка по замеру пикселя совпала бы
            по картинке и разошлась бы по состояниям, фокусу и темам. */}
        <Button
          variant="secondary-black"
          size="sm"
          data-slot="button-menu-black-select-all"
          onClick={onSelectAllPages}
        >
          Выбрать на всех страницах
          {selectAllPagesCount !== undefined && ` (${selectAllPagesCount})`}
        </Button>
      </div>
      {panel}
    </div>
  )
}

export { ButtonMenuBlack }
export type { ButtonMenuBlackProps, ButtonMenuBlackInfoItem }
