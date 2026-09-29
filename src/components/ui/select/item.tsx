import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"

import { clipText } from "./clip-text"

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
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
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 py-4 pr-12 pl-4 text-p1-medium text-[var(--select-fg)] outline-hidden select-none data-highlighted:bg-[var(--menu-item-bg-highlighted)] data-disabled:pointer-events-none data-disabled:text-[var(--select-label-fg)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      {/* Длинная подпись обрезается многоточием до галочки: раньше текст был
          `shrink-0`, шёл под галочку и срезался краем списка без многоточия.
          Голый текст во флексе — анонимный блок, многоточия он не получает,
          поэтому строки и числа обёрнуты в свой узел с многоточием.
          `overflow-clip` с запасом, а не `truncate`: `overflow-hidden`
          срезал у «Д» выносной элемент левее начала строки, и короткие
          пункты переставали совпадать с прежними до пикселя. */}
      <SelectPrimitive.ItemText className="flex min-w-0 flex-1 gap-2 whitespace-nowrap">
        {clipText(children)}
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
    </SelectPrimitive.Item>
  )
}

export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
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
