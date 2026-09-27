import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check } from "@/icons"

import { cn } from "@/lib/utils"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import {
  COMBOBOX_CHECKBOX_BASE_CLASS,
  ComboboxCheckbox,
  type ComboboxCheckboxState,
} from "./checkbox"

// Шаг отступа для уровней дерева: макет показывает равномерно
// сдвигающиеся «Уровень 2/3/4», из которых здесь на самом деле выбираемы
// только два (родитель и ребёнок). Второй проход: стояло 24, а замер по
// литеральному вложенному инстансу «Menu Point (ELK)» дал шаг 16 (уровень 0
// это pl-[16px], уровень 1 — pl-[32px]), а не 24.
const COMBOBOX_INDENT_PX = 16

// Item — a real, selectable leaf (checkbox + Text + Description).

interface ComboboxItemOwnProps {
  description?: React.ReactNode
  level?: 0 | 1
}

export function ComboboxItem({
  className,
  children,
  description,
  level = 0,
  style,
  ...props
}: ComboboxPrimitive.Item.Props & ComboboxItemOwnProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      // Второй проход: совпадает с литеральными инстансами «Menu Point
      // (ELK)» с флажком, снятыми с канваса (и с обычного примера
      // выпадающего списка, и с вложенного деревом): p-[16px] со всех
      // сторон (а не py-2/pr-3/pl-3), gap-[16px] между флажком и текстовым
      // блоком (а не gap-2.5) и отсутствие собственного радиуса углов
      // (снято пипеткой с Menu Point в состоянии наведения: жёсткий прямой
      // угол, скругление приходит только от обрезки самим всплывающим
      // окном), плюс фон подсветки #F8F8F8 вместо общего токена --accent.
      className={menuItemRowClass(
        "group/item data-highlighted:bg-[var(--menu-item-bg-highlighted)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      style={
        level
          ? { paddingLeft: 16 + level * COMBOBOX_INDENT_PX, ...style }
          : style
      }
      {...props}
    >
      <MenuItemContent
        description={description}
        leading={
          <span
            aria-hidden="true"
            className={cn(
              COMBOBOX_CHECKBOX_BASE_CLASS,
              // Дизайн-чек №21: `mt-0.5` больше не нужен. Чекбокс 24px и
              // первая строка основного текста (P1 Medium 16/24) теперь
              // одной высоты, поэтому `items-start` совмещает их сам.
              "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] text-transparent group-data-[selected]/item:border-transparent group-data-[selected]/item:bg-[var(--checkbox-checked-bg)] group-data-[selected]/item:text-[var(--checkbox-checked-fg)] group-data-disabled/item:!border-[var(--checkbox-disabled-border)] group-data-disabled/item:!bg-[var(--checkbox-disabled-bg)]"
            )}
          >
            <ComboboxPrimitive.ItemIndicator>
              <Check className="size-4" strokeWidth={3} />
            </ComboboxPrimitive.ItemIndicator>
          </span>
        }
      >
        {children}
      </MenuItemContent>
    </ComboboxPrimitive.Item>
  )
}

// GroupRow — родительский флажок первого уровня в двухуровневом дереве. По
// макету это *не* самостоятельное выбираемое значение, а производный
// контрол: он показывает промежуточное или отмеченное состояние по выбору
// своих детей и переключает их всех разом. Значение `state` вызывающий код
// вычисляет сам из своего состояния выбора и значений детей.

export function ComboboxGroupRow({
  className,
  label,
  description,
  state,
  onToggle,
  disabled,
}: {
  className?: string
  label: React.ReactNode
  description?: React.ReactNode
  state: ComboboxCheckboxState
  onToggle: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      data-slot="combobox-group-row"
      className={menuItemRowClass(
        "hover:bg-[var(--menu-item-bg-highlighted)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <MenuItemContent
        description={description}
        leading={<ComboboxCheckbox state={state} disabled={disabled} />}
      >
        {label}
      </MenuItemContent>
    </button>
  )
}
