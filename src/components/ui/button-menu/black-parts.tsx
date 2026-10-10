import * as React from "react"

import { cn } from "@/lib/utils"
import { CloseCross } from "@/components/ui/close-cross"

// Части чёрной панели, вынесенные из `black.tsx` (лимит 400 строк на файл):
// информационная полоса в двух формах, крестик и подпись «нет действий».

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

/**
 * Подпись вместо пустой зоны действий — «Menu Black Buttons (ELK)»,
 * `Number Of Buttons=None` (дизайн-чек от 08.10, замечание 2: «Должен быть
 * текст „Нет общих действий для выбранных элементов“»). Цвет — Grey 284, а не
 * подпись информационной полосы (Grey 166): это не значение, а пояснение.
 */
const BLACK_EMPTY_ACTIONS_TEXT = "Нет общих действий для выбранных элементов"

function BlackEmptyActions({
  children,
  mobile,
}: {
  children: React.ReactNode
  mobile?: boolean
}) {
  return (
    <p
      data-slot="button-menu-black-actions"
      data-empty=""
      className={cn(
        "text-[var(--button-menu-black-empty-fg)]",
        // Desktop: P2 Medium 14/20 в одну строку (мастер — `whitespace-nowrap`),
        // на узкой полосе обрезается многоточием, а не уезжает под информацию.
        // Mobile: P2 Medium Mobile 12/16 с переносом и полями 8 сверху/снизу —
        // рамка символа Size=Mobile, None (328×48).
        mobile
          ? "w-full py-2 text-p3-medium"
          : "min-w-0 flex-1 truncate text-p2-medium"
      )}
    >
      {children}
    </p>
  )
}

/** Плоский крестик панели — `icon / close cross` 24px, не кнопка на плашке. */
function BlackClose({ onClose }: { onClose: () => void }) {
  return (
    /* Ступень нажатия переопределена: общее умолчание темнит глиф до
       Grey 1514, а на чёрной панели это сделало бы его невидимым. */
    <CloseCross
      size={24}
      onClick={onClose}
      className="shrink-0 text-[var(--button-menu-black-fg)] [--close-cross-fg-active:var(--button-menu-black-muted-fg)]"
    />
  )
}

/**
 * Информационная полоса Desktop — колонки «подпись над значением» справа.
 *
 * Сжимается ПОСЛЕ действий: не поместившиеся колонки переносятся на вторую
 * строку, а та срезана высотой одной колонки (40); оставшаяся одна колонка
 * обрезается многоточием. Совсем узкой панели (контент уже 180) информации не
 * показать — она прячется.
 */
function BlackInfoDesktop({ items }: { items: ButtonMenuBlackInfoItem[] }) {
  return (
    <div
      data-slot="button-menu-black-info"
      className="flex max-h-10 min-w-0 flex-wrap content-start items-center justify-end gap-8 overflow-clip text-p2-medium [overflow-clip-margin:4px] @max-[180px]/black:hidden"
    >
      {items.map((item, index) => (
        // Перенос не допускается, ширина колонки динамическая
        // (дизайн-чек от 07.09, №4).
        <div
          key={index}
          className={cn("flex min-w-0 flex-col items-start whitespace-nowrap", item.className)}
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
  )
}

/**
 * Информационная полоса Mobile — «Information (ELK)», Size=Mobile.
 *
 * Одно поле — строкой «Выбрано: 10» (Value=1, подпись с двоеточием и зазор
 * 4). Два-три поля — таблицей: подпись и значение в колонках 3fr/5fr (сетка
 * мастера: span 3 из 8 и span 5 из 8), строки через 8. Кегль — P2 Medium
 * Mobile 12/16. Значение режется многоточием, подпись — нет.
 */
function BlackInfoMobile({ items }: { items: ButtonMenuBlackInfoItem[] }) {
  if (items.length === 1) {
    const [item] = items
    return (
      <div
        data-slot="button-menu-black-info"
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1 text-p3-medium whitespace-nowrap",
          item.className
        )}
      >
        <span className="shrink-0 text-[var(--button-menu-black-muted-fg)]">
          {item.label}:
        </span>
        <span className="min-w-0 flex-1 truncate text-[var(--button-menu-black-fg)]">
          {item.value}
        </span>
      </div>
    )
  }
  return (
    <div
      data-slot="button-menu-black-info"
      className="flex min-w-0 flex-1 flex-col gap-2 text-p3-medium"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("grid grid-cols-[3fr_5fr] whitespace-nowrap", item.className)}
        >
          <span className="min-w-0 truncate text-[var(--button-menu-black-muted-fg)]">
            {item.label}
          </span>
          <span className="min-w-0 truncate text-[var(--button-menu-black-fg)]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export {
  BLACK_EMPTY_ACTIONS_TEXT,
  BlackClose,
  BlackEmptyActions,
  BlackInfoDesktop,
  BlackInfoMobile,
}
export type { ButtonMenuBlackInfoItem }
