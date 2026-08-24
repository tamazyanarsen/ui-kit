import * as React from "react"

/**
 * ViewportScope — принудительная десктопная/мобильная форма для поддерева.
 *
 * Дизайн-чек №3 (замечания 8, 18, 19): «Нужно выводить в матрице рядом
 * десктоп и мобайл» и «пропс на мобайл должен быть в панели стори, не по
 * изменению размера вьюпорта». Медиазапрос по ширине окна ни того, ни
 * другого не позволяет: он один на всю страницу.
 *
 * Механизм — два согласованных канала:
 *   • CSS: атрибут `data-viewport` на элементе-обёртке. Вариант `desktop:`
 *     (см. src/styles/variants.css) читает его у любого предка и перекрывает им
 *     медиазапрос.
 *   • JS: контекст для мест, где от ширины зависит не оформление, а сам
 *     рендер (Hint разворачивается в Modal, Input показывает Tooltip) —
 *     такие ветки идут через `useIsDesktop()`.
 *
 * Обёртка — `display: contents`, поэтому в раскладке она не участвует и
 * ничего не ломает там, где важен родитель (flex/grid-контейнеры).
 */

export type Viewport = "auto" | "desktop" | "mobile"

const ViewportContext = React.createContext<Viewport>("auto")

interface ViewportScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  viewport?: Viewport
  children: React.ReactNode
}

function ViewportScope({ viewport = "auto", children, style, ...props }: ViewportScopeProps) {
  if (viewport === "auto") {
    // «auto» ничего не форсирует — не плодим лишний узел и не перекрываем
    // родительский скоуп, если он есть.
    return <>{children}</>
  }

  return (
    <ViewportContext.Provider value={viewport}>
      <div data-viewport={viewport} style={{ display: "contents", ...style }} {...props}>
        {children}
      </div>
    </ViewportContext.Provider>
  )
}

/** Текущий форсированный режим или `"auto"`, если его не задавали. */
function useViewport(): Viewport {
  return React.useContext(ViewportContext)
}

/**
 * Значение для `data-viewport` на портальном поддереве.
 *
 * Base UI выносит поповеры, дропдауны и модалки в конец `<body>`, то есть за
 * пределы обёртки `ViewportScope`. React-контекст сквозь портал проходит, а
 * CSS-селектор по предку — нет, поэтому корню всплывающего слоя атрибут надо
 * проставить вручную: `<Popup data-viewport={useViewportAttr()}>`.
 */
function useViewportAttr(): "desktop" | "mobile" | undefined {
  const viewport = React.useContext(ViewportContext)
  return viewport === "auto" ? undefined : viewport
}

export { ViewportScope, ViewportContext, useViewport, useViewportAttr }
