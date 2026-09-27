import * as React from "react"

// Подсветка совпадений в результатах Autocomplete.
//
// О ЦВЕТЕ: на канвасе этого компонента в макете нет описания подсветки
// найденной подстроки — искали по всей дизайн-системе и проверяли узел
// строки результата, по которому собран остальной компонент: ни там, ни
// там оформления «совпадение» не задано. Поэтому, вместо того чтобы
// выдумывать цвет, разметка переиспользует существующий основной акцент
// кита (`--btn-primary-bg`, #80E3FF) под стандартным тёмным текстом и
// выведена отдельным токеном, чтобы дизайнер мог перенастроить её в одном
// месте, когда описание появится.
//
// Поиск нечувствителен к регистру и отмечает все вхождения, а запрос
// экранируется до того, как попадёт в регулярное выражение: пользователь,
// набравший «(» в поле, не должен получить исключение.

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Разбивает `text` по каждому вхождению `query` без учёта регистра и
 * оборачивает совпадения в `<mark>`. Если подсвечивать нечего, возвращает
 * текст без изменений, поэтому вызывающий код может пропускать его через
 * эту функцию безусловно.
 */
function highlightMatch(
  text: React.ReactNode,
  query: string | undefined
): React.ReactNode {
  if (typeof text !== "string" || !query) return text
  const trimmed = query.trim()
  if (!trimmed) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"))
  if (parts.length === 1) return text

  return parts.map((part, index) =>
    // Нечётные индексы — это группы захвата, то есть сами совпадения.
    index % 2 === 1 ? (
      <mark
        key={index}
        data-slot="autocomplete-match"
        className="rounded-[2px] bg-[var(--autocomplete-match-bg)] text-[color:inherit]"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  )
}

export { highlightMatch }
