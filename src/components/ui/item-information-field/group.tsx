import type * as React from "react"

import { cn } from "@/lib/utils"

import type { FieldType } from "./item-information-field"

/**
 * ItemInformationFieldGroup — стопка информационных полей.
 *
 * Дизайн-чек от 07.09, замечание 5: «Information Field содержит лишний гэп в
 * группе. Группа Information Field в варианте Label Left ставится друг с
 * другом в стопку с НУЛЕВЫМ гэпом».
 *
 * Зазор зависит от типа полей, и это ровно то, что вызывающие путали:
 *
 *   • `label-left` — поле само несёт отступы (16 сверху, 15 снизу) и линию,
 *     поэтому зазор контейнера ноль. Любой gap здесь читается как «между
 *     строками пусто», что и увидел дизайнер;
 *   • остальные три типа — «голое» содержимое без отступов, их разводит
 *     контейнер, и норма там 16.
 *
 * Компонент нужен именно поэтому: правило принадлежит группе, а не полю, и
 * пока его не было, каждая витрина и каждый экран решали его заново — в
 * витрине Card Box вышло `gap-6`, на экране транша `gap-4`.
 */
interface ItemInformationFieldGroupProps extends React.ComponentProps<"div"> {
  /** Тип полей внутри — от него зависит зазор. */
  type?: FieldType
}

function ItemInformationFieldGroup({
  type = "label-left",
  className,
  ...props
}: ItemInformationFieldGroupProps) {
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
    />
  )
}

export { ItemInformationFieldGroup }
export type { ItemInformationFieldGroupProps }
