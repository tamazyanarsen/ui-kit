import type * as React from "react"

/**
 * Узлы, нажатие по которым НЕ считается нажатием на кликабельный блок
 * (строку, карточку), внутри которого они лежат.
 */
const NESTED_CONTROL_SELECTOR = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "label",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='button']",
  "[role='menuitem']",
  "[role='option']",
].join(", ")

type PressEvent = { target: EventTarget | null; currentTarget: EventTarget }

/**
 * Событие пришло не от самого блока, а от вложенного управления — или вовсе
 * из портала.
 *
 * ⚠️ Синтетические события React всплывают по дереву КОМПОНЕНТОВ, а не по
 * DOM: клик по пункту меню, отрисованному в портале, доходит до `onClick`
 * карточки, хотя в DOM меню лежит в `body`. Поэтому сначала проверяется,
 * что цель вообще внутри блока.
 *
 * Найденный `closest` сверяется с самим блоком: кликабельный блок и сам
 * получает `role="button"`, и без этой проверки он не срабатывал бы никогда.
 */
function fromNestedControl(event: PressEvent): boolean {
  const target = event.target
  const root = event.currentTarget as Node
  if (!(target instanceof Node) || !root.contains(target)) return true
  const element = target instanceof Element ? target : target.parentElement
  const hit = element?.closest(NESTED_CONTROL_SELECTOR)
  // `closest` не останавливается на границе блока: у строки таблицы (`tr`)
  // селектор не срабатывает на ней самой и уходит к предкам — кликабельному
  // BlockWidget, `label`, `[role=option]` снаружи. Такой предок — не
  // вложенное управление, иначе строка внутри него не нажималась бы никогда.
  if (!hit || hit === root) return false
  return root.contains(hit)
}

/**
 * Enter/Space нажаты на САМОМ блоке, а не всплыли от вложенной кнопки.
 *
 * Без этой проверки Enter на вложенной кнопке доходил до блока, тот делал
 * `preventDefault()` — и нативный клик кнопки не случался вовсе, вместо
 * него срабатывал `onClick` блока.
 */
function isOwnActivationKey(event: React.KeyboardEvent): boolean {
  if (event.key !== "Enter" && event.key !== " ") return false
  return event.target === event.currentTarget
}

/**
 * Обработчики «весь блок — кнопка»: клик мимо вложенного управления и
 * Enter/Space на самом блоке вызывают `onPress`.
 */
function pressHandlers<T extends Element>(onPress: (() => void) | undefined) {
  if (!onPress) return {}
  return {
    onClick(event: React.MouseEvent<T>) {
      if (fromNestedControl(event)) return
      onPress()
    },
    onKeyDown(event: React.KeyboardEvent<T>) {
      if (!isOwnActivationKey(event)) return
      event.preventDefault()
      onPress()
    },
  }
}

export { NESTED_CONTROL_SELECTOR, fromNestedControl, isOwnActivationKey, pressHandlers }
