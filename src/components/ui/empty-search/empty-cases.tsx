import { ClearFilter, Search } from "@/icons"

import type { EmptySearchResultsProps } from "./empty-search"

/**
 * **Нулевой результат фильтрации** — единственный кейс пустого состояния,
 * который кит задаёт целиком: и тексты, и значок, и кнопку. Поэтому он живёт
 * здесь готовым набором пропов, а не переписывается в каждом месте
 * применения.
 *
 * Дизайн-чек 3/3 №27: «Table: неверное отображение пустого состояния».
 * Разбор по пакету дизайнера (`design_check/elk-tables-handoff-2026-08-16`,
 * EmptySearchResults/empty-cases.tsx — по правилу проекта он важнее самих
 * макетов): у этого кейса кнопка «Сбросить фильтры» **вторичная и со
 * значком** `icon / clear filter`, тем же, что у одноимённой кнопки в шапке
 * таблицы, — «чтобы два способа сбросить фильтры читались как одно
 * действие». В историях таблицы кнопка рисовалась без значка, и набор
 * пропов дублировался в трёх файлах, расходясь между собой.
 *
 * Остальные кейсы — это просто тексты: пропа «кейс» у компонента нет.
 *
 * ```tsx
 * <EmptySearchResults {...EMPTY_FILTERED} onButtonClick={resetFilters} />
 * ```
 */
export const EMPTY_FILTERED = {
  icon: <Search aria-hidden="true" />,
  title: "По вашему запросу ничего не найдено",
  description: "Попробуйте изменить критерии поиска",
  buttonLabel: "Сбросить фильтры",
  buttonVariant: "secondary-grey",
  buttonIcon: ClearFilter,
} satisfies EmptySearchResultsProps
