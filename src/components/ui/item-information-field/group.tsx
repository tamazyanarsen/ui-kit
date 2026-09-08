import * as React from "react"

import { cn } from "@/lib/utils"

import {
  ItemInformationField,
  type FieldType,
} from "./item-information-field"

/**
 * ItemInformationFieldGroup — стопка информационных полей.
 *
 * Держит два правила стопки, которых у отдельного поля быть не может: зазор
 * между полями и разделитель под последним из них.
 *
 * **Зазор.** Дизайн-чек от 07.09, замечание 5: «Information Field содержит
 * лишний гэп в группе. Группа Information Field в варианте Label Left
 * ставится друг с другом в стопку с НУЛЕВЫМ гэпом». Он зависит от типа полей,
 * и это ровно то, что вызывающие путали:
 *
 *   • `label-left` — поле само несёт отступы (16 сверху, 15 снизу) и линию,
 *     поэтому зазор контейнера ноль. Любой gap здесь читается как «между
 *     строками пусто», что и увидел дизайнер;
 *   • остальные три типа — «голое» содержимое без отступов, их разводит
 *     контейнер, и норма там 16.
 *
 * **Последний разделитель.** Дизайн-чек от 08.09, замечание 2: «В стопке
 * Information Field из вариантов Label Left на фронте должно быть правило,
 * что последний разделитель никогда не показывается».
 *
 * ⚠️ Почему правило живёт ЗДЕСЬ, а не в CSS. В `styles/base.css` есть
 * `:last-child`-правило, гасящее линию у последней строки, но с оговоркой
 * `:not([data-divider="on"])`: явно включённый проп сильнее списка — иначе в
 * витрине одинокого поля контрол `divider` выглядел бы мёртвым (замечание 20
 * прошлого чека). Экран же ставил `divider` каждому полю подряд, включая
 * последнее, и висящая линия возвращалась. Стопка — единственное место, где
 * известно, какое поле последнее, поэтому она и снимает разделитель, что бы
 * ни просил вызывающий.
 */
interface ItemInformationFieldGroupProps extends React.ComponentProps<"div"> {
  /** Тип полей внутри — от него зависит зазор. */
  type?: FieldType
}

function ItemInformationFieldGroup({
  type = "label-left",
  className,
  children,
  ...props
}: ItemInformationFieldGroupProps) {
  const items = React.Children.toArray(children)
  let lastField = -1
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const node = items[index]
    if (React.isValidElement(node) && node.type === ItemInformationField) {
      lastField = index
      break
    }
  }

  return (
    <div
      data-slot="item-information-field-group"
      data-type={type}
      className={cn(
        "flex w-full flex-col",
        type === "label-left" ? "gap-0" : "gap-4",
        className
      )}
      {...props}
    >
      {items.map((node, index) =>
        index === lastField && React.isValidElement(node)
          ? React.cloneElement(
              node as React.ReactElement<{ divider?: boolean }>,
              { divider: false }
            )
          : node
      )}
    </div>
  )
}

export { ItemInformationFieldGroup }
export type { ItemInformationFieldGroupProps }
