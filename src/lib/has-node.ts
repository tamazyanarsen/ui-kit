import type * as React from "react"

/**
 * Есть ли что рисовать в ОДНОМ узле-значении (`description`, `tag`, `title`).
 *
 * `{node && <span>{node}</span>}` с числом 0 выводил бы «0» голым текстом
 * мимо обёртки, а `Boolean(node)` прятал бы настоящий ноль — счётчик «0».
 * Пусто только то, что React не рисует (`null`, `undefined`, `true`,
 * `false`) и пустая строка; число, включая 0, — содержимое.
 */
function hasNode(node: React.ReactNode): boolean {
  return node !== null && node !== undefined && typeof node !== "boolean" && node !== ""
}

export { hasNode }
