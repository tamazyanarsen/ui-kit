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
// ⚠️ Блокировка — АТРИБУТ `data-page-scroll-lock` на `<html>` и правило в
// `base.css`, а не `body.style.overflow`. Base UI держит свой замок в
// инлайн-стиле `body` и снимает его отложенно (`setTimeout(0)`), возвращая
// значение, запомненное при установке. Оба замка писали в одно свойство:
// при быстрых `Esc`, `Esc` (модалка над панелью меню) наш замок возвращал
// `""`, а через мгновение Base UI записывал обратно запомненное `hidden` —
// страница оставалась запертой навсегда. Свои пути записи не пересекаются.
//
// ⚠️ Замки СЧИТАЮТСЯ, а не переключаются. Из меню открывается модалка
// «Настройка избранного», у неё замок свой: без счётчика та из них, что
// закроется первой, разблокировала бы страницу под всё ещё открытой второй.

const SCROLL_LOCK_GAP = "--scroll-lock-gap"
const SCROLL_LOCK_ATTR = "data-page-scroll-lock"
// Отдельный признак «полоса была и пропала»: отступ `body` нужен только тогда, иначе собственный
// padding-right страницы затирался бы нулём.
const SCROLL_LOCK_GAP_ATTR = "data-page-scroll-lock-gap"

// ⚠️ Счётчик замков общий для ВСЕХ копий кита на странице. В микрофронтах
// у каждого приложения свой экземпляр пакета, а значит и свой модульный
// счётчик: первый замок одной копии запоминал `overflow: ""`, второй замок
// другой копии — уже `"hidden"`. Снятый первым «чужой» замок возвращал
// прокрутку под всё ещё открытым слоем, а снятый последним — навсегда
// оставлял страницу запертой. Состояние поэтому лежит на `window` под
// общим ключом, а не в переменных модуля.
interface ScrollLockState {
  locks: number
  restore?: () => void
}

const STATE_KEY = Symbol.for("core-ui-kit.page-scroll-lock")

function state(): ScrollLockState {
  const holder = window as unknown as Record<symbol, ScrollLockState | undefined>
  return (holder[STATE_KEY] ??= { locks: 0 })
}

function lock() {
  const shared = state()
  shared.locks += 1
  if (shared.locks > 1) return

  const html = document.documentElement
  const gap = window.innerWidth - html.clientWidth
  // Ширину снятой полосы публикуем до установки атрибута: правило `base.css`
  // берёт из неё отступ `body`, а `fixed`-слои (кнопка «Наверх»), которым
  // отступ `body` не помогает, прибавляют её к `right` (аудит 23).
  if (gap > 0) {
    html.style.setProperty(SCROLL_LOCK_GAP, `${gap}px`)
    html.setAttribute(SCROLL_LOCK_GAP_ATTR, "")
  }
  html.setAttribute(SCROLL_LOCK_ATTR, "")

  shared.restore = () => {
    html.removeAttribute(SCROLL_LOCK_ATTR)
    html.removeAttribute(SCROLL_LOCK_GAP_ATTR)
    html.style.removeProperty(SCROLL_LOCK_GAP)
  }
}

function unlock() {
  const shared = state()
  shared.locks = Math.max(0, shared.locks - 1)
  if (shared.locks > 0) return
  shared.restore?.()
  shared.restore = undefined
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
