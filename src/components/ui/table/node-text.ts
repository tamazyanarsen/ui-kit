import * as React from "react"

/**
 * Текст React-узла — для поиска и `aria-label`. `String(node)` у JSX даёт
 * «[object Object]»: поиск по такому названию столбца его не находил, а
 * скринридер читал «Показывать столбец «[object Object]»».
 */
function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeText(node.props.children)
  }
  return ""
}

export { nodeText }
