import * as React from "react"

// Блокировка прокрутки страницы, пока открыт перекрывающий её слой.
//
// Дизайн-чек от 08.09, замечание 1: «Нужно блокировать общий скролл продукта
// при раскрытом меню. Сейчас при дальнейшем скролле можно проскроллить оверлей
// и кнопку настройки избранного, чего быть не должно».
//
// ⚠️ Ширина полосы прокрутки КОМПЕНСИРУЕТСЯ отступом. Без него страница в
// момент блокировки становится на ~15px шире и всё её содержимое —
// закреплённая шапка в первую очередь — дёргается вбок. Тот же приём, что
// делает за нас Base UI в модалке; здесь слой свой, поэтому и компенсация
// своя.
//
// ⚠️ Замки СЧИТАЮТСЯ, а не переключаются. Из меню открывается модалка
// «Настройка избранного», у неё замок свой: без счётчика та из них, что
// закроется первой, разблокировала бы страницу под всё ещё открытой второй.

let locks = 0
let restore: (() => void) | undefined

function lock() {
  locks += 1
  if (locks > 1) return

  const { style } = document.body
  const previousOverflow = style.overflow
  const previousPadding = style.paddingRight
  const gap = window.innerWidth - document.documentElement.clientWidth

  style.overflow = "hidden"
  if (gap > 0) style.paddingRight = `${gap}px`

  restore = () => {
    style.overflow = previousOverflow
    style.paddingRight = previousPadding
  }
}

function unlock() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  restore?.()
  restore = undefined
}

/** Держит прокрутку страницы заблокированной, пока `active`. */
function usePageScrollLock(active: boolean) {
  React.useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}

export { usePageScrollLock }
