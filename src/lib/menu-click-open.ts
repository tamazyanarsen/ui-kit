import type * as React from "react"

/**
 * Пропсы для `Menu.Trigger` Base UI: меню раскрывается по КЛИКУ (после
 * отпускания кнопки мыши), а не на `mousedown`.
 *
 * Правки UI-Kit от 25.10 («Menu раскрывается на нажатии, а не на клике»):
 * Base UI жёстко открывает меню на `mousedown` (`useClick({ event:
 * 'mousedown' })` в `MenuTrigger`, пропа нет) — список выпадал, пока кнопка
 * мыши ещё зажата, а фильтры (Popover) открывались по клику. Нужно одно
 * поведение — по клику.
 *
 * Как устроено: внутренний `useClick` запоминает тип указателя на
 * `pointerdown` и, если он есть, пропускает `click` (считая, что меню уже
 * открыто на `mousedown`). Гасим оба его обработчика —
 * `event.preventBaseUIHandler()` (наши пропсы сливаются правее внутренних и
 * исполняются первыми): `mousedown` больше ничего не открывает, а `click`
 * без запомненного указателя идёт по обычной ветке — открывает, повторный
 * клик закрывает. Клавиатура (Enter/пробел дают `click`) работает как
 * раньше. Другое открытое меню закрывается само: его «нажатие снаружи»
 * слушает документ, а не триггер.
 *
 * Цена: пропадает приём «зажал на триггере, провёл, отпустил на пункте».
 */
type BaseUIEvent<E> = E & { preventBaseUIHandler?: () => void }

function preventBaseUI(event: BaseUIEvent<React.SyntheticEvent>) {
  event.preventBaseUIHandler?.()
}

export const menuClickOpenProps = {
  onPointerDown: preventBaseUI,
  onMouseDown: preventBaseUI,
} as const

/** Склеивает `menuClickOpenProps` с обработчиками потребителя. */
export function withMenuClickOpen<P extends {
  onPointerDown?: React.PointerEventHandler<HTMLElement>
  onMouseDown?: React.MouseEventHandler<HTMLElement>
}>(props: P): P {
  return {
    ...props,
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      props.onPointerDown?.(event)
      preventBaseUI(event)
    },
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
      props.onMouseDown?.(event)
      preventBaseUI(event)
    },
  }
}
