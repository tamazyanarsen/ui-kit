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
 * Клик завершил выделение текста внутри блока: пользователь протянул мышью
 * по номеру счёта, чтобы скопировать его, — это не нажатие на блок.
 *
 * Браузер шлёт `click` и после протяжки, если нажатие и отпускание пришлись
 * на один элемент. Обычный щелчок выделение сворачивает ещё на `mousedown`,
 * поэтому к `click` оно пустое. Двойной щелчок по слову даёт один `onPress`
 * (от первого щелчка): ко второму слово уже выделено.
 */
function endsTextSelection(event: PressEvent): boolean {
  const root = event.currentTarget as Node
  if (selectsInField(root)) return true
  const selection =
    typeof window !== "undefined" && typeof window.getSelection === "function"
      ? window.getSelection()
      : null
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false
  for (let index = 0; index < selection.rangeCount; index++) {
    if (selection.getRangeAt(index).intersectsNode(root)) return true
  }
  return false
}

/**
 * Выделение внутри поля ввода блока. Chrome показывает выделение в
 * `<input>`/`<textarea>` свёрнутым для документа, поэтому протяжка по тексту
 * поля, отпущенная уже на самом блоке, считалась нажатием (аудит 17).
 * Смотрим на само поле в фокусе: `selectionStart !== selectionEnd`.
 */
function selectsInField(root: Node): boolean {
  if (typeof document === "undefined") return false
  const field = document.activeElement
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return false
  if (!root.contains(field)) return false
  try {
    // У части типов (`number`, `checkbox`…) чтение выделения бросает или
    // даёт `null` — такое поле текст не выделяет.
    const { selectionStart, selectionEnd } = field
    return selectionStart != null && selectionEnd != null && selectionStart !== selectionEnd
  } catch {
    return false
  }
}

/**
 * Обработчики «весь блок — кнопка»: клик мимо вложенного управления и
 * Enter/Space на самом блоке вызывают `onPress`. Клик, которым закончилось
 * выделение текста в блоке, нажатием не считается.
 */
function pressHandlers<T extends Element>(onPress: (() => void) | undefined) {
  if (!onPress) return {}
  return {
    onClick(event: React.MouseEvent<T>) {
      if (fromNestedControl(event)) return
      if (endsTextSelection(event)) return
      onPress()
    },
    onKeyDown(event: React.KeyboardEvent<T>) {
      if (!isOwnActivationKey(event)) return
      event.preventDefault()
      // Удержание пробела: нативная кнопка срабатывает на него один раз, а
      // автоповтор keydown звал `onPress` на каждом шаге — BankCard
      // переворачивалась туда-обратно, переход по карточке вызывался пачкой.
      // `preventDefault` выше остаётся и на повторе, иначе удержание
      // прокручивало бы страницу. Enter у нативной кнопки при удержании
      // повторяется, поэтому отсекается только пробел.
      if (event.key === " " && event.repeat) return
      onPress()
    },
  }
}

export { NESTED_CONTROL_SELECTOR, fromNestedControl, isOwnActivationKey, pressHandlers }
