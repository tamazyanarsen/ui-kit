import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"

import { Button } from "@/components/ui/button"
import { useHorizontalScrollState } from "@/components/ui/table"

import { cn } from "@/lib/utils"

// Table Top — «Блок верха таблицы» (ui/table-top). По собственному макету
// это сосед `Table`, а не обёртка над ним: в макете «Использование в
// макете» он стоит прямо над обычной таблицей данных на странице и не
// делит с ней ни состояния, ни контекста. Это чистая раскладочная оболочка:
// каждый цвет, встречающийся в векторе компонента, — точное
// переиспользование токенов, которые уже есть в других местах: белые и
// серые поверхности самого Filter, тёмная таблетка «применённого значения»
// из Chips, палитры Button, Badge, Tabs и Input, а также стандартные серые
// цвета текста кита. Поэтому собственных CSS-токенов компонент не заводит:
// для текста и рамки он берёт --table-fg, --table-description-fg и
// --table-divider из пространства имён Table, а все интерактивные контролы
// (поиск, выпадающие фильтры, сортировка, вкладки, выгрузка и настройка
// колонок) собираются из существующих компонентов (`Input`, `Filter`,
// `Tabs`, `Button`, `Select`, `Badge`), а не пишутся заново.
//
// Разбор «Elements» в макете (Title / Filter Setting / Filter Select /
// Chips / Tabs) ложится на эти четыре раскладочные части плюс готовый
// компонент `Tabs`, который вставляется прямо между `TableTopTitle` и
// `TableTopToolbar`: своя обёртка для вкладок не нужна.

// Контейнер — *не* карточка: `ELK / table-top` это прозрачная колонка с
// отступом 16px и единственной линией снизу, стоящая вплотную над
// таблицей, которую она озаглавливает. Прежнее прочтение макета превратило
// его в скруглённую белую панель с отступом 24px, чего у самого символа
// нет.
function TableTop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-top"
      className={cn(
        "flex w-full flex-col gap-4 border-b border-[var(--table-divider)] p-4",
        className
      )}
      {...props}
    />
  )
}

interface TableTopTitleProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  /** Right-aligned action button (the spec's "Button" element). */
  action?: React.ReactNode
}

function TableTopTitle({
  className,
  title,
  action,
  ...props
}: TableTopTitleProps) {
  return (
    <div
      data-slot="table-top-title"
      className={cn("flex min-h-8 items-center justify-between gap-4", className)}
      {...props}
    >
      {/* H3 Medium (24/32) по «Title-Table (ELK)», а не H4; заголовок
          забирает свободное место, чтобы длинный обрезался многоточием, а
          не выталкивал кнопку действия из строки. */}
      <h3 className="min-w-0 flex-1 truncate text-h3 text-[var(--table-fg)]">
        {title}
      </h3>
      {action}
    </div>
  )
}

// Оборачивает поле поиска, выпадающие фильтры и кнопки «Ещё фильтры» и
// «Сбросить фильтры» — это просто переносящаяся flex-строка, всё
// содержимое собирает вызывающий код (полную сборку см. в
// table-top-demo.tsx).
function TableTopToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-top-toolbar"
      // «Group Chips (ELK)» переносится с несимметричным зазором: 8px
      // между контролами в строке и 12px между перенесёнными строками.
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-3", className)}
      {...props}
    />
  )
}

interface TableTopSummaryProps extends React.ComponentProps<"div"> {
  /** Left-aligned text, e.g. "Выбрано фильтров: 0  Результатов: 8". */
  info?: React.ReactNode
  /** Right-aligned actions, e.g. "Скачать"/"Настроить столбцы" or a sort Select. */
  actions?: React.ReactNode
}

