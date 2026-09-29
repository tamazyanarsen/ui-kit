import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { LoaderCircle, Search, X } from "@/icons"

import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"
import { Dropdown } from "@/components/ui/dropdown"

import { useComboboxSearchText } from "./root"

// Portal, Positioner и Popup. По макету: зазор до триггера 8px, ширина
// равна ширине триггера, высота зажата между 168 и 504px (и всё равно
// ужимается под вьюпорт).

export function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 w-(--anchor-width)"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          render={
            <Dropdown
              className={cn(
                "isolate flex max-h-[min(504px,var(--available-height))] min-h-42 w-full flex-col overflow-hidden",
                className
              )}
            />
          }
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

// Поле поиска живёт внутри всплывающего окна, а не в триггере. По макету:
// значок поиска слева, крутилка на время запроса (показывается *вместе* с
// кнопкой очистки, а не вместо неё) и кнопка очистки, когда есть текст.

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
export const ComboboxSearchInput = React.forwardRef<
  HTMLInputElement,
  ComboboxPrimitive.Input.Props & { loading?: boolean }
>(function ComboboxSearchInput({
  className,
  loading = false,
  onChange,
  ...props
}, ref) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const setRef = useComposedRefs(inputRef, ref)
  // Текст поиска — из корня кита. Вне него (голый Root Base UI) — из
  // собственного ввода: хотя бы набранное с клавиатуры кнопка увидит.
  const rootText = useComboboxSearchText()
  const [typed, setTyped] = React.useState("")
  const hasText = (rootText ?? typed) !== ""

  // ⚠️ Не `Combobox.Clear` Base UI: в множественном выборе он виден только
  // при непустом ВЫБОРЕ и стирает разом поиск и все отмеченные пункты. Здесь
  // очищается только строка — нативным событием ввода, чтобы Base UI сам
  // обновил поиск и фильтр, как при наборе с клавиатуры.
  function clearSearch() {
    const input = inputRef.current
    if (!input) return
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set
    setter?.call(input, "")
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.focus()
  }

  return (
    // Второй проход: совпадает с литеральной строкой поиска
    // «ELK / input», снятой с собственных инстансов выпадающего списка, —
    // p-[16px] (а не px-3/py-2.5), значок поиска size-[24px] (а не
    // size-4), текст 16px (а не text-sm), и нижняя рамка самой строки —
    // литеральный grey-134 #DEDEDE из макета, а не общий токен кита
    // --border (#E5E5E5, близко, но не точное совпадение).
    //
    // Высота строки 56 (16 + 24 + 16): в макете рамка лежит ВНУТРИ
    // размера, а в CSS нижняя рамка добавляется сверху, поэтому нижний
    // отступ 15px, а не 16 — иначе строка была бы 57.
    <div className="flex shrink-0 items-center gap-2 border-b border-[var(--menu-item-divider)] p-4 pb-[15px]">
      <Search
        size={24}
        aria-hidden="true"
        className="size-6 shrink-0 text-[var(--select-icon-fg)]"
      />
      <ComboboxPrimitive.Input
        ref={setRef}
        data-slot="combobox-search"
        className={cn(
          // В строке поиска «ELK / dropdown» текст поиска лежит в обёртке
          // font-['Object_Sans:Medium'] — Medium размером 16px, а не
          // браузерное умолчание.
          "h-6 w-full min-w-0 border-0 bg-transparent text-p1-medium text-[var(--select-fg)] outline-none focus-visible:focus-ring placeholder:text-[var(--select-label-fg)]",
          className
        )}
        onChange={(event) => {
          setTyped(event.currentTarget.value)
          onChange?.(event)
        }}
        {...props}
      />
      {loading && (
        <LoaderCircle
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin text-[var(--btn-primary-bg-hover)]"
        />
      )}
      {hasText && (
        <button
          type="button"
          aria-label="Очистить поиск"
          onClick={clearSearch}
          className="flex shrink-0 items-center justify-center text-[var(--select-icon-fg)] outline-none focus-visible:focus-ring"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  )
})

// Status и Empty — текст подсказки, отсутствия результатов или ошибки,
// который показывается между полем поиска и списком («Начните вводить
// параметры поиска», «Поиск не дал результатов...» и подобное).

export function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        // Второй проход: совпадает с литеральной подсказкой «Text Help»,
        // снятой с собственного инстанса выпадающего списка с подсказкой
        // поиска, — pt-[12px]/pb-[16px]/px-[16px], а не равномерные
        // px-3/py-2.5. Текст состояния «Empty» у самого списка —
        // Object Sans Medium (P2 Medium), а не Regular, несмотря на
        // приглушённый цвет --select-caption-fg.
        "px-4 pt-3 pb-4 text-p2-medium text-[var(--select-caption-fg)] empty:hidden",
        className
      )}
      {...props}
    />
  )
}

export function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        // Второй проход: совпадает с литеральной подсказкой «Text Help»,
        // снятой с собственного инстанса выпадающего списка с подсказкой
        // поиска, — pt-[12px]/pb-[16px]/px-[16px], а не равномерные
        // px-3/py-2.5. Текст состояния «Empty» у самого списка —
        // Object Sans Medium (P2 Medium), а не Regular, несмотря на
        // приглушённый цвет --select-caption-fg.
        "px-4 pt-3 pb-4 text-p2-medium text-[var(--select-caption-fg)] empty:hidden",
        className
      )}
      {...props}
    />
  )
}

export function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("py-1 first:pt-0 last:pb-0", className)}
      {...props}
    />
  )
}

export function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

export function ComboboxSectionLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-section-label"
      className={cn(
        "px-3 pt-2 pb-1 text-p3-medium text-[var(--select-fg)]",
        className
      )}
      {...props}
    />
  )
}

// Прокручиваемая область под строкой поиска (строка необязательная).

export function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      // Отступов у списка нет: блок Lines в макете начинается сразу под
      // строкой поиска, а первая строка несёт свои 16px сама.
      className={cn("themed-scrollbar flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
}
