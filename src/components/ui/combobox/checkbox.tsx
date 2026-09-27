import { Check, Minus } from "@/icons"

import { cn } from "@/lib/utils"

// Общий внешний вид и для настоящих индикаторов Combobox.Item, и для
// управляемой вручную родительской строки группы (которая сама выбираемым
// пунктом не является).
//
// Второй проход: стояло size-5 (20px), а литеральные инстансы
// «ELK / checkbox», снятые с канваса, имеют 24px (size-6). Класс
// rounded-md и так разрешается в шкалу кита 8px, что совпадает с
// литеральным rounded-[8px] макета, поэтому он не менялся.
export const COMBOBOX_CHECKBOX_BASE_CLASS =
  "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors"

export type ComboboxCheckboxState = "unchecked" | "checked" | "indeterminate"

// Собственный встроенный флажок у `ComboboxItem` (item.tsx) не может
// рисовать этот компонент напрямую: `Combobox.Item` из Base UI отдаёт
// `selected` только через CSS-атрибут `data-selected` (см.
// `ComboboxItemDataAttributes`), а не обычным булевым пропсом или
// колбэком отрисовки. Внутренний контекст, где булево значение всё же
// есть (`ComboboxItemContext` и `useComboboxItemContext`), в публичный API
// пакета не входит. Поэтому тот пункт по необходимости остаётся
// управляемым CSS-атрибутом (`group-data-[selected]/item:...`), а не
// значением `state` на JS, как этот компонент; вместо этого он
// переиспользует `COMBOBOX_CHECKBOX_BASE_CLASS` выше, чтобы хотя бы общее
// оформление коробки оставалось в одном месте.
export function ComboboxCheckbox({
  state,
  disabled,
  className,
}: {
  state: ComboboxCheckboxState
  disabled?: boolean
  className?: string
}) {
  const checked = state !== "unchecked"
  return (
    <span
      aria-hidden="true"
      className={cn(
        COMBOBOX_CHECKBOX_BASE_CLASS,
        checked
          ? "border-transparent bg-[var(--checkbox-checked-bg)] text-[var(--checkbox-checked-fg)]"
          : "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] text-transparent",
        disabled &&
          (checked
            ? "!bg-[var(--checkbox-disabled-bg)] !text-[var(--checkbox-disabled-fg)]"
            : "!border-[var(--checkbox-disabled-border)] !bg-[var(--checkbox-disabled-bg)]"),
        className
      )}
    >
      {state === "checked" && <Check className="size-4" strokeWidth={3} />}
      {state === "indeterminate" && (
        <Minus className="size-4" strokeWidth={3} />
      )}
    </span>
  )
}
