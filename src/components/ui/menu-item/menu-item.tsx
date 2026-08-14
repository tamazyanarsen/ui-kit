import * as React from "react"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

/**
 * MenuItem — централизованная строка выпадающего списка.
 *
 * Дизайн-чек №21: «нужно централизованно исполнить компонент дропдаун, в
 * котором также внутри использовать централизованную строку меню, которая
 * называется menu item, и она прокидывается во все компоненты, где
 * необходимо вызвать выпадающий список. В этом выпадающем списке тексты
 * главные пишутся с помощью стиля P1-medium… Также нужно исправить
 * выравнивание, чтобы чекбокс сравнялся по первой строке».
 *
 * Раньше строку каждый компонент рисовал сам: Select — уже правильно (P1
 * Medium), а Combobox/Autocomplete — с P2 Regular и костыльным `mt-0.5` у
 * чекбокса, отчего текст стоял выше галочки. Отсюда и замечание.
 *
 * Метрики взяты из компонент-сета «Menu Point (ELK)», вариант
 * `Size=Desktop, State=Default, Type=Level 1, Style=Text` (нода
 * 28080:55911):
 *
 *   строка      flex, gap 8, items-start, padding 16 со всех сторон
 *   ведущий     своя колонка `items-center` + pr-8 (итого 16 до текста)
 *   Label       P2 Medium 14/20, grey-284 — необязательная строка сверху
 *   основной    P1 Medium 16/24, grey-1514
 *   Description P3 Medium 12/16, grey-284
 *
 * Ведущий элемент (чекбокс/иконка) — 24px, ровно как высота первой строки
 * основного текста (16/24). Поэтому при `items-start` он совпадает с ней
 * сам, без подкручивания отступами.
 */

const MENU_ITEM_ROW_CLASS =
  "relative flex w-full cursor-default items-start gap-4 p-4 text-left outline-hidden select-none"

interface MenuItemContentProps {
  /** Ведущий элемент: чекбокс, иконка, тумбнейл. */
  leading?: React.ReactNode
  /** Необязательная подпись НАД основным текстом (Label в макете). */
  label?: React.ReactNode
  children: React.ReactNode
  /** Description — строка под основным текстом. */
  description?: React.ReactNode
  /** Замыкающий элемент: галочка выбора, счётчик. */
  trailing?: React.ReactNode
}

/**
 * Внутренности строки без самого контейнера — контейнером выступает
 * `Combobox.Item`, `Menu.Item` или обычная кнопка, у каждого свои
 * обработчики и data-атрибуты. Классы контейнера берите из
 * `menuItemRowClass()`.
 */
function MenuItemContent({
  leading,
  label,
  children,
  description,
  trailing,
}: MenuItemContentProps) {
  return (
    <>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {label && (
          <span className="truncate text-p2-medium text-[var(--menu-item-description-fg)]">
            {label}
          </span>
        )}
        <span className="truncate text-p1-medium text-[var(--menu-item-fg)]">
          {children}
        </span>
        {description && (
          <span className="truncate text-p3-medium text-[var(--menu-item-description-fg)]">
            {description}
          </span>
        )}
      </span>
      {trailing}
    </>
  )
}

/** Классы контейнера строки. `highlighted` — селектор подсветки того
 *  примитива, в который строка вкладывается (у Base UI это
 *  `data-highlighted`, у обычной кнопки — `hover`). */
function menuItemRowClass(highlighted: string, className?: ClassValue) {
  return cn(MENU_ITEM_ROW_CLASS, highlighted, className)
}

export { MenuItemContent, menuItemRowClass, MENU_ITEM_ROW_CLASS }
export type { MenuItemContentProps }
