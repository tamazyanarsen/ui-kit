import type * as React from "react"

/**
 * Событие в форме React `ChangeEvent` для `onChange`, который зовётся не
 * обработчиком React, а вручную: после микрозадачи (мост Checkbox/Radio) или
 * после очистки маски.
 *
 * Нативное событие к этому моменту уже доставлено, и браузер обнуляет у
 * него `currentTarget`: идиоматичный `e.currentTarget.checked` падал с
 * TypeError, хотя тип `ChangeEventHandler` обещает поле. Здесь и `target`,
 * и `currentTarget` указывают на сам input, а остальные поля повторяют
 * синтетическое событие React.
 */
function createChangeEvent<T extends HTMLInputElement>(
  input: T,
  nativeEvent: Event
): React.ChangeEvent<T> {
  let defaultPrevented = nativeEvent.defaultPrevented
  let propagationStopped = false
  return {
    target: input,
    currentTarget: input,
    nativeEvent,
    type: "change",
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    eventPhase: nativeEvent.eventPhase,
    isTrusted: nativeEvent.isTrusted,
    timeStamp: nativeEvent.timeStamp,
    get defaultPrevented() {
      return defaultPrevented
    },
    preventDefault() {
      defaultPrevented = true
      nativeEvent.preventDefault()
    },
    isDefaultPrevented: () => defaultPrevented,
    stopPropagation() {
      propagationStopped = true
    },
    isPropagationStopped: () => propagationStopped,
    persist() {},
  }
}

export { createChangeEvent }
