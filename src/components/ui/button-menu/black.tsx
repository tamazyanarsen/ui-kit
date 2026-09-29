import * as React from "react"
import { CloseCross } from "@/components/ui/close-cross"

import { cn } from "@/lib/utils"
import { flattenChildren } from "@/lib/flatten-children"
import { useViewportInsetBottom } from "@/lib/use-viewport-inset-bottom"
import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { ButtonMenuOverflow } from "./overflow"
import { ButtonMenuRow } from "./row"
import { PINNED_CLASS, barShapeClass } from "./pinning"
import {
  BAR_PLACEMENT_CLASS,
  barPlacementStyle,
  type ButtonMenuPlacement,
} from "./placement"

// ButtonMenuBlack — «ELK / button menu (black)» (v1.0.0). Макет описывает
// это как самостоятельный компонент, а не как вариант белого ButtonMenu:
// пока у пользователя выделены строки таблицы, эта панель *подменяет*
// собой белую, а её закрытие возвращает белую обратно («Когда пользователь
// выделяет один или несколько элементов таблицы, Button Menu заменяется
// черной панелью»).
//
// Геометрия снята с символа Button=Three: фиксированная высота 72px,
// px-24/py-16, скругление 16px только у верхних углов (панель стоит
// вплотную к нижнему краю, как и ButtonMenu), действия прижаты влево с
// зазором 8px, а информационная полоса и крестик — вправо с зазором 32px.

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

interface ButtonMenuBlackInfoItem {
  label: React.ReactNode
  value: React.ReactNode
  /**
   * Дополнительные классы колонки.
   *
   * ⚠️ Ширину здесь задавать НЕ НУЖНО. Дизайн-чек от 07.09, замечание 4:
   * «Не допускается перенос. Текст в 1 строку, ширина параметра
   * динамическая». Раньше первой колонке («Выбрано») ставили `w-16` — 64px
   * из макета, — и «3 документа» разваливалось на три строки.
   */
  className?: string
}

