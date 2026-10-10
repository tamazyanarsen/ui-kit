import * as React from "react"

/**
 * Регистрация заголовка шапки в кликабельном BlockWidget: по нему блок
 * называет свою кнопку-подложку (`PressTarget`, ревью 10.10, п. 25).
 *
 * Шапок в блоке бывает несколько (тип `Double`) — имя даёт первая
 * зарегистрированная. Вне BlockWidget контекста нет, и шапка ничего не
 * регистрирует.
 */
type TitleRegistrar = (id: string) => () => void

const BlockWidgetTitleContext = React.createContext<TitleRegistrar | null>(null)

/** Шапка регистрирует `id` своего заголовка на время жизни. */
function useRegisterBlockWidgetTitle(id: string) {
  const register = React.useContext(BlockWidgetTitleContext)
  React.useLayoutEffect(() => register?.(id), [register, id])
}

/** Блок собирает зарегистрированные заголовки; отдаёт `id` первого. */
function useBlockWidgetTitles(): [string | undefined, TitleRegistrar] {
  const [ids, setIds] = React.useState<string[]>([])
  const register = React.useCallback<TitleRegistrar>((id) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    return () => setIds((prev) => prev.filter((entry) => entry !== id))
  }, [])
  return [ids[0], register]
}

export { BlockWidgetTitleContext, useBlockWidgetTitles, useRegisterBlockWidgetTitle }
