import * as React from "react"

/**
 * Раскрытая панель под шапкой: затемнение на всю оставшуюся высоту экрана
 * плюс сама панель. В макете (Menu Overlay, нода 70303:58313) затемнение
 * лежит под панелью и по нему же кликом меню закрывается, а кнопка
 * «Настроить избранное» стоит по центру на 32px ниже панели.
 */
function MenuOverlay({
  children,
  footer,
  onClose,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  onClose: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  // Высота — «до низа экрана», и посчитать её в CSS нечем.
  //
  // Раньше здесь стояло `h-[calc(100vh-8rem)]` — «экран минус шапка 128».
  // Но с тех пор как закрепляется только НИЖНИЙ ряд шапки (дизайн-чек от
  // 07.09, замечание 29), расстояние от верха экрана до низа этого ряда
  // ходит между 128 (страница в самом верху) и 64 (верхний ряд уехал), и
  // константа стала врать ровно на эту разницу: панель либо не доставала до
  // низа экрана, либо вылезала за него и добавляла странице прокрутки.
  //
  // Поэтому величина МЕРЯЕТСЯ у самой панели — как и занятый верх вьюпорта
  // в use-viewport-inset-top.
  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const { top } = element.getBoundingClientRect()
      element.style.height = `${Math.max(0, window.innerHeight - top)}px`
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", measure, { capture: true })
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-slot="header-menu-overlay"
      className="absolute inset-x-0 top-full z-40"
    >
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        // Тот же `--modal-backdrop`/70, что и у модалки: пиксельная проба
        // макета даёт ровно это значение (см. комментарий в styles/tokens-forms.css).
        className="absolute inset-0 cursor-default bg-[var(--modal-backdrop)]/70"
      />
      <div className="relative">
        {children}
        {footer && <div className="flex justify-center pt-8">{footer}</div>}
      </div>
    </div>
  )
}

export { MenuOverlay }
