import * as React from "react"

/**
 * Дети списком, с раскрытием фрагментов.
 *
 * ⚠️ `React.Children.toArray` фрагмент НЕ раскрывает — он считает его одним
 * ребёнком. А `<>…</>` вокруг детей вызывающий код пишет естественно (без
 * него не собрать условную разметку): BlockWidget тогда молча рисовался в
 * один столбец, ListOfErrors клал две ошибки в одну строку.
 *
 * ⚠️ Ключ раскрытого ребёнка — ключ фрагмента + его собственный. Повторный
 * `toArray` внутри фрагмента выдаёт ключи заново, с нуля: `[<><b/><i/></>,
 * <u/>]` давал `.0, .1, .1`, и React путал строки — после того как фрагмент
 * исчезал, на месте оставался устаревший элемент. С префиксом ключи
 * уникальны и стабильны: `.0/.0, .0/.1, .1`.
 */
function flattenChildren(children: React.ReactNode, prefix = ""): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return [child]
    if (child.type === React.Fragment) {
      return flattenChildren(child.props.children, `${prefix}${child.key ?? ""}/`)
    }
    return prefix ? [React.cloneElement(child, { key: `${prefix}${child.key ?? ""}` })] : [child]
  })
}

export { flattenChildren }
