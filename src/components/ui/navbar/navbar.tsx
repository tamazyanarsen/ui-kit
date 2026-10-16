import * as React from "react"
import { ChevronLeft, CircleHelp } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { useComposedRefs } from "@/lib/compose-refs"
import { ViewportScope } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { useScrolled } from "./use-scrolled"

// Navbar — `ELK / navbar` (сет 70482:6600, версия 1.0.0, релиз 70.38),
// канвас «Header, Menu», дока 70482:6613: «Navigation Bar — компонент для
// навигации в мобильной версии». Стоит под мобильной шапкой, над заголовком
// страницы (`ELK / title-page` Size=Mobile), и забирает у заголовка кнопки
// «Назад» и «Справка» — у мобильного Title их нет.
//
// Два типа:
//   • `Top` — «до скролирования экрана»: кнопка «Назад» с подписью
//     (S Mobile, 12/16, поля 16/20) слева и круглая «Справка» справа.
//     Опционально — только справка.
//   • `Scroll` — «после скролирования»: «Назад» становится кругом 32 с одной
//     иконкой, по центру плашка даты, справа та же «Справка»; у всех трёх
//     Universal shadow. Опционально — справка и дата.
//
// Поля полосы 16 по бокам, 16 сверху и 8 снизу, высота 56. Подложка —
// градиент от цвета страницы (Grey 109) наверху к прозрачному внизу: в
// прилипшем состоянии контент уходит под полосу, плавно гаснув, а не
// обрезается краем.
//
// «При скроллировании экрана кнопка „Назад“ меняет форму на круг с иконкой,
// а компонент фиксируется в верхней части экрана» — поэтому по умолчанию
// полоса липкая (`sticky`) и сама выбирает тип по прокрутке (`type="auto"`).
// Явный `type` отключает слежение — так рисуются матрица и статичные макеты.

type NavbarType = "top" | "scroll"

interface NavbarProps extends Omit<React.ComponentProps<"nav">, "children"> {
  /** `Type` из Figma. `auto` — `top`, пока экран не проскроллен до полосы. */
  type?: NavbarType | "auto"
  /** Липнуть к верху прокрутки. По умолчанию — да. */
  sticky?: boolean
  /** Подпись «Назад» в типе Top. В Scroll остаётся доступным именем круга. */
  backLabel?: string
  onBack?: () => void
  /** `Show Help`. */
  showHelp?: boolean
  /** Доступное имя круглой кнопки справки. */
  helpLabel?: string
  onHelp?: () => void
  /** `Show Date` — плашка по центру, только в типе Scroll. */
  date?: React.ReactNode
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    className,
    type = "auto",
    sticky = true,
    backLabel = "Назад",
    onBack,
    showHelp = true,
    helpLabel = "Справка",
    onHelp,
    date,
    ...props
  },
  ref
) {
  const innerRef = React.useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(innerRef, ref)
  const scrolled = useScrolled(innerRef, type === "auto")
  const resolvedType: NavbarType = type === "auto" ? (scrolled ? "scroll" : "top") : type
  const isScroll = resolvedType === "scroll"

  return (
    <nav
      ref={composedRef}
      data-slot="navbar"
      data-type={resolvedType}
      aria-label="Навигация по странице"
      className={cn(
        "flex h-14 w-full items-center justify-between px-4 pt-4 pb-2",
        "bg-linear-to-b from-[var(--navbar-bg)] to-transparent",
        sticky && "sticky top-0 z-10",
        className
      )}
      {...props}
    >
      {/* Полоса существует только в мобильной форме: без скоупа кнопки S
          на широком окне взяли бы десктопный кегль 14/20 вместо 12/16. */}
      <ViewportScope viewport="mobile">
        <Button
          variant="secondary-white"
          size="sm"
          icon={ChevronLeft}
          iconPosition={isScroll ? "only" : "left"}
          aria-label={isScroll ? backLabel : undefined}
          onClick={onBack}
          className={cn(isScroll && "shadow-universal")}
        >
          {isScroll ? undefined : backLabel}
        </Button>

        {isScroll && hasNode(date) && (
          <span
            data-slot="navbar-date"
            className="min-w-0 truncate rounded-[16px] bg-[var(--navbar-date-bg)] px-4 pt-[5px] pb-[3px] text-p3-medium text-[var(--navbar-date-fg)] shadow-universal"
          >
            {date}
          </span>
        )}

        {/* Правый контейнер держит ширину 32 и без справки — иначе дата
            съехала бы из центра к правому краю. */}
        <div className="flex min-w-8 shrink-0 items-center justify-end">
          {showHelp && (
            <Button
              variant="secondary-white"
              size="sm"
              icon={CircleHelp}
              iconPosition="only"
              aria-label={helpLabel}
              onClick={onHelp}
              className={cn(isScroll && "shadow-universal")}
            />
          )}
        </div>
      </ViewportScope>
    </nav>
  )
})

export { Navbar }
export type { NavbarProps, NavbarType }