function TableTopSummary({
  className,
  info,
  actions,
  ...props
}: TableTopSummaryProps) {
  return (
    <div
      data-slot="table-top-summary"
      // ⚠️ Блок результата — 40, а не 32: у `Result-Table (ELK)` есть
      // СОБСТВЕННЫЙ верхний отступ 8 поверх минимальной высоты 32 (замер:
      // рамка 40, кнопки внутри на y=8, строка значений на y=14). Ровно та
      // же конструкция, что у блока вкладок (4 + 40 = 44).
      //
      // Восьмёрку было легко потерять: полотно документации подписывает
      // полную высоту шапки 220 и раскладывает её из строк по 32, а сет
      // складывается в 228. Сет с докой расходится — прав сет. Отсюда
      // высота шапки 228 без сводки и 276 со сводкой.
      //
      // Приём, которым это ловится: сумму высот детей + отступы родителя
      // сверять с высотой родителя, а не только зазоры между детьми —
      // расхождение размазано по одному стыку из четырёх и на скриншоте
      // не видно.
      className={cn(
        "flex min-h-10 flex-wrap items-center justify-between gap-2 pt-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-4 text-p2-medium">
        {info}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

interface TableTopSummaryItemProps extends React.ComponentProps<"span"> {
  label: React.ReactNode
  value: React.ReactNode
}

// One "Выбрано фильтров: 0" pair from "Result-Table (ELK)". Both halves are
// P2 Medium — это не контраст «жирное/обычное».
//
// ⚠️ Отступление от кита, согласованное: **значение тоже Grey 284**, а не
// тёмное. В сете подпись Grey 284, а число Grey 1514, и в сет правка на дату
// передачи ещё не доехала — но по продуктовому шаблону пара читается как один
// служебный текст, а тёмное число выдавало его за содержимое таблицы. Если
// следующий проход увидит в Figma тёмное число — это ожидаемо, возвращать не
// нужно.
function TableTopSummaryItem({
  className,
  label,
  value,
  ...props
}: TableTopSummaryItemProps) {
  return (
    <span
      data-slot="table-top-summary-item"
      className={cn(
        "flex items-center gap-1 text-[var(--table-description-fg)]",
        className
      )}
      {...props}
    >
      <span>{label}</span>
      <span>{value}</span>
    </span>
  )
}

// Один шеврон в конце полосы.
//
// ⚠️ Это НЕ своя плашка, а инстанс кнопки кита: в сете под стрелкой
// лежит `ELK / button` — белый круг
// 32 × 32, радиус 16, поле 8, глиф 16. Свёрстанная по замеру пикселя
// «таблетка» совпала бы по картинке и разошлась бы по состояниям, фокусу и
// поведению в темах. Правило общее: прежде чем верстать вложенный узел,
// проверьте, не инстанс ли это компонента кита.
//
// Стрелка ЛЕЖИТ НА ленте у кромки, а не встаёт рядом с ней: иначе её
// появление съедало бы ширину ленты и пересчитывало переполнение по кругу.
// Текст под стрелкой поэтому обрезан — так же, как в сете.
function DetailsArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  return (
    <Button
      variant="secondary-white"
      size="sm"
      icon={direction === "left" ? ChevronLeft : ChevronRight}
      iconPosition="only"
      data-slot="table-top-details-arrow"
      data-direction={direction}
      aria-label={
        direction === "left" ? "Прокрутить сводку назад" : "Прокрутить сводку вперёд"
      }
      onClick={onClick}
      className={cn(
        // `motion-safe`: `prefers-reduced-motion` гасит и плавную прокрутку
        // ленты (см. scrollToNeighbour), и проявление самой стрелки.
        "absolute top-1/2 z-10 -translate-y-1/2 motion-safe:animate-in motion-safe:fade-in",
        // Дизайн-чек «Storybook 3», замечание 1: «скорректировать отступ
        // кнопки до края элемента, поправить и правую, и левую». Обе стрелки
        // стояли вплотную к кромке ленты (`left-0`/`right-0`) — замер по
        // скриншоту чека это подтвердил (левая на 835 при кромке 832, правая
        // на 1800 при кромке 1804 в пикселях снимка). Отступ — китовые 8.
        direction === "left" ? "left-2" : "right-2"
      )}
    />
  )
}

// TableTopDetails — «Сводка», последняя строка внутри `ELK / table-top`
// (его слот `Details`). Слева закреплена приглушённая подпись «Сводка», за
// ней — прокручиваемая лента пар «подпись: значение», разделённых линией
// Grey 166 шириной 12px.
//
// В макете это названо «Дополнительная функция, наличие определяется при
// разработке конкретного продукта» и показано тремя состояниями ленты
// (Начало / Середина / Конец ленты): когда пары не помещаются, лента
// прокручивается по горизонтали сама, независимо от таблицы под ней.
interface TableTopDetailsProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode
  items: { label: React.ReactNode; value: React.ReactNode }[]
}

function TableTopDetails({
  className,
  label = "Сводка",
  items,
  ...props
}: TableTopDetailsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const { scrolledFromStart, scrolledFromEnd } = useHorizontalScrollState(trackRef)

  // Перелистывание идёт ПО ЗНАЧЕНИЯМ, а не на произвольное число пикселей:
  // ищем первую пару, целиком не поместившуюся с нужной стороны, и подводим
  // её кромку к кромке ленты. Прокрутка «на 80% ширины» резала пару пополам
  // ровно тем чаще, чем длиннее подписи.
  function scrollToNeighbour(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth"
    const pairs = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slot='table-top-details-item']")
    )
    const trackBox = track.getBoundingClientRect()
    // Допуск в 1px: субпиксельные ширины иначе выдают за «не поместилась»
    // пару, которая на экране стоит вплотную к кромке.
    const next = direction === 1
      ? pairs.find((pair) => pair.getBoundingClientRect().right > trackBox.right + 1)
      : [...pairs].reverse().find(
          (pair) => pair.getBoundingClientRect().left < trackBox.left - 1
        )
    if (!next) return
    const delta = direction === 1
      ? next.getBoundingClientRect().right - trackBox.right
      : next.getBoundingClientRect().left - trackBox.left
    track.scrollBy({ left: delta, behavior })
  }

  return (
    <div
      data-slot="table-top-details"
      className={cn("flex min-h-8 items-center gap-4 text-p2-medium", className)}
      {...props}
    >
      <span className="shrink-0 text-[var(--table-description-fg)]">
        {label}
      </span>
      {/* В макете лента нарисована в четырёх состояниях — «Сводка
          поместилась», «Начало ленты», «Середина ленты», «Конец ленты», —
          и различаются они только тем, какой шеврон показан: ни одного,
          когда всё влезло, и по одному с той стороны, за которой ещё есть
          содержимое. Правило краёв то же, что у закреплённых колонок,
          поэтому переиспользуется их хук прокрутки. */}
      <div className="relative flex min-w-0 flex-1 items-center">
        {scrolledFromStart && (
          <DetailsArrow direction="left" onClick={() => scrollToNeighbour(-1)} />
        )}
        {/* rounded-[16px] вместе с обрезкой на дорожке — это собственный
            кадр Row в макете: он подрезает концы ленты вровень с радиусом
            блока.
            `scrollbar-none`: своей полосы прокрутки у ленты нет ни в одном
            варианте сета — вторая полоса рядом со стрелками была бы вторым
            органом управления той же ленты. Листается она стрелками, колесом
            и трекпадом. */}
        <div
          ref={trackRef}
          data-slot="table-top-details-track"
          data-scroll-window=""
          className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto rounded-[16px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <span
              key={index}
              data-slot="table-top-details-item"
              // Замер пары («Table Property»):
              // коробка разделителя 12 → 4 → «Подпись:» → 4 → значение, а
              // между парами 16. Двоеточие приклеено к подписи (зазор 0) —
              // это отдельная текстовая нода без отступа, отсюда `gap-1`
              // только на внешних стыках.
              className="flex shrink-0 items-center gap-1 text-[var(--table-fg)]"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  // `box-border` объявлен явно: коробка разделителя — ровно
                  // 12, и обводка 1px должна входить в них, а не
                  // прибавляться к ним (иначе выходит 13, а зазор 33 вместо
                  // 32 — глазами такое не видно, ловится только замером).
                  className="box-border h-5 w-3 border-l border-[var(--table-summary-divider)]"
                />
              )}
              <span>{item.label}:</span>
              <span>{item.value}</span>
            </span>
          ))}
        </div>
        {scrolledFromEnd && (
          <DetailsArrow direction="right" onClick={() => scrollToNeighbour(1)} />
        )}
      </div>
    </div>
  )
}

export {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopDetails,
}
export type {
  TableTopTitleProps,
  TableTopSummaryProps,
  TableTopSummaryItemProps,
  TableTopDetailsProps,
}
