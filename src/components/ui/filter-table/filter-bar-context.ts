import * as React from "react"

import { useStableId } from "@/lib/use-stable-id"

/**
 * Как фильтр ряда отдаёт `FilterBar` свою мобильную форму.
 *
 * Правки UI-Kit от 25.10, «Ряд фильтров — нет мобильного режима „кнопка
 * Фильтры + штора“»: в мобильном виде ряд сворачивается в одну кнопку, а
 * каждый фильтр разворачивается полем в общей шторе. Фильтр при этом остаётся
 * ребёнком ряда — смонтированным, со своим состоянием и пропами, — но вместо
 * чипа ничего не рисует, а регистрирует в ряду описание поля: как его
 * нарисовать по черновику, что сейчас применено и как применить новое.
 *
 * Черновики всех полей держит ряд: выбор в шторе ничего не меняет до
 * «Применить» (правило каркаса «Фильтры над списком в мобильном виде»).
 *
 * Вне `FilterBar` (или в десктопном виде) контекста нет, и фильтр работает
 * сам по себе — автономное использование не меняется.
 */
interface FilterBarFieldRenderArgs<T> {
  draft: T
  setDraft: (next: T) => void
  /** Была попытка «Применить» с ошибкой — пора показывать ошибки полей. */
  showErrors: boolean
}

interface FilterBarField<T = unknown> {
  label: React.ReactNode
  /** Фильтр применён — засчитывается в счётчик на кнопке «Фильтры». */
  active: boolean
  /** Применённое значение — с него начинается черновик при открытии шторы. */
  value: T
  /** Пустое значение — его применяет «Сбросить». */
  empty: () => T
  commit: (next: T) => void
  /** Совпадает ли черновик с применённым (тогда `commit` не зовётся). */
  equals?: (a: T, b: T) => boolean
  /** `false` — черновик с ошибкой: «Применить» не применяет ни одного поля. */
  validate?: (draft: T) => boolean
  render: (args: FilterBarFieldRenderArgs<T>) => React.ReactNode
}

interface FilterBarContextValue {
  register: (id: string, field: FilterBarField<never>) => void
  unregister: (id: string) => void
}

const FilterBarContext = React.createContext<FilterBarContextValue | null>(
  null
)

/**
 * Регистрирует мобильную форму фильтра в ряду. Возвращает `true`, если
 * фильтр стоит в свёрнутом ряду и сам рисовать ничего не должен.
 *
 * Описание обновляется на каждой отрисовке фильтра (свежие замыкания
 * `commit`/`render`); ряд перерисовывается только тогда, когда меняется
 * что-то видимое снаружи шторы — состав полей или их активность.
 */
function useFilterBarField<T>(field: FilterBarField<T>): boolean {
  const bar = React.useContext(FilterBarContext)
  const id = useStableId()

  React.useLayoutEffect(() => {
    bar?.register(id, field as unknown as FilterBarField<never>)
  })

  React.useLayoutEffect(() => {
    if (!bar) return
    return () => bar.unregister(id)
  }, [bar, id])

  return bar !== null
}

export { FilterBarContext, useFilterBarField }
export type { FilterBarContextValue, FilterBarField, FilterBarFieldRenderArgs }
