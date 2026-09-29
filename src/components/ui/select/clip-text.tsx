import * as React from "react"

import { flattenChildren } from "@/lib/flatten-children"

/**
 * Подряд идущие строки и числа склеиваются в ОДИН узел с многоточием:
 * `Счёт {n}` в JSX — это два ребёнка, и по отдельному узлу на каждого
 * давали зазор `gap-*` вместо пробела и два многоточия на длинной подписи.
 * Остальные узлы (значок и т.п.) проходят как есть.
 *
 * Зачем узел вообще: голый текст во флекс-контейнере — анонимный блок, и
 * `text-overflow: ellipsis` на контейнере до него не доходит — длинный текст
 * срезался посреди буквы без многоточия. `overflow-clip` с запасом, а не
 * `truncate`: `overflow-hidden` срезал у «Д» выносной элемент левее начала
 * строки, и короткие подписи переставали совпадать с прежними до пикселя.
 *
 * Используют пункт списка Select, значение Select и значение
 * ComboboxTrigger — всюду, где текст лежит прямо во флексе.
 */
function clipText(children: React.ReactNode) {
  const out: React.ReactNode[] = []
  let text: Array<string | number> = []
  const flush = () => {
    if (text.length === 0) return
    out.push(
      <span
        key={`text-${out.length}`}
        data-slot="clip-text"
        className="min-w-0 overflow-clip text-ellipsis whitespace-nowrap [overflow-clip-margin:4px]"
      >
        {text.join("")}
      </span>
    )
    text = []
  }
  // Фрагменты раскрываются: несколько значений Select Base UI отдаёт как
  // `[<>Первый</>, ", ", <>Второй</>]`, и без раскрытия текст шёл мимо узла.
  for (const child of flattenChildren(children)) {
    if (typeof child === "string" || typeof child === "number") {
      text.push(child)
      continue
    }
    flush()
    out.push(child)
  }
  flush()
  return out
}

export { clipText }
