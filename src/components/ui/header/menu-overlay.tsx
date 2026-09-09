import * as React from "react"

import { usePageScrollLock } from "@/lib/use-page-scroll-lock"

/**
 * Минимум между кнопкой «Настроить избранное» и нижней кромкой экрана. При
 * достижении этого расстояния панель разделов перестаёт расти и включает
 * собственную прокрутку (нода 70303:61266).
 */
const FOOTER_BOTTOM_INSET = 40

/**
 * Раскрытая панель под шапкой: затемнение на всю оставшуюся высоту экрана
 * плюс сама панель. В макете (Menu Overlay, нода 70303:58313) затемнение
 * лежит под панелью и по нему же кликом меню закрывается, а кнопка
 * «Настроить избранное» стоит по центру на 32px ниже панели, а до нижней
 * кромки экрана ей оставляют не меньше 40px.
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
      // Предел высоты панели. Правило — из аннотации раздела «Адаптация»
      // (нода 70303:61266): «Когда расстояние от нижнего края экрана до
      // кнопки достигает 40 px — появляется скролл внутри контентного
      // блока».
      //
      // То есть 40 — это НЕ отступ под кнопкой, а ПОРОГ: пока разделы
      // помещаются, панель короче предела и под кнопкой остаётся сколько
      // осталось (в кадре 1920×1080 — 32); как только упёрлись, панель
      // перестаёт расти, включает свою прокрутку, и снизу остаётся ровно 40.
      // Проверено по трём кадрам адаптации, где панель как раз упирается:
      //
      //   1280×1304  панель 1072, кнопка 1104…1136, оверлей 1176 → снизу 40
      //   1280× 874  панель  642, кнопка  674… 706, оверлей  746 → снизу 40
      //   1536×1088  панель  856, кнопка  888… 920, оверлей  960 → снизу 40
      //
      // ⚠️ Прибавляется ТОЛЬКО нижний порог. Верхние 32 уже входят в
      // измеренную высоту: у коробки кнопки стоит `pt-8`, и
      // `getBoundingClientRect()` возвращает 64 при кнопке в 32. Дизайн-чек
      // от 08.09, замечание 6 («Некорректный нижний паддинг после кнопки
      // настройки избранного»): сначала здесь прибавлялись оба поля и снизу
      // оставалось 64, потом я поставил 32 по симметрии — и то, и другое
      // мимо.
      const reserved = footerBox
        ? footerBox.getBoundingClientRect().height + FOOTER_BOTTOM_INSET
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
