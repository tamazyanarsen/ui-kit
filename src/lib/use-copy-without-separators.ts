import * as React from "react"

import { stripGroupSeparators } from "./number-format"

// Разрядный пробел не должен попадать в буфер обмена.
//
// Правило дизайнера: «когда копирую сумму — пробелы мне там не нужны; это
// отбивка по 3 разряда, а не символ значения». Та же жалоба приходила трижды
// — на ячейку таблицы, на поле ввода и на ползунок, — и это признак того, что
// слой был выбран неверно.
//
// Разложено так: ЧТО считается разделителем — `number-format.ts`; КАК его
// снимать в поле — здесь; ячейка таблицы прячет разделитель РАЗМЕТКОЙ
// (`user-select: none` на самом пробеле), а поля снимают его на самом
// копировании: внутри поля разметки нет, значение и есть строка.
//
// Три дефекта первой сборки, все про ГРАНИЦЫ — они и объясняют форму этого
// модуля:
//
//  1. Умолчание «снимать» превращало свободное поле в «Дом 12345 корп 2».
//     Поэтому разделители ОБЪЯВЛЯЕТ вызывающая сторона (маска), а не хук:
//     без списка обработчики не ставятся вовсе.
//  2. Решение «трогать или нет» дублировалось, и копирование отдавало одно,
//     а вырезание другое. Поэтому обработчик ОДИН на оба события.
//  3. Разбор шёл по срезу выделения, а не по строке, и выделение С КРАЯ
//     давало мусор: у пробела на кромке среза сосед-цифра виден только с
//     одной стороны. Поэтому разделители ищутся в ПОЛНОМ значении поля, и
//     только потом из него берётся выделенный кусок.

/** Одна пара обработчиков — на копирование и на вырезание. */
interface CopyHandlers {
  onCopy: React.ClipboardEventHandler<HTMLElement>
  onCut: React.ClipboardEventHandler<HTMLElement>
}

function cleanSelection(
  target: EventTarget | null,
  separators: readonly string[]
): string | null {
  // Поле ввода: выделение живёт не в DOM, а в самом элементе, и полная
  // строка у нас на руках — разбираем её целиком, срез берём после.
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    const start = target.selectionStart
    const end = target.selectionEnd
    if (start === null || end === null || start === end) return null
    const chars = Array.from(target.value)
    const kept = Array.from(stripGroupSeparators(target.value, separators))
    // Пересобираем срез по ПОЛНОЙ строке: помечаем, какие позиции выпали, и
    // выкидываем ровно их — иначе пробел на кромке выделения не с чем
    // сравнить.
    let keptIndex = 0
    const slice: string[] = []
    for (let index = 0; index < chars.length; index += 1) {
      const survives = kept[keptIndex] === chars[index]
      if (survives) keptIndex += 1
      if (index >= start && index < end && survives) slice.push(chars[index])
    }
    const text = slice.join("")
    return text === target.value.slice(start, end) ? null : text
  }

  // Обычный узел (значение ползунка): выделение читается из документа, и
  // строка в нём и есть полное значение.
  const selected = window.getSelection()?.toString()
  if (!selected) return null
  const text = stripGroupSeparators(selected, separators)
  return text === selected ? null : text
}

/**
 * Обработчики копирования и вырезания, снимающие разрядные разделители.
 *
 * @param separators символы, которые маска объявила разделителями. Пустой
 *   список или `undefined` — обработчики ничего не делают: свободный текст
 *   трогать нельзя.
 *
 * ⚠️ Аргумент ОБЯЗАТЕЛЬНЫЙ, и значения по умолчанию у него нет намеренно.
 * Со значением по умолчанию `undefined` от маски без объявленных
 * разделителей молча превращался в «снимать всё», и паспорт `4510 123456`
 * копировался как `4510123456` — а он должен уходить как есть. Кому нужен
 * общий набор пробелов, передаёт `GROUP_SPACES` из `number-format` явно.
 */
export function useCopyWithoutSeparators(
  separators: readonly string[] | undefined
): CopyHandlers {
  const handle = React.useCallback(
    (event: React.ClipboardEvent<HTMLElement>, cut: boolean) => {
      if (!separators || separators.length === 0) return
      const text = cleanSelection(event.target, separators)
      if (text === null) return
      event.clipboardData.setData("text/plain", text)
      // `setData` действует только вместе с отменой действия по умолчанию —
      // а у вырезания по умолчанию не только запись в буфер, но и удаление
      // выделенного. Значит, удалять надо самим, иначе «вырезать» превратится
      // в «скопировать».
      event.preventDefault()
      const target = event.target
      if (
        cut &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement)
      ) {
        const start = target.selectionStart
        const end = target.selectionEnd
        if (start !== null && end !== null && start !== end) {
          target.setRangeText("", start, end, "end")
          // React слушает `input`, а `setRangeText` его не шлёт: без этого
          // управляемое поле откатилось бы к прежнему значению.
          target.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }
    },
    [separators]
  )

  return {
    onCopy: (event) => handle(event, false),
    onCut: (event) => handle(event, true),
  }
}
