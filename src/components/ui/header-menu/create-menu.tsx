import type * as React from "react"

import { cn } from "@/lib/utils"
import { compactList } from "./compact-list"
import { withIconSize } from "@/lib/icon-size"
import { Grid } from "@/components/ui/grid"
import { Scrollbar } from "@/components/ui/scrollbar"

// CreateMenu — «Раскрытое меню создания»: панель, которая
// раскрывается под шапкой по кнопке «Создать». Отличается от меню навигации
// только наполнением: вместо колонок со ссылками — сетка плиток
// «New Document Card» 160×152.
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
  /**
   * Предел высоты панели. Когда плитки не помещаются, внутри появляется
   * своя прокрутка — как у меню навигации (`HeaderMenu.maxHeight`).
   */
  maxHeight?: number | string
  className?: string
}

function CreateMenu({ items = [], maxHeight, className }: CreateMenuProps) {
  const scrollable = maxHeight !== undefined
  const grid = (
    // С прокруткой поля сверху и снизу отдаёт рамка полосы (см. ниже), а
    // не сетка — иначе они сложились бы и панель выросла.
    <Grid
      className={cn(
        "flex flex-col items-start",
        scrollable ? "pt-2 pb-0" : "pt-4 pb-10"
      )}
    >
      <div className="flex w-full flex-wrap content-start items-start gap-6">
        {(compactList(items) ?? []).map((item) => (
          <button
            key={item.value}
            type="button"
            data-slot="header-create-menu-item"
            onClick={item.onClick}
            className="flex h-38 w-40 min-h-36 min-w-36 shrink-0 cursor-pointer flex-col items-start gap-4 rounded-[16px] bg-[var(--header-menu-tile-bg)] p-4 text-left outline-none transition-colors focus-visible:focus-ring hover:bg-[var(--header-item-hover-bg)]"
          >
            {item.icon && (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--header-menu-tile-icon-bg)] p-3 text-[var(--header-icon-fg)] [&_svg]:size-6">
                {/* Слот плитки — всегда 24×24, поэтому и начертание берётся
                    двадцатичетвёрочное. Раньше сюда приезжал шестнадцатый
                    глиф и растягивался классом `[&_svg]:size-6` вместе со
                    штрихом — дизайн-чек от 08.09, замечание 31. */}
                {withIconSize(item.icon, 24)}
              </span>
            )}
            {/* Плитка без иконки в макете отдаёт всю
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
    </Grid>
  )

  return (
    <div
      data-slot="header-create-menu"
      className={cn(
        "flex w-full flex-col items-center overflow-hidden rounded-b-[32px] bg-[var(--header-bg)]",
        className
      )}
    >
      {scrollable ? (
        // Аудит 14: без предела панель в низком окне обрезалась снизу, а
        // прокрутить её было нечем — страница под оверлеем заблокирована.
        // Прокрутка та же, что у меню навигации (см. HeaderMenu).
        //
        // Раскладка, пока плитки помещаются, та же до пикселя, что без
        // предела. Рамка `inset="panel"` занимает место (8 сверху, 48 снизу,
        // 8 справа), поэтому: сверху 8 рамки + 8 у сетки = прежние 16;
        // снизу 48 рамки − 8 (`-mb-2`, срезает прозрачный край корень с
        // `overflow-hidden`) = прежние 40, и дорожка всё равно кончается до
        // скругления 32. Справа рамка съедает 8, а ширина сетки считается
        // от контейнера (`--grid-content-width` = 100% − 2 поля) — поэтому
        // обёртка на 8 шире окна прокрутки, и сетка той же ширины и на том
        // же месте; лишние 8 под рамкой срезает `overflow-x-hidden` самого
        // окна прокрутки.
        <Scrollbar
          inset="panel"
          className="-mb-2 w-full"
          style={{ maxHeight }}
        >
          <div className="flex w-[calc(100%+8px)] justify-center">{grid}</div>
        </Scrollbar>
      ) : (
        grid
      )}
    </div>
  )
}

export { CreateMenu }
export type { CreateMenuProps, CreateMenuItem }
