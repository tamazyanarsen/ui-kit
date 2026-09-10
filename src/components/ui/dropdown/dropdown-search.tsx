import * as React from "react"

import { Search, X } from "@/icons"
import { cn } from "@/lib/utils"

/**
 * Строка поиска выпадающего списка — свойство `Show Search` компонент-сета
 * `ELK / dropdown` (5739:16497, вариант Desktop 5691:38719).
 *
 * Дизайн-чек «Storybook 3», замечание 7: «поправить вид поля поиска для
 * настройки столбцов, опираясь на вид dropdown. В компонент dropdown добавить
 * строку с поиском и с кнопками».
 *
 * ⚠️ Это НЕ инстанс поля ввода кита, хотя в макете узел и подписан
 * `ELK / input`. У него нет ни рамки, ни радиуса, ни плавающей подписи — это
 * строка списка ростом 56 с нижним разделителем Grey 134, полем 16, зазором 8
 * и глифом поиска 24×24. Настройка столбцов раньше ставила сюда настоящий
 * `Input size="lg"`, и в списке оказывалось поле с собственной коробкой —
 * ровно то, на что чек и указывает.
 *
 * Замеры узла `5865:70390`: `min-h/max-h 56`, `min-w 176`, `max-w 1080`,
 * `p-16`, `gap-8`, подпись P1 Medium 16/24 Grey 284.
 */
interface DropdownSearchProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  /** Крестик очистки. Появляется, только когда в поле что-то есть. */
  onClear?: () => void
  containerClassName?: string
}

const DropdownSearch = React.forwardRef<HTMLInputElement, DropdownSearchProps>(
  function DropdownSearch(
    { className, containerClassName, placeholder = "Поиск", value, onClear, ...props },
    ref
  ) {
    const hasValue = value !== undefined && value !== ""

    return (
      <div
        data-slot="dropdown-search"
        className={cn(
          "flex max-h-14 min-h-14 w-full max-w-[1080px] min-w-44 shrink-0 items-center gap-2 border-b border-[var(--menu-item-divider)] bg-popover p-4",
          containerClassName
        )}
      >
        <Search
          size={24}
          aria-hidden="true"
          className="size-6 shrink-0 text-[var(--menu-item-description-fg)]"
        />
        <input
          ref={ref}
          type="search"
          value={value}
          placeholder={placeholder}
          className={cn(
            // `[&::-webkit-search-cancel-button]:hidden` — у типа `search`
            // свой крестик, и рядом с нашим он был бы вторым органом
            // управления тем же полем.
            "min-w-0 flex-1 bg-transparent text-p1-medium text-[var(--menu-item-fg)] outline-none placeholder:text-[var(--menu-item-description-fg)] [&::-webkit-search-cancel-button]:hidden",
            className
          )}
          {...props}
        />
        {onClear && hasValue && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={onClear}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-[var(--menu-item-fg)] outline-none focus-visible:focus-ring"
          >
            <X size={24} aria-hidden="true" className="size-6" />
          </button>
        )}
      </div>
    )
  }
)

/**
 * Подсказка под поиском — узел `Text Help` (10080:82002), свойство
 * `Show Text Help`. По спецификации поля поиска (29750:56303) именно она
 * стоит на месте списка, пока в строку не ввели минимум три символа:
 * «Начните вводить параметры поиска».
 */
function DropdownHelp({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dropdown-help"
      className={cn(
        "w-full shrink-0 px-4 pt-3 pb-4 text-p2-regular text-[var(--menu-item-description-fg)]",
        className
      )}
      {...props}
    />
  )
}

export { DropdownSearch, DropdownHelp }
export type { DropdownSearchProps }
