import type * as React from "react"

import { cn } from "@/lib/utils"

// CreateMenu — «Раскрытое меню создания» (нода 70303:57990): панель, которая
// раскрывается под шапкой по кнопке «Создать». Отличается от меню навигации
// только наполнением: вместо колонок со ссылками — сетка плиток
// «New Document Card» 160×152 (нода 70303:61209).
//
// Плитка: фон Grey 109, скругление 16, паддинг 16, интервал 16; сверху
// подложка `ELK / thumbnail` 48×48 (белая, скругление 8, паддинг 12) с
// иконкой 24px, снизу название в две строки P1 Medium.

interface CreateMenuItem {
  value: string
  label: React.ReactNode
  /** Иконка 24px внутри белой подложки. */
  icon?: React.ReactNode
  onClick?: () => void
}

interface CreateMenuProps {
  items?: CreateMenuItem[]
  className?: string
}

function CreateMenu({ items = [], className }: CreateMenuProps) {
  return (
    <div
      data-slot="header-create-menu"
      className={cn(
        "flex w-full flex-col items-center overflow-hidden rounded-b-[32px] bg-[var(--header-bg)] px-10",
        className
      )}
    >
      <div className="flex w-full max-w-[1800px] flex-col items-start pt-4 pb-10">
        <div className="flex w-full flex-wrap content-start items-start gap-6">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              data-slot="header-create-menu-item"
              onClick={item.onClick}
              className="flex h-38 w-40 min-h-36 min-w-36 shrink-0 cursor-pointer flex-col items-start gap-4 rounded-[16px] bg-[var(--header-menu-tile-bg)] p-4 text-left outline-none transition-colors hover:bg-[var(--header-item-hover-bg)]"
            >
              {item.icon && (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--header-menu-tile-icon-bg)] p-3 text-[var(--header-icon-fg)] [&_svg]:size-6">
                  {item.icon}
                </span>
              )}
              {/* Плитка без иконки в макете (нода 70303:61213) отдаёт всю
                  высоту названию и центрирует его по вертикали. */}
              <span
                className={cn(
                  "flex min-h-12 w-full flex-col items-start overflow-hidden text-p1-medium text-[var(--header-fg)]",
                  !item.icon && "flex-1 justify-center"
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { CreateMenu }
export type { CreateMenuProps, CreateMenuItem }
