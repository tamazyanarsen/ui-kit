import { useMediaQuery } from "@/lib/use-media-query"

// Раскладка колонок «Группы страниц» — общая для раскрытого меню клиента
// (`HeaderMenu`) и меню сотрудника (`EmployeeMenu`). Ревью 10.10, КК-2: порог
// и пролёт колонки были переписаны в обоих компонентах.

/** Порог из дизайн-чека 08.09 №3: с него и выше — четыре колонки, ниже — три. */
const WIDE_MENU_QUERY = "(min-width: 1536px)"

/** Пролёт одной колонки меню в 12-колоночной сетке продукта. */
const MENU_COLUMN_SPAN: Record<2 | 3 | 4, 6 | 4 | 3> = { 2: 6, 3: 4, 4: 3 }

/**
 * Число колонок меню: явное значение или от ширины вьюпорта — четыре с
 * 1536px, три ниже. Один порог на обе раскладки.
 */
function useMenuColumns(columns?: 2 | 3 | 4): 2 | 3 | 4 {
  const wide = useMediaQuery(WIDE_MENU_QUERY)
  return columns ?? (wide ? 4 : 3)
}

export { MENU_COLUMN_SPAN, WIDE_MENU_QUERY, useMenuColumns }
