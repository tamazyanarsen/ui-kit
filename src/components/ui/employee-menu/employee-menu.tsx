import { useMediaQuery } from "@/lib/use-media-query"
import { GridCol, GridRow } from "@/components/ui/grid"
import {
  distributeMenuGroups,
  type HeaderMenuGroup,
} from "@/components/ui/header-menu"

import { EmployeeMenuGroup } from "./employee-menu-group"

// EmployeeMenu — «Меню сотрудника на главном экране» (раздел 70396:22292).
//
// Это НОВОЕ меню сотрудника, которое приходит на смену `Sidebar`
// («Боковая панель для сотрудников»): вместо рельса слева весь навигационный
// узел лежит карточками прямо на главной, а закреплённые звездой разделы
// уезжают в верхнюю панель (см. `EmployeeMenuNav`).
//
// Ключевая механика — одна на оба места. Звезда справа от ссылки и пункт в
// верхней панели это ОДНО состояние, а не два списка: комментарий макета
// «Стартовый набор избранного у сотрудника» (нода 70396:22582) перечисляет
// начальный набор — Письма, Справки, Платежи, Платежи СБП, Продуктовый
// каталог, — а кадр «Главная — Нет избранного» подсказывает пустой панели
// «наведите курсор на элемент на главной и нажмите ☆ справа». Поэтому
// компонент не хранит избранное сам, а получает его сверху: владелец один и
// тот же и для меню, и для шапки.
//
// Раскладка — та же сетка продукта, что и везде: 12 колонок с желобом 24.
// Четыре колонки по три (432 при полосе 1800) и три по четыре (384 при 1200)
// — ровно ширины кадров «Главная» (1920) и «Главная — Адаптив» (1280).
// Порог между ними взят общий с раскрытым меню клиента (1536, дизайн-чек от
// 08.09, замечание 3): в макете сотрудника промежуточных кадров нет, а
// разводить два разных порога для двух раскладок одной и той же «Группы
// страниц» было бы хуже, чем один общий.

interface EmployeeMenuProps {
  groups?: HeaderMenuGroup[]
  /**
   * Сколько колонок раскладывать.
   *
   * По умолчанию считается от ширины вьюпорта (4 с 1536px, 3 ниже). Явное
   * значение перекрывает расчёт — им пользуются витрины, которым нужно
   * показать обе раскладки рядом.
   */
  columns?: 2 | 3 | 4
  /** Значения ссылок, помеченных звездой, в порядке закрепления. */
  favourites?: string[]
  onFavouriteToggle?: (value: string) => void
  /** Значение текущего раздела — подсвечивается брендовым цветом. */
  activeLink?: string
  /**
   * Показывать ли звёзды.
   *
   * Выключается там, где закреплять некуда: меню без верхней панели.
   */
  showFavourites?: boolean
  className?: string
}

/** Порог из дизайн-чека 08.09 №3: с него и выше — четыре колонки. */
const WIDE_MENU_QUERY = "(min-width: 1536px)"

/** Пролёт одной колонки меню в 12-колоночной сетке продукта. */
const COLUMN_SPAN: Record<2 | 3 | 4, number> = { 2: 6, 3: 4, 4: 3 }

function EmployeeMenu({
  groups = [],
  columns: columnsProp,
  favourites = [],
  onFavouriteToggle,
  activeLink,
  showFavourites = true,
  className,
}: EmployeeMenuProps) {
  const wide = useMediaQuery(WIDE_MENU_QUERY)
  const columns = columnsProp ?? (wide ? 4 : 3)

  // Балансировка — общая с раскрытым меню клиента: карточка каждый раз
  // падает в самую короткую колонку, порядок групп при этом сохраняется.
  // Стартовых смещений нет: баннера, который занимает верх последней
  // колонки у клиента, в меню сотрудника не бывает.
  const buckets = distributeMenuGroups(
    groups,
    columns,
    Array.from({ length: columns }, () => 0)
  )

  return (
    <GridRow data-slot="employee-menu" className={className}>
      {buckets.map((bucket, index) => (
        <GridCol
          key={index}
          data-slot="employee-menu-column"
          span={COLUMN_SPAN[columns]}
          className="flex flex-col gap-6 self-start"
        >
          {bucket.map((group) => (
            <EmployeeMenuGroup
              key={group.value}
              group={group}
              favourites={favourites}
              showFavourites={showFavourites}
              activeLink={activeLink}
              onFavouriteToggle={onFavouriteToggle}
            />
          ))}
        </GridCol>
      ))}
    </GridRow>
  )
}

export { EmployeeMenu }
export type { EmployeeMenuProps }
