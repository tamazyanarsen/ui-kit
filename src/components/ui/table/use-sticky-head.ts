import * as React from "react"

// Липкая строка названий столбцов — дизайн-чек от 08.10, замечания 21 и 35:
// «Во всех таблицах навсегда убрать внутренний скролл… у страницы должен
// быть единый скролл и закрепление строки с названиями колонок в верху
// вьюпорта, за минусом других закреплённых элементов», «закрепляется на
// промежуточном скролле и открепляется по выходу блока из вьюпорта».
//
// ⚠️ Почему не `position: sticky`. Окно таблицы обязано прокручиваться по
// горизонтали (на этом держатся закреплённые столбцы), а `overflow-x: auto`
// по правилу CSS делает его областью прокрутки ПО ОБЕИМ осям — `sticky` у
// шапки считается от окна, а не от вьюпорта, и к верху экрана не липнет
// никогда. Прежнее решение (липнет вся таблица, окно ограничено высотой
// экрана) как раз и давало запрещённый теперь внутренний скролл.
//
// Поэтому шапка СДВИГАЕТСЯ вниз внутри собственной таблицы:
// `translateY(clamp(inset − верх таблицы, 0, высота таблицы − высота шапки))`.
// Сдвиг не выводит её за коробку таблицы, так что окно не получает ни
// вертикального переполнения, ни подрезки, а закреплённые столбцы (`sticky;
// left` у ячеек) работают как прежде.
//
// Сдвиг ведёт браузер, а не скрипт, — анимация по шкале просмотра
// (`view-timeline` на обёртке таблицы, см. styles/table-rules.css): при
// прокрутке на потоке композитора шапка, сдвинутая скриптом на событии
// `scroll`, отставала бы на кадр и «подпрыгивала». Скрипт здесь только
// меряет ход шапки — величину, которая от прокрутки не зависит, — и
// публикует его в `--table-head-travel`.
//
// Где шкал просмотра нет (Firefox на 10.2026), сдвиг ставит скрипт на
// прокрутке: с отставанием на кадр, но с тем же правилом.

const TRAVEL = "--table-head-travel"

function supportsViewTimeline() {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline: view()")
  )
}

function readInsetTop(element: HTMLElement) {
  const value = getComputedStyle(element).getPropertyValue("--viewport-inset-top")
  return Number.parseFloat(value) || 0
}

/**
 * Держит строку названий столбцов у верха вьюпорта, пока таблица проходит
 * под ним. `rootRef` — обёртка `table-root` (субъект шкалы просмотра),
 * `tableRef` — сам `<table>`.
 */
function useStickyHead(
  rootRef: React.RefObject<HTMLElement | null>,
  tableRef: React.RefObject<HTMLTableElement | null>,
  enabled: boolean
) {
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const table = tableRef.current
    if (!enabled || !root || !table) return

    const native = supportsViewTimeline()
    let travel = 0

    const place = () => {
      const head = table.tHead
      if (!head) return
      const inset = readInsetTop(root)
      const top = table.getBoundingClientRect().top
      const shift = Math.min(travel, Math.max(0, inset - top))
      head.style.transform = shift > 0 ? `translateY(${shift}px)` : ""
    }

    const measure = () => {
      const head = table.tHead
      // offsetHeight, а не getBoundingClientRect: сдвинутая шапка врёт
      // прямоугольником ровно на величину сдвига.
      const next = head ? Math.max(0, table.offsetHeight - head.offsetHeight) : 0
      if (next !== travel) {
        travel = next
        root.style.setProperty(TRAVEL, `${travel}px`)
      }
      if (!native) place()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(table)
    if (table.tHead) observer.observe(table.tHead)
    window.addEventListener("resize", measure)
    if (!native) {
      window.addEventListener("scroll", place, { passive: true, capture: true })
    }

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", place, { capture: true })
      root.style.removeProperty(TRAVEL)
      if (table.tHead) table.tHead.style.transform = ""
    }
  }, [rootRef, tableRef, enabled])
}

export { useStickyHead }