interface ButtonMenuBlackProps extends React.ComponentProps<"div"> {
  /** Полоса «Information (ELK)» — пары «подпись/значение», описывающие
   * текущее выделение. Опустите её целиком, чтобы получить форму
   * `showBar = false`. */
  info?: ButtonMenuBlackInfoItem[]
  /** Закрывает панель. В макете это голый `icon / close cross` 24px, а не
   * инстанс `ELK / button`, — то есть это ПЛОСКИЙ крестик кита
   * (`CloseCross`), а не кнопка на плашке. */
  onClose?: () => void
  /**
   * Прижимать панель к низу контейнера. По умолчанию включено — она
   * подменяет собой закреплённую белую панель, пока выделены строки
   * таблицы, и стоит там же.
   */
  pinned?: boolean
  /**
   * «Отлипшая» полоса — дизайн-чек от 08.09, замечание 9. В продукте такого
   * состояния быть не должно, пропс заведён на будущее: полоса становится
   * островом в потоке и получает нижние скругления, такие же как верхние.
   */
  detached?: boolean
  /**
   * Размещение на сетке: во всю полосу (12 колонок), слева или справа.
   * Дизайн-чек от 13.09, замечание 19 — см. `./placement`.
   */
  placement?: ButtonMenuPlacement
  /** Сколько колонок занимает панель при размещении слева/справа, 1…12. */
  span?: number

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

const ButtonMenuBlack = React.forwardRef<HTMLDivElement, ButtonMenuBlackProps>(function ButtonMenuBlack({
  className,
  info,
  onClose,
  pinned = true,
  detached = false,
  placement = "full",
  span = 12,
  showSelectAllPages = true,
  selectAllPagesCount,
  selectedCount,
  onSelectAllPages,
  children,
  style,
  ...props
}, forwardedRef) {
  // Рассуждение то же, что и в проходе по размерам самого ButtonMenu: макет
  // рисует все действия одинаковой таблеткой 32px (px-16/py-6, радиус 16 —
  // это `sm` у Button).
  //
  // Дизайн-чек №12: вариант тоже форсится, а не подставляется по умолчанию —
  // «для button menu black используются только белые кнопки». Раньше здесь
  // стоял `variant ?? "secondary-white"`, и вызывающий код мог поставить
  // брендовую кнопку на тёмную панель (что и попало в дизайн-чек: «Подписать»
  // была голубой). Брендового акцента на этой панели не существует: она сама
  // и есть акцент.
  // Дети раскрываются вместе с фрагментами: `{canSign && <><Button/>…</>}`
  // иначе проходил мимо принудительного размера и варианта, и «Подписать»
  // снова становилась голубой на чёрной панели (дефект дизайн-чека №12).
  const sizedChildren = flattenChildren(children).map((child) => {
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

  const onlyButtons = sizedChildren.every(
    (child) =>
      React.isValidElement(child) &&
      (child.type === Button || child.type === ButtonMenuOverflow)
  )

  // Пока панель закреплена, она публикует занятую высоту в
  // `--viewport-inset-bottom`: горизонтальная полоса прокрутки таблицы липнет
  // к низу СВОБОДНОЙ части вьюпорта, а не к кромке экрана, — иначе она
  // уходила бы под панель ровно тогда, когда таблицей активно пользуются.
  // ⚠️ Занятый низ вьюпорта — это СПЛОШНАЯ ПОЛОСА, а не габарит блока.
  // Между кнопкой и панелью прозрачный зазор 32, и липкая полоса прокрутки
  // таблицы (8px) помещается в нём целиком. Меряя блок целиком, мы отрывали
  // полосу прокрутки от панели на 64 и подвешивали её в пустоте — поэтому
  // ref висит на ПАНЕЛИ, а не на внешнем узле. Сам узел панели стабилен (см.
  // возврат ниже), но хук всё равно отдаёт callback-ref и перемеряет любой
  // новый узел — например, после перемонтирования панели снаружи.
  const ref = useViewportInsetBottom(pinned && !detached, forwardedRef)

  // Кнопка пропадает, когда выбрано всё, и возвращается, как только снята
  // хотя бы одна галка.
  const allSelected =
    selectAllPagesCount !== undefined &&
    selectedCount !== undefined &&
    selectedCount >= selectAllPagesCount
  const withSelectAll = showSelectAllPages && !!onSelectAllPages && !allSelected

  // Размещение на сетке вешается на САМЫЙ ВНЕШНИЙ узел — на панель, когда она
  // возвращается одна, и на блок «кнопка + панель», когда он есть. Иначе
  // кнопка «Выбрать на всех страницах» центрировалась бы по всей полосе, а
  // панель под ней стояла бы в своих шести колонках.
  const outerPlacementClass = BAR_PLACEMENT_CLASS[placement]
  // Плавающим слоям (NPS, «Наверх») занятый низ — весь блок «кнопка +
  // панель», иначе они ложились на кнопку «Выбрать на всех страницах»
  // (аудит 21, на 320–700). Это отдельная переменная: полоса прокрутки
  // таблицы по-прежнему липнет к самой панели (см. ref выше).
  const blockRef = useViewportInsetBottom<HTMLDivElement>(
    pinned && !detached && withSelectAll,
    undefined,
    "--floating-inset-bottom"
  )
  const outerPlacementStyle = barPlacementStyle(placement, span)

  const panel = (
    <div
      ref={ref}
      data-slot="button-menu-black"
      data-pinned={(pinned && !detached) || undefined}
      data-detached={detached || undefined}
      data-placement={placement}
      className={cn(
        // `@container/black` — от ширины панели (а не окна) зависит, есть
        // ли место под информацию, см. правую группу ниже. Зазор 32 между
        // действиями и правой группой — её `ml-8`, а не `gap-8` панели:
        // свой зазор контейнер по собственному запросу менять не может.
        "@container/black flex max-h-[72px] min-h-[72px] items-center justify-between bg-[var(--button-menu-black-bg)] px-6 py-4",
        withSelectAll ? "w-full" : outerPlacementClass,
        barShapeClass({ detached }),
        // Приём указателя возвращается панели: внешний узел его не
        // принимает (см. ниже).
        withSelectAll && "pointer-events-auto",
        pinned && !detached && !withSelectAll && PINNED_CLASS,
        className
      )}
      style={
        withSelectAll ? style : { ...outerPlacementStyle, ...style }
      }
      {...props}
    >
      {/* Действия — тот же ряд, что у белой панели: не поместившиеся
          уходят в «…». Раньше они стояли `shrink-0`, и панель на части
          сетки (`placement="left"`, `span={6}`) выталкивала информацию и
          крестик за свой край на белый фон — вживую на 195px. Ряд берёт
          оставшееся место (`flex-1 min-w-0`), правая группа — нет. */}
      {/* ⚠️ Ряд собирает сначала кнопки, потом прочих детей, потом «…» —
          то есть переставляет их. Поэтому он берётся, только когда в
          действиях одни кнопки (и переданное «…»): кнопка в своей обёртке
          (`<PermissionGate>`) иначе уезжала бы в конец. Со «своими» детьми
          действия стоят как есть, но сжимаются и обрезаются — за край
          панели они всё равно не выходят. Основа у них, как у ряда, 0
          (`flex-1`): сжимаются они раньше информации. */}
      {/* ⚠️ На узкой панели (375, сетка на 6 колонок) правая группа
          съедала всё место, ряд сжимался до нуля — а нулевую ширину хук
          ряда считает «ещё не померили» и показывает ВСЕ кнопки. Они
          ложились поверх информации и уходили за край панели. Поэтому у
          ряда с кнопками есть минимум — место под «…» (32), и ряд может
          оставить видимыми ноль кнопок (`minVisible={0}`): сначала всё
          уходит в «…», и лишь потом сжимается информация. */}
      {onlyButtons ? (
        <ButtonMenuRow
          size="sm"
          tone="dark"
          minVisible={0}
          data-slot="button-menu-black-actions"
          className={cn("items-start", sizedChildren.length > 0 && "min-w-8")}
        >
          {sizedChildren}
        </ButtonMenuRow>
      ) : (
        <div
          data-slot="button-menu-black-actions"
          className="flex min-w-0 flex-1 items-start gap-2 overflow-hidden"
        >
          {sizedChildren}
        </div>
      )}

      {/* Правая группа сжимается ПОСЛЕ действий (у ряда основа 0, он
          уже отдал всё до своих 32). Крестик виден всегда. Информация
          теряет колонки с конца: они переносятся на вторую строку, а та
          срезана высотой одной колонки (40); оставшаяся одна колонка
          обрезается многоточием. Совсем узкой панели (контент уже 180)
          информации не показать — она прячется, а зазор ужимается до 16,
          чтобы «…» и крестик помещались даже на 6 колонках при 375. */}
      <div className="ml-8 flex min-w-0 items-center justify-end gap-8 @max-[180px]/black:ml-4">
        {info && info.length > 0 && (
          <div
            data-slot="button-menu-black-info"
            className="flex max-h-10 min-w-0 flex-wrap content-start items-center justify-end gap-8 overflow-clip text-p2-medium [overflow-clip-margin:4px] @max-[180px]/black:hidden"
          >
            {info.map((item, index) => (
              // Дизайн-чек от 07.09, замечание 4: перенос не допускается,
              // ширина колонки динамическая. `whitespace-nowrap` — это и
              // есть «в одну строку». Соседи колонку не сжимают: не
              // поместившаяся уезжает на срезанную вторую строку. Сжимается
              // (с многоточием) только колонка, оставшаяся одна.
              <div
                key={index}
                className={cn(
                  "flex min-w-0 flex-col items-start whitespace-nowrap",
                  item.className
                )}
              >
                <span className="max-w-full overflow-clip text-ellipsis [overflow-clip-margin:4px] text-[var(--button-menu-black-muted-fg)]">
                  {item.label}
                </span>
                <span className="max-w-full overflow-clip text-ellipsis [overflow-clip-margin:4px] text-[var(--button-menu-black-fg)]">
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

  // ⚠️ Панель ВСЕГДА в десктопной форме — дизайн-чек от 13.09, замечание 2:
  // «У панели вообще не должно быть мобайл-версии или уменьшенной версии. Она
  // не должна менять размеры, должна просто следовать сетке». Своих
  // `desktop:` у чёрной полосы нет, но они есть у кнопок внутри (`ELK /
  // button` размера S меняет кегль 12 → 14), поэтому форму фиксирует скоуп на
  // всё поддерево. Обёртка — `display: contents`, в раскладке не участвует.
  //
  // ⚠️ Панель стоит на ОДНОМ месте дерева при любом `withSelectAll`: блок
  // «кнопка + панель» есть всегда, а без кнопки он `display: contents` и в
  // раскладке не участвует. Раньше панель без кнопки возвращалась одна, с
  // кнопкой — внутри блока, и React на каждом переключении пересоздавал её
  // вместе с кнопками действий: фокус падал на <body>, открытое «…»
  // закрывалось. Переключается же это от любого клика по галке (выбрали всё —
  // кнопка пропала, сняли одну — вернулась).
  return (
    <ViewportScope viewport="desktop">
    {/* ⚠️ Прозрачный зазор ловил указатель. Блок занимает всю ширину и 136
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
        Место в потоке страницы при этом держится за ВЕСЬ блок (136, а не
        72) — иначе контент уезжает под кнопку. Это две разные величины, и
        путать их нельзя: занятый низ вьюпорта публикует панель (см. ref
        выше), а место в потоке занимает этот узел. */}
    <div
      ref={blockRef}
      data-slot={withSelectAll ? "button-menu-black-block" : undefined}
      data-placement={withSelectAll ? placement : undefined}
      className={cn(
        withSelectAll
          ? [
              "pointer-events-none flex flex-col items-center gap-8",
              outerPlacementClass,
              pinned && !detached && PINNED_CLASS,
            ]
          : "contents"
      )}
      style={withSelectAll ? outerPlacementStyle : undefined}
    >
      {withSelectAll && (
        <div className="pointer-events-auto w-fit">
          {/* Кнопка — не «таблетка» со своей заливкой, а инстанс кнопки кита
              (`ELK / button`): `secondary-black` — это как раз
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
      )}
      {panel}
    </div>
    </ViewportScope>
  )
})

export { ButtonMenuBlack }
export type { ButtonMenuBlackProps, ButtonMenuBlackInfoItem }
