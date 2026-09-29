import * as React from "react"

import { Ellipsis } from "@/icons"
import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"
import { pressHandlers } from "@/lib/press"

import { RightElement, type RightElementType } from "./right-element"

// Item — «Элемент»: строка содержимого, всегда интерактивная (по
// собственному описанию макета: клик по ней выбирает пункт из списка,
// открывает нижнюю шторку или ведёт на другой экран). Две формы анатомии
// переключаются через `text`: только значение либо
// текст + значение + комментарий. `subCategory` — это свойство макета «Sub
// Category»: строка второго уровня вложенности получает дополнительный
// отступ слева.
//
// Правый элемент со всеми его видами и зонами нажатия — в
// `right-element.tsx`.
//
// ⚠️ МОБИЛЬНАЯ ФОРМА — ПО ЧУЖОМУ КИТУ, И ЭТО СОЗНАТЕЛЬНО. Дизайн-чек от
// 13.09, замечание 4: «Переработать размеры текстов и размеры компонента Item
// для варианта Mobile. Пока в нужном ките нет варианта Mobile, он появится
// позже. Взять за основу его копию из другого кита — оттуда унаследовать
// ТОЛЬКО размеры текстов, но подобрать аналоги из нашего кита. Аналогично по
// вложенным элементам — переключить на Mobile-версии».
//
// Референс — сет `IB / item` (v1.2.1, Release 58.13), временно скопированный
// заказчиком в доступный файл: символы Mobile и Desktop того же сочетания
// свойств. Сравнение двух его размеров и есть источник дельты:
//
//   подпись   P2 Medium 14/20 → P3 Medium 12/16   (`Description`)
//   значение  P1 Medium 16/24 → P2 Medium 14/20   (`Text`)
//   коммент   12/16 на ОБОИХ размерах у IB; у нас десктоп 14/20 из своего
//             мастера, поэтому мобильный — 12/16
//   плашка    48 → 40 (`IB / thumbnail` мобильный — ровно 40 с глифом 24,
//             то есть наш `Thumbnail` размера L и есть аналог)
//   подкатегория  собственный отступ 64 → 56, то есть от края 80 → 72
//
// ⚠️ Коробка строки на мобиле НЕ МЕНЯЕТСЯ, и это проверено, а не допущено:
// у обоих размеров `IB / item` одинаковые pt 16, зазор до разделителя 15,
// зазор до правого элемента 24, зазор плашка → текст 16 и поля 16. Разница
// высот (96 против 88) выходит из одного только кегля. Первый проход этого
// не знал и ужал поля и зазоры «по аналогии» — числа были выдуманы.
//
// Когда мобильный мастер приедет в саму ДС, перемерить по нему.

type CommentColor = "grey" | "red" | "yellow"

const COMMENT_COLOR: Record<CommentColor, string> = {
  grey: "text-[var(--item-comment-grey-fg)]",
  red: "text-[var(--item-comment-red-fg)]",
  yellow: "text-[var(--item-comment-yellow-fg)]",
}

/** Цвет подписи и значения у отключённой строки — один на всех. */
const DISABLED_FG = "text-[var(--item-value-fg-disabled)]"

interface ItemProps {
  value: React.ReactNode
  text?: React.ReactNode
  comment?: React.ReactNode
  commentColor?: CommentColor
  /** `true` — заглушка кита, свой узел — как есть, `false`/пусто — без него. */
  thumbnail?: React.ReactNode
  subCategory?: boolean
  disabled?: boolean
  /**
   * Разделитель под строкой.
   *
   * Три состояния, а не два. `undefined` — «как в списке»: линия есть у
   * всех строк, кроме последней (правило `:last-child` в styles/base.css —
   * список у нас произвольный контейнер, и строка сама не знает, последняя
   * ли она). `true` и `false` — явное решение вызывающего, и оно сильнее
   * правила списка.
   *
   * Дизайн-чек от 07.09, замечание 20: «В Item не отрабатывает включение
   * разделителя». Отрабатывало, но не было видно: в Playground строка одна,
   * то есть всегда `:last-child`, и правило списка гасило линию быстрее,
   * чем проп успевал её включить.
   */
  divider?: boolean
  onClick?: () => void

  rightElement?: RightElementType
  /**
   * Панель, которую раскрывает строка, СЕЙЧАС ОТКРЫТА (`rightElement="select"`).
   *
   * Признак раскрытия обязателен: шеврон не переворачивался не из-за CSS, а
   * потому что компонент не знал, что панель открыта. Заодно это
   * `aria-expanded` на самой строке.
   */
  open?: boolean
  informationText?: React.ReactNode
  rightText?: React.ReactNode
  toggleChecked?: boolean
  onToggleChange?: (checked: boolean) => void
  checkboxChecked?: boolean
  onCheckboxChange?: (checked: boolean) => void

  className?: string
}

function DefaultThumbnail() {
  return (
    // Дизайн-чек, замечание 35: квадрат с ограниченным радиусом, как у
    // собственного компонента `Thumbnail` кита (ui/thumbnail). Раньше здесь
    // стоял маленький кружок rounded-full, который этой конвенции не
    // отвечает.
    //
    // ⚠️ Глиф заглушки — `icon / more` (многоточие), и менять его на
    // `comment` НЕ НУЖНО. Проверено вектором: ассет мастера
    // (`ELK / thumbnail`) — это ровно три точки.
    //
    // Замечание «значок в рекомендациях: message → comment» относится не к
    // умолчанию компонента, а к КОНКРЕТНОЙ строке на экране отчётов, где
    // плашка переопределена инстансом. Судить о глифе по имени слоя нельзя
    // ни в ту, ни в другую сторону — только по скачанному вектору.
    <span
      aria-hidden="true"
      // Размер — ровно как у `Thumbnail` размера L: 40 на мобиле, 48 на
      // десктопе (`size-10 desktop:size-12`), глиф 24 на обеих формах.
      className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--item-thumbnail-bg)] text-[var(--item-thumbnail-fg)] desktop:size-12"
    >
      <Ellipsis size={24} className="size-6" />
    </span>
  )
}

