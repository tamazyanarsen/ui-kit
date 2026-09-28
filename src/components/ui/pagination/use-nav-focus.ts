import * as React from "react"

/**
 * Фокус со стрелки «Предыдущая/Следующая» не должен падать на `<body>`.
 *
 * Листая с клавиатуры Enter на «Следующей», пользователь доходит до последней
 * страницы — стрелка получает `disabled`, и браузер снимает с неё фокус в
 * никуда. То же с «Предыдущей» на первой странице и при `totalPages → 1`,
 * когда стрелки размонтируются вовсе. Тот же дефект у ленты сводки закрыт
 * `useArrowFocusHandoff` в table-top.
 *
 * Метка «последний фокус был на стрелке» ставится при фокусе и снимается
 * при любом уходе фокуса с живой, включённой кнопки — в том числе в пустоту
 * (клик по пустому месту, переключение окна). Остаётся она, только когда
 * кнопку выключили или сняли — то есть когда фокус действительно потерян.
 * После смены страницы такой фокус переходит на кнопку текущей страницы, а
 * если её нет — на доступную стрелку.
 *
 * ⚠️ Фокус, ушедший ВНЕ пагинации (поле поиска), не трогается: иначе смена
 * страницы, вызванная вводом в поиск, выдёргивала бы пользователя из поля.
 */
function useNavFocusHandoff(page: number, totalPages: number) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const navFocused = React.useRef(false)

  const navFocusProps = {
    onFocus: () => {
      navFocused.current = true
    },
    onBlur: (event: React.FocusEvent) => {
      const button = event.currentTarget as HTMLButtonElement
      if (event.relatedTarget || (button.isConnected && !button.disabled)) {
        navFocused.current = false
      }
    },
  }

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!navFocused.current || !list) return
    const active = document.activeElement
    const stranded =
      !active ||
      active === document.body ||
      (list.contains(active) && active instanceof HTMLButtonElement && active.disabled)
    if (!stranded) return
    navFocused.current = false
    const target =
      list.querySelector<HTMLElement>('[data-slot="pagination-page"][data-active]') ??
      list.querySelector<HTMLElement>('[data-slot="pagination-nav"]:not(:disabled)')
    target?.focus()
  }, [page, totalPages])

  return { listRef, navFocusProps }
}

export { useNavFocusHandoff }
