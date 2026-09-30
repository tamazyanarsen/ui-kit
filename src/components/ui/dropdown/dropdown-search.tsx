import * as React from "react"

import { Search, X } from "@/icons"
import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"

/**
 * Строка поиска выпадающего списка — свойство `Show Search` компонент-сета
 * `ELK / dropdown` (вариант Desktop).
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
 * Замеры узла `Search`: `min-h/max-h 56`, `min-w 176`, `max-w 1080`,
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
    {
      className,
      containerClassName,
      placeholder = "Поиск",
      value,
      defaultValue,
      onChange,
      onClear,
      ...props
    },
    ref
  ) {
    // В неуправляемом режиме (`defaultValue`) пропс `value` пуст всегда, и
    // крестик по одному ему не появлялся никогда. Поэтому текст поля
    // отслеживается и сам.
    const [ownValue, setOwnValue] = React.useState(String(defaultValue ?? ""))
    const controlled = value !== undefined
    const hasValue = controlled ? value !== "" : ownValue !== ""
    const inputRef = React.useRef<HTMLInputElement>(null)
    const composedRef = useComposedRefs(inputRef, ref)

    function clear() {
      if (!controlled && inputRef.current) {
        inputRef.current.value = ""
        setOwnValue("")
      }
      onClear?.()
      inputRef.current?.focus()
    }

    return (
      <div
        data-slot="dropdown-search"
        className={cn(
          "flex max-h-14 min-h-14 w-full max-w-[1080px] min-w-44 shrink-0 items-center border-b border-[var(--menu-item-divider)] bg-popover p-4",
          // Мобильные формы (Full Screen / Bottom Sheet): в макете это не
          // строка списка, а настоящее поле `ELK / input` 328×48 с рамкой
          // Grey 166 и радиусом 16, в кадре высотой 48 с боковыми полями 16.
          "group-data-[size^=mobile]/dropdown:max-h-12 group-data-[size^=mobile]/dropdown:min-h-12 group-data-[size^=mobile]/dropdown:border-b-0 group-data-[size^=mobile]/dropdown:px-4 group-data-[size^=mobile]/dropdown:py-0",
          containerClassName
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 group-data-[size^=mobile]/dropdown:h-12 group-data-[size^=mobile]/dropdown:rounded-[16px] group-data-[size^=mobile]/dropdown:border group-data-[size^=mobile]/dropdown:border-[var(--input-border)] group-data-[size^=mobile]/dropdown:px-[15px]">
          <Search
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0 text-[var(--menu-item-description-fg)]"
          />
          <input
            ref={composedRef}
            type="search"
            value={value}
            defaultValue={defaultValue}
            onChange={(event) => {
              if (!controlled) setOwnValue(event.target.value)
              onChange?.(event)
            }}
            placeholder={placeholder}
            className={cn(
              // `[&::-webkit-search-cancel-button]:hidden` — у типа `search`
              // свой крестик, и рядом с нашим он был бы вторым органом
              // управления тем же полем.
              // Многоточие у непоместившегося текста — то же правило, что и у
              // `Input` (дизайн-чек от 13.09, замечание 14): «правка
              // распространяется на Input, Select и другие подобные
              // компоненты», а в фокусе многоточия нет.
              "min-w-0 flex-1 overflow-hidden bg-transparent text-p1-medium group-data-[size^=mobile]/dropdown:text-p2-medium text-ellipsis whitespace-nowrap text-[var(--menu-item-fg)] outline-none focus:text-clip placeholder:text-[var(--menu-item-description-fg)] [&::-webkit-search-cancel-button]:hidden",
              className
            )}
            {...props}
          />
          {onClear && hasValue && (
            <button
              type="button"
              aria-label="Очистить поиск"
              onClick={clear}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-[var(--menu-item-fg)] outline-none focus-visible:focus-ring"
            >
              <X size={24} aria-hidden="true" className="size-6" />
            </button>
          )}
        </div>
      </div>
    )
  }
)

/**
 * Подсказка под поиском — узел `Text Help`, свойство
 * `Show Text Help`. По спецификации поля поиска именно она
 * стоит на месте списка, пока в строку не ввели минимум три символа:
 * «Начните вводить параметры поиска».
 */
const DropdownHelp = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(function DropdownHelp({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="dropdown-help"
      className={cn(
        "w-full shrink-0 px-4 pt-3 pb-4 text-p2-regular text-[var(--menu-item-description-fg)]",
        className
      )}
      {...props}
    />
  )
})

export { DropdownSearch, DropdownHelp }
export type { DropdownSearchProps }