function Item({
  value,
  text,
  comment,
  commentColor = "grey",
  thumbnail,
  subCategory = false,
  disabled = false,
  divider,
  onClick,
  rightElement = "none",
  open = false,
  informationText,
  rightText,
  toggleChecked,
  onToggleChange,
  checkboxChecked,
  onCheckboxChange,
  className,
}: ItemProps) {
  const hasThumbnail = thumbnail === true || hasContent(thumbnail)
  const valueColor = disabled ? DISABLED_FG : "text-[var(--item-value-fg)]"

  // Toggle, Checkbox и «i» внутри строки — свои кнопки: Enter/Space на них
  // не должны доходить до строки (см. `pressHandlers`).
  const press = pressHandlers<HTMLDivElement>(disabled ? undefined : onClick)

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-expanded={rightElement === "select" ? open : undefined}
      data-open={(rightElement === "select" && open) || undefined}
      {...press}
      data-slot="item"
      data-disabled={disabled || undefined}
      // Явное решение вызывающего — атрибутом: правило `:last-child` в
      // styles/base.css гасит линию только у строк БЕЗ него (см. `divider`).
      data-divider={divider === undefined ? undefined : divider ? "on" : "off"}
      className={cn(
        // 16 над содержимым, 15 под ним, затем разделитель 1px — строка с
        // значением и комментарием так или иначе высотой 80px. Вариант
        // макета с выключенным разделителем сохраняет тот же зазор 15px и
        // прозрачную линию 1px, а не схлопывается, поэтому рамка здесь
        // присутствует всегда и лишь меняет цвет: иначе последняя строка
        // списка была бы на 1px короче.
        "flex w-full cursor-pointer items-center gap-6 border-b px-4 pt-4 pb-[15px] text-left outline-none transition-colors",
        // Sub Category отодвигает *содержимое* на 64px относительно
        // обычной строки (в макете на коробке варианта `Сategory=True`
        // стоит `pl-[64px]` поверх собственных боковых отступов строки в
        // 16px из примечания «Боковые отступы»), то есть здесь получается
        // 80px. Разделитель и заливка наведения при этом по-прежнему идут во
        // всю ширину, потому что отступ стоит на самой строке.
        // 72 на мобиле против 80 на десктопе: собственный отступ
        // подкатегории в `IB / item` — 56 и 64 соответственно, поля строки
        // (16) одни и те же.
        subCategory && "pl-[72px] desktop:pl-20",
        divider === false
          ? "border-transparent"
          : "border-[var(--item-divider)]",
        "not-data-[disabled]:hover:bg-[var(--item-hover-bg)]",
        "data-[disabled]:cursor-not-allowed",
        "focus-visible:focus-ring-inset",
        className
      )}
    >
      {/* ⚠️ `items-start`, а не `items-center`: плашка ПРИЖАТА К ВЕРХУ,
          вровень с первой строкой значения (кит объявляет `items-start`) —
          48 × 48 на top 16, радиус 8, фон Grey 106, значок 24. По центру
          высоты строки она стояла только у однострочного значения, а на
          двух строках уезжала вниз. */}
      <span className="flex min-w-0 flex-1 items-start gap-4">
        {hasThumbnail && (
          <span className={cn("shrink-0", disabled && "opacity-50")}>
            {thumbnail === true ? <DefaultThumbnail /> : thumbnail}
          </span>
        )}

        {/* ⚠️ Прижата к верху ПЛАШКА, а текст остаётся по центру: в мастере
            колонка содержимого — `self-stretch justify-center`.
            Разница видна только у короткого содержимого: рядом с плашкой 48
            однострочное значение 24 должно стоять по её центру, а не по
            верхней кромке. */}
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 self-stretch">
          <span className="flex min-w-0 flex-col">
            {hasContent(text) && (
              <span
                className={cn(
                  "truncate text-p3-medium desktop:text-p2-medium",
                  valueColor
                )}
              >
                {text}
              </span>
            )}
            {/* Значение переносится максимум на 3 строки, комментарий — на
                5, по примечанию макета «Максимальное количество строк».
                Однострочный `truncate` обрезал длинные заголовки, которые в
                макете показаны с переносом. */}
            <span
              className={cn(
                "line-clamp-3 text-p2-medium desktop:text-p1-medium",
                valueColor
              )}
            >
              {value}
            </span>
          </span>
          {hasContent(comment) && (
            <span
              className={cn(
                "line-clamp-5 text-p3-medium desktop:text-p2-medium",
                disabled ? DISABLED_FG : COMMENT_COLOR[commentColor]
              )}
            >
              {comment}
            </span>
          )}
        </span>
      </span>

      {rightElement !== "none" && (
        <RightElement
          type={rightElement}
          disabled={disabled}
          open={open}
          informationText={informationText}
          rightText={rightText}
          toggleChecked={toggleChecked}
          onToggleChange={onToggleChange}
          checkboxChecked={checkboxChecked}
          onCheckboxChange={onCheckboxChange}
        />
      )}
    </div>
  )
}

export { Item }
export type { CommentColor, ItemProps, RightElementType }
