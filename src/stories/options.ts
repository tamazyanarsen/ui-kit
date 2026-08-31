/* Порядок опций в контролах Storybook.
 *
 * `normalizeOptions` (@storybook/addon-docs) сворачивает массив `options` в
 * объект `{ [label]: value }`, а JS в объекте всегда поднимает наверх ключи,
 * похожие на целые числа. Из-за этого набор `["None", 1, 2, 3, 4, 5]`
 * показывался в панели как «1 … 5, None», а `["100 (Without 75)", "100"]` —
 * как «100, 100 (Without 75)», то есть не в том порядке, что в таблице
 * «Свойства компонента» в Figma.
 *
 * Лечится на уровне лейблов: если к числовому лейблу приклеить невидимый
 * word joiner (U+2060), ключ перестаёт быть целочисленным и объект
 * сохраняет порядок массива. На вид лейбл не меняется, значение аргумента —
 * тоже (в args и в URL уезжает `value`, а не лейбл).
 */
const WORD_JOINER = "⁠"

const isIntegerLike = (label: string) => String(Number.parseInt(label, 10)) === label

/**
 * Лейблы для `control: { type: "select" | "radio", labels }`, сохраняющие
 * порядок `options`. `overrides` задаёт свой текст отдельным значениям
 * (например `none` → `None`, как в макете).
 */
function orderedOptionLabels<T extends string | number>(
  options: readonly T[],
  overrides: Partial<Record<string, string>> = {}
): Record<string, string> {
  return Object.fromEntries(
    options.map((option) => {
      const label = overrides[String(option)] ?? String(option)
      return [String(option), isIntegerLike(label) ? `${label}${WORD_JOINER}` : label]
    })
  )
}

export { orderedOptionLabels }
