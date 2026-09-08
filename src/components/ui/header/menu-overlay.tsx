import * as React from "react"

import { usePageScrollLock } from "@/lib/use-page-scroll-lock"

/**
 * Раскрытая панель под шапкой: затемнение на всю оставшуюся высоту экрана
 * плюс сама панель. В макете (Menu Overlay, нода 70303:58313) затемнение
 * лежит под панелью и по нему же кликом меню закрывается, а кнопка
 * «Настроить избранное» стоит по центру на 32px ниже панели.
 *
 * ⚠️ Пока меню раскрыто, страница НЕ ПРОКРУЧИВАЕТСЯ. Дизайн-чек от 08.09,
 * замечание 1: «Сейчас при дальнейшем скролле можно проскроллить оверлей и
 * кнопку настройки избранного, чего быть не должно». Затемнение занимает
 * ровно оставшуюся высоту экрана, поэтому продолжающая ехать страница
 * выкатывала из-под него и панель, и кнопку.
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
  const footerRef = React.useRef<HTMLDivElement>(null)

  usePageScrollLock(true)

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
  //
  // Здесь же считается и предел высоты самих разделов: «оверлей занимает всё
  // доступное место по высоте, КРОМЕ кнопки настройки избранного и её
  // марджинов» (замечание 1). Кнопка меряется, а не берётся константой, —
  // ровно по той же причине, по которой не берётся константой высота шапки.
  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const { top } = element.getBoundingClientRect()
      const available = Math.max(0, window.innerHeight - top)
      element.style.height = `${available}px`

      const footerBox = footerRef.current
      // Марджины кнопки — 32 сверху (`pt-8`) и столько же снизу, чтобы она
      // не липла к нижней кромке экрана.
      const reserved = footerBox
        ? footerBox.getBoundingClientRect().height + 64
        : 0
      element.style.setProperty(
        "--menu-overlay-panel",
        `${Math.max(0, available - reserved)}px`
      )
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", measure, { capture: true })
      window.removeEventListener("resize", measure)
    }
  }, [footer])

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
        {footer && (
          <div ref={footerRef} className="flex justify-center pt-8">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export { MenuOverlay }
