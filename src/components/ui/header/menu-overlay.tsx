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
  return (
    <div
      data-slot="header-menu-overlay"
      // Высота — «экран минус шапка»: в макете Menu Overlay ровно 952 при
      // экране 1080 и шапке 128 (64 + 64). Просто `h-screen` дал бы лишние
      // 128px прокрутки документа.
      className="absolute inset-x-0 top-full z-40 h-[calc(100vh-8rem)]"
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
