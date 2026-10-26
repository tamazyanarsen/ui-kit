import * as React from "react"
import { Filtering } from "@/icons"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

import {
  FilterBarContext,
  type FilterBarContextValue,
  type FilterBarField,
} from "./filter-bar-context"
import { FilterSheetButtons } from "./sheet-buttons"

// FilterBar — ряд фильтров над списком, таблицей или реестром карточек.
//
// Правки UI-Kit от 25.10, «Ряд фильтров — нет мобильного режима „кнопка
// Фильтры + штора“» и правило каркаса «Фильтры над списком в мобильном виде»:
//   • на десктопе — фильтры (дети) в ряд, поиск (`search`) — первым;
//   • в мобильном виде (уже 1280) — поиск во всю ширину, под ним кнопка
//     «Фильтры» (secondary-grey S, значок Filtering слева) со счётчиком
//     активных фильтров — красный `Badge` на правом верхнем углу; нет
//     активных — нет счётчика;
//   • кнопка открывает штору «Фильтры»: каждый фильтр — своим полем сверху
//     вниз через 24 (выбор — группа таблеток, диапазон — два поля в строку,
//     дата — поле даты, флаг — Checkbox); внизу «Применить» и «Сбросить» во
//     всю ширину. Выбор — черновик до «Применить»; «Сбросить» снимает все
//     фильтры и закрывает штору.
//
// Как фильтр попадает в штору — см. filter-bar-context.ts: дети остаются
// смонтированными и регистрируют описание своего поля. Поэтому фильтры
// ряда — обычные `FilterSelect`, `FilterRange`… с теми же пропами, а без
// `FilterBar` каждый из них работает сам по себе, как раньше.

interface FilterBarProps extends React.ComponentProps<"div"> {
  /** Поле поиска (обычно `Input variant="filter-search"`). */
  search?: React.ReactNode
  /** Подпись кнопки и заголовок шторы в мобильном виде. */
  sheetTitle?: string
}

type Fields = Map<string, FilterBarField<unknown>>

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  function FilterBar(
    { search, sheetTitle = "Фильтры", className, children, ...props },
    ref
  ) {
    const isDesktop = useIsDesktop()
    const fieldsRef = React.useRef<Fields>(new Map())
    // Ряд перерисовывается, только когда меняется видимое снаружи шторы —
    // состав полей или их активность (счётчик на кнопке).
    const [, bump] = React.useReducer((n: number) => n + 1, 0)
    const [open, setOpen] = React.useState(false)
    const [drafts, setDrafts] = React.useState<Record<string, unknown>>({})
    const [showErrors, setShowErrors] = React.useState(false)

    const context = React.useMemo<FilterBarContextValue>(
      () => ({
        register(id, field) {
          const fields = fieldsRef.current
          const previous = fields.get(id)
          fields.set(id, field as unknown as FilterBarField<unknown>)
          if (!previous || previous.active !== field.active) bump()
        },
        unregister(id) {
          if (fieldsRef.current.delete(id)) bump()
        },
      }),
      []
    )

    const fields = [...fieldsRef.current.entries()]
    const activeCount = fields.filter(([, field]) => field.active).length

    function handleOpenChange(next: boolean) {
      if (next && !open) {
        setDrafts(
          Object.fromEntries(fields.map(([id, field]) => [id, field.value]))
        )
        setShowErrors(false)
      }
      setOpen(next)
    }

    const draftOf = (id: string, field: FilterBarField<unknown>) =>
      id in drafts ? drafts[id] : field.value

    function handleApply() {
      const invalid = fields.some(
        ([id, field]) => field.validate && !field.validate(draftOf(id, field))
      )
      if (invalid) {
        setShowErrors(true)
        return
      }
      for (const [id, field] of fields) {
        const draft = draftOf(id, field)
        const same = field.equals
          ? field.equals(draft, field.value)
          : Object.is(draft, field.value)
        if (!same) field.commit(draft)
      }
      setOpen(false)
    }

    function handleReset() {
      for (const [, field] of fields) {
        if (field.active) field.commit(field.empty())
      }
      setOpen(false)
    }

    // Одна и та же разметка в обеих формах: дети стоят на одном месте
    // дерева, и смена формы (поворот планшета, ресайз) их не перемонтирует —
    // неуправляемые фильтры не теряют выбранное. Меняется только значение
    // контекста: `null` на десктопе — фильтры рисуют свои чипы.
    return (
      <div
        ref={ref}
        data-slot="filter-bar"
        data-collapsed={isDesktop ? undefined : ""}
        className={cn(
          isDesktop
            ? "flex flex-wrap items-center gap-2"
            : "flex flex-col items-start gap-4",
          className
        )}
        {...props}
      >
        {search !== undefined && (
          <div
            data-slot="filter-bar-search"
            className={isDesktop ? "w-72 max-w-full" : "w-full"}
          >
            {search}
          </div>
        )}
        {!isDesktop && (
          <Modal open={open} onOpenChange={handleOpenChange}>
            <span className="relative inline-flex">
              <ModalTrigger
                render={
                  <Button variant="secondary-grey" size="sm" icon={Filtering} />
                }
              >
                {sheetTitle}
              </ModalTrigger>
              {activeCount > 0 && (
                <Badge
                  value={activeCount}
                  className="pointer-events-none absolute -top-1 -right-1"
                />
              )}
            </span>
            <ModalContent size="m" data-slot="filter-bar-sheet">
              <ModalHeader>
                <ModalTitle>{sheetTitle}</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  {fields.map(([id, field]) => (
                    <div key={id} data-slot="filter-bar-field">
                      {field.render({
                        draft: draftOf(id, field),
                        setDraft: (next) =>
                          setDrafts((prev) => ({ ...prev, [id]: next })),
                        showErrors,
                      })}
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <FilterSheetButtons
                  applyLabel="Применить"
                  onApply={handleApply}
                  onReset={handleReset}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        {/* В мобильной форме фильтры смонтированы, но сами ничего не
            рисуют — только регистрируют свои поля для шторы. */}
        <FilterBarContext.Provider value={isDesktop ? null : context}>
          {children}
        </FilterBarContext.Provider>
      </div>
    )
  }
)

export { FilterBar }
export type { FilterBarProps }
