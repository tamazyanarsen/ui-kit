import { cn } from "@/lib/utils"
import { PageLink, type HeaderMenuGroup } from "@/components/ui/header-menu"

// Карточка «Группа страниц» меню сотрудника (нода 70396:22374).
//
// Метрики сняты с макета один в один: белая заливка, скругление 16,
// внутренние поля 32, интервал 24 между заголовком и списком и 16 между
// ссылками. Заголовок — P1 Medium серым Grey 284.
//
// От одноимённой карточки раскрытого меню клиента (`PageGroup`) отличается
// только оболочкой — заливкой, скруглением и цветом заголовка, — поэтому
// САМА СТРОКА берётся оттуда же (`PageLink`), а не пишется заново: в макете
// это один символ «Ссылка на страницу» с той же звездой 16px, тем же
// прижатием вправо и той же прозрачностью до наведения.
//
// Иконки у заголовка здесь нет: в клиентском меню группа несёт `icon / round`
// 16px, а в меню сотрудника (все четыре кадра раздела 70396:22292) заголовок
// стоит один. `group.icon` поэтому молча не рисуется — тип общий, а раскладка
// разная.

interface EmployeeMenuGroupProps {
  group: HeaderMenuGroup
  /** Значения ссылок, помеченных звездой. */
  favourites?: string[]
  /** Звёзды показываются только там, где избранное вообще можно менять. */
  showFavourites?: boolean
  /** Значение текущего раздела — подсвечивается брендовым цветом. */
  activeLink?: string
  onFavouriteToggle?: (value: string) => void
  className?: string
}

function EmployeeMenuGroup({
  group,
  favourites = [],
  showFavourites = true,
  activeLink,
  onFavouriteToggle,
  className,
}: EmployeeMenuGroupProps) {
  return (
    <div
      data-slot="employee-menu-group"
      data-value={group.value}
      className={cn(
        "flex w-full flex-col gap-6 rounded-[16px] bg-[var(--employee-menu-group-bg)] p-8",
        className
      )}
    >
      <p className="w-full text-p1-medium text-[var(--employee-menu-group-fg)]">
        {group.title}
      </p>
      <div className="flex w-full flex-col gap-4">
        {group.links.map((link) => (
          <PageLink
            key={link.value}
            link={link}
            favourite={favourites.includes(link.value)}
            showStar={showFavourites}
            active={link.value === activeLink}
            onFavouriteToggle={onFavouriteToggle}
          />
        ))}
      </div>
    </div>
  )
}

export { EmployeeMenuGroup }
export type { EmployeeMenuGroupProps }
