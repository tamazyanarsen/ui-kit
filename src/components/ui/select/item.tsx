import type * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"
import { MenuSheetItem } from "@/components/ui/menu-sheet"

import { clipText } from "./clip-text"
import { useSelectSheet } from "./sheet"

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  if (useSelectSheet()) {
    return (
      <div
        data-slot="select-label"
        className={cn("px-4 py-2 text-p3-medium text-muted-foreground", typeof className === "string" ? className : undefined)}
      >
        {props.children as React.ReactNode}
      </div>
    )
  }
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-p3-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  // Мобильная штора (Правки UI-Kit от 25.10, см. ./sheet.tsx): пункт — строка
  // шторы с галкой у выбранного; нажатие применяет выбор и закрывает штору
  // (у множественного выбора — переключает и оставляет открытой).
  const sheet = useSelectSheet()
  if (sheet) {
    return (
      <MenuSheetItem
        role="option"
        data-slot="select-item"
        text={clipText(children as React.ReactNode, "wrap")}
        checked={sheet.isSelected(props.value)}
        disabled={props.disabled}
        closeOnSelect={!sheet.multiple}
        className={typeof className === "string" ? className : undefined}
        onSelect={(event) => sheet.choose(props.value, event.nativeEvent)}
      />
    )
  }
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      // Второй проход: совпадает с литеральными инстансами «Menu Point
      // (ELK), Type=Level 1, Style=Text», снятыми прямо с канваса — и с
      // самостоятельного компонента, и с конкретных применений внутри
      // настоящих инстансов «ELK / dropdown». А именно: p-[16px] со всех
      // сторон (а не py-2/pr-8/pl-3), собственного радиуса углов нет
      // (снято пипеткой: заливка наведения у пункта доходит до жёсткого
      // прямого угла, скругление приходит только от обрезки самим
      // всплывающим окном), текст 16px насыщенности 500 цветом
      // var(--select-fg) (раньше наследовался почти-чёрный
      // text-popover-foreground из shadcn вместо #252628 из макета — тот же
      // класс ошибок, ради ловли которых и затеян весь этот проход), и фон
      // подсветки #F8F8F8 вместо общего токена --accent. Заодно `focus:`
      // заменён на `data-highlighted:`: собственные
      // SelectItemDataAttributes у Base UI определяют только highlighted,
      // selected и disabled, но не настоящий хук фокуса DOM, поэтому
      // `focus:` здесь никогда не совпадал с оформлением наведения из
      // макета при навигации с клавиатуры.
      //
      // Правки UI-Kit от 25.10 — одно поведение у всех строк выпадающих
      // списков: наведение/подсветка Grey 114, нажатие Grey 124 (`menu-row`),
      // курсор — рука, у выключенной not-allowed (styles/rules-lists.css);
      // на зажатие содержимое сжимается к центру строки одним целым — поэтому
      // текст и галочка лежат в одной обёртке, и поля строки стоят на ней:
      // центр обёртки и есть центр строки. Прежняя опора на левый край
      // (`--press-origin:left_center`) снята.
      className={cn(
        "flex w-full text-p1-medium text-[var(--select-fg)] outline-hidden select-none menu-row press-scale-content data-disabled:text-[var(--select-label-fg)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-content"
        className="relative flex w-full min-w-0 items-center gap-2 py-4 pr-12 pl-4"
      >
        {/* Правки UI-Kit от 25.10: длинная подпись переносится, строка
            растёт по высоте — многоточия в строках списков нет. Подряд
            идущий текст по-прежнему склеивается в один узел (`clipText`),
            только в режиме переноса. Многоточие осталось в значении
            триггера Select — там высота поля фиксирована. */}
        <SelectPrimitive.ItemText className="flex min-w-0 flex-1 gap-2">
          {clipText(children, "wrap")}
        </SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute right-4 flex size-4 items-center justify-center" />
          }
        >
          {/* Дизайн-чек от 08.09, замечание 19: галочка выбранного всегда
              цветная — зелёная в зелёной теме, голубая в голубой. Своего цвета
              у иконки не было вовсе, и она наследовала почти чёрный цвет
              подписи строки. */}
          <CheckIcon className="pointer-events-none text-[var(--check-mark-fg)]" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  if (useSelectSheet()) {
    return <Divider className="pointer-events-none my-1" />
  }
  return (
    // Рисует общий Divider («ELK / divider» из макета, grey-134 #DEDEDE).
    // Раньше здесь стоял `bg-border` — общий токен shadcn,
    // oklch(0.922 0 0) ≈ #E5E5E5, — а это другой серый, отличный от всех
    // прочих разделителей кита.
    <SelectPrimitive.Separator
      data-slot="select-separator"
      render={<Divider className={cn("pointer-events-none -mx-1 my-1", className)} />}
      {...props}
    />
  )
}
