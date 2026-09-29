import type * as React from "react"

import { flattenChildren } from "./flatten-children"

/**
 * Есть ли у детей что рисовать. `{children && …}` пропускал пустой массив
 * (он истинный) и фрагмент из одних `null`/`false` — аккордеон рисовал
 * пустую раскрытую панель с разделителем и отступами (аудит 19, тот же
 * класс, что пустые строки Banner). Пустая строка тоже не содержимое.
 */
function hasContent(children: React.ReactNode): boolean {
  return flattenChildren(children).some((child) => child !== "")
}

export { hasContent }
