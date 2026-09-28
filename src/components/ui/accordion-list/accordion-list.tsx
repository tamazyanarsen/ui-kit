import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// AccordionList и AccordionListItem — «Content Accordion» из макета:
// обведённый рамкой список раскрывающихся строк (слева флажок, заголовок с
// шевроном и подзаголовок, справа описание, кнопка и меню-«кебаб»), в
// противоположность самостоятельной карточке из ./accordion-card.tsx. Клик
// в любом месте строки переключает её, а флажок, кнопка и «кебаб» —
// настоящие вложенные контролы, которые останавливают всплытие, чтобы не
// переключать заодно и строку (тот же приём `nativeButton={false}` плюс
// `render={<div/>}`, которым пользуется SelectTrigger для своей вложенной
// кнопки очистки: триггер в Base UI по умолчанию настоящий <button> и не
// может содержать других интерактивных элементов).

const ITEM_VALUE = "item"

// Пункт внутри `AccordionList` — элемент списка (`role="listitem"`): у
// `role="list"` без них скринридер объявлял пустой список. Роль приходит
// через контекст, а не безусловно: пункт, поставленный вне списка, с ролью
// listitem был бы таким же нарушением ARIA, только наоборот.
const InListContext = React.createContext(false)

type DescriptionType =
  | "default"
  | "success"
  | "attention"
  | "error"
  | "information"

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
function hasValue(node: React.ReactNode) {
  return node != null && node !== false && node !== ""
}

const DESCRIPTION_COLOR: Record<DescriptionType, string> = {
  default: "text-[var(--accordion-list-description-default-fg)]",
  success: "text-[var(--accordion-list-description-success-fg)]",
  attention: "text-[var(--accordion-list-description-attention-fg)]",
  error: "text-[var(--accordion-list-description-error-fg)]",
  information: "text-[var(--accordion-list-description-information-fg)]",
}

const TITLE_SIZE = {
  h3: "text-h3",
  h4: "text-h4",
} as const

interface AccordionListItemProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  titleAs?: "h3" | "h4"
  showCheckbox?: boolean
  /**
   * Доступное имя флажка. По умолчанию — «Выбрать: <заголовок>» для
   * строкового заголовка и ссылка на сам заголовок для разметки.
   */
  checkboxLabel?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  description?: React.ReactNode
  descriptionType?: DescriptionType
  showButtons?: boolean
  buttonsType?: "button" | "dropdown" | "both"
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  onMoreClick?: () => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
}

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function AccordionListItem({
  title,
  subtitle,
  titleAs = "h3",
  showCheckbox = false,
  checkboxLabel,
  checked,
  defaultChecked,
  onCheckedChange,
  description,
  descriptionType = "default",
  showButtons = false,
  buttonsType = "both",
  buttonLabel = "Button",
  onButtonClick,
  onMoreClick,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: AccordionListItemProps) {
  const controlled = open !== undefined
  const inList = React.useContext(InListContext)
  const titleId = React.useId()
  // Флажок без имени скринридер объявлял просто «флажок»: подпись бралась
  // только из строкового заголовка, а заголовок-разметка оставался без неё.
  const checkboxName =
    checkboxLabel ?? (typeof title === "string" ? `Выбрать: ${title}` : undefined)
  const showButton = showButtons && buttonsType !== "dropdown"
  const showMore = showButtons && buttonsType !== "button"

  return (
    <AccordionPrimitive.Root
      data-slot="accordion-list-item"
      role={inList ? "listitem" : undefined}
      value={controlled ? (open ? [ITEM_VALUE] : []) : undefined}
      defaultValue={defaultOpen ? [ITEM_VALUE] : []}
      onValueChange={
        onOpenChange
          ? (value: string[]) => onOpenChange(value.includes(ITEM_VALUE))
          : undefined
      }
      // Дизайн-чек от 07.09, замечание 10: «Content Accordion не должен
      // обладать собственным фоном… он просто лежит на подложке, у которой
      // свои правила цвета». Было `bg-white` — из-за него строка рисовала
      // белую полосу поверх серой подложки блока.
      className={cn("w-full", className)}
    >
      <AccordionPrimitive.Item value={ITEM_VALUE}>
        <AccordionPrimitive.Header render={titleAs === "h4" ? <h4 /> : <h3 />}>
          <AccordionPrimitive.Trigger
            nativeButton={false}
            render={<div />}
            data-slot="accordion-list-trigger"
            // Без собственных отступов: в мастере строка `content
            // accordion` начинается прямо от края (Top-фрейм x=0..719,
            // дети от x=0) — отступы даёт контентный блок страницы, в
            // который компонент вкладывается.
            className="flex w-full cursor-pointer items-start gap-4 text-left outline-none focus-visible:focus-ring transition-colors [&[data-panel-open]_[data-slot=accordion-list-chevron]]:rotate-180"
          >
            {showCheckbox && (
              <span
                className="mt-0.5 shrink-0"
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <Checkbox
                  checked={checked}
                  defaultChecked={defaultChecked}
                  onCheckedChange={onCheckedChange}
                  aria-label={checkboxName}
                  aria-labelledby={checkboxName ? undefined : titleId}
                />
              </span>
            )}

            {/* Колонка Title.Subtitle из мастера: `flex-1 flex-col gap-4`,
                внутри — строка Title (Text + Status) и под ней Subtitle.
                Status («Подписано») живёт
                именно здесь, на строке заголовка, а не в группе кнопок —
                отсюда и претензия дизайн-чека №24, что он «располагается
                выше чем середина по кнопкам». */}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex w-full items-start gap-3">
                {/* Дизайн-чек №23: заголовок больше не обрезается в
                    многоточие. «Длинный текст становится многострочным, а
                    иконка шеврона ставится не по концу контейнера текста, а
                    ставится с небольшим пробелом от последнего символа в
                    конце строки, то есть располагается inline». Поэтому
                    шеврон — inline-элемент внутри самого текста, а не
                    отдельная flex-колонка: так он едет за последним словом
                    при переносе. В мастере он лежит во вложенном фрейме
                    `Text` (flex gap-12, items-end), что для одной строки
                    даёт тот же результат, а многострочный случай в
                    документации просто не нарисован.

                    Зазор до шеврона — единственная метрика, различающаяся
                    между размерами заголовка: 12px на H3 и 8px на H4
                    (Text-фрейм H3 — gap-[12px]; в H4 заголовок шириной 43
                    заканчивается на 43, а Box начинается на 51). */}
                <span
                  id={titleId}
                  className={cn(
                    "min-w-0 flex-1 text-[var(--accordion-list-title-fg)]",
                    TITLE_SIZE[titleAs]
                  )}
                >
                  {title}
                  <ChevronDownIcon
                    aria-hidden="true"
                    data-slot="accordion-list-chevron"
                    className={cn(
                      "inline-block size-4 shrink-0 align-middle text-[var(--accordion-list-icon-fg)] transition-transform duration-200",
                      titleAs === "h4" ? "ml-2" : "ml-3"
                    )}
                  />
                </span>

                {/* Проверка на «есть что показать», а не на истинность: 0 —
                    настоящее значение (сумма, счётчик), а `0 && …` выводил
                    голую цифру за заголовком, вне своей колонки. */}
                {hasValue(description) && (
                  <span
                    className={cn(
                      // `py` из мастера (Status — `flex items-start py-[4px]`)
                      // центрирует 24px-строку в 32px-строке заголовка H3;
                      // на H4 строка заголовка 28px, поэтому 2px.
                      "shrink-0 text-right text-p1-medium",
                      titleAs === "h4" ? "py-0.5" : "py-1",
                      DESCRIPTION_COLOR[descriptionType]
                    )}
                  >
                    {description}
                  </span>
                )}
              </span>
              {hasValue(subtitle) && (
                // Подзаголовок в мастере тоже `w-full` без обрезки — переносится.
                <span className="text-p1-medium text-[var(--accordion-list-subtitle-fg)]">
                  {subtitle}
                </span>
              )}
            </span>

            <span className="flex shrink-0 items-start gap-4">
              {(showButton || showMore) && (
                <span className="flex items-start gap-2">
                  {showButton && (
                    <span onMouseDown={stopPropagation} onClick={stopPropagation}>
                      <Button
                        type="button"
                        variant="secondary-grey"
                        size="sm"
                        onClick={onButtonClick}
                      >
                        {buttonLabel}
                      </Button>
                    </span>
                  )}
                  {showMore && (
                    <span onMouseDown={stopPropagation} onClick={stopPropagation}>
                      <Button
                        type="button"
                        variant="secondary-grey"
                        size="sm"
                        icon={Ellipsis}
                        iconPosition="only"
                        aria-label="Ещё"
                        onClick={onMoreClick}
                      />
                    </span>
                  )}
                </span>
              )}
            </span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        {children && (
          <AccordionPrimitive.Panel
            data-slot="accordion-list-panel"
            className="h-(--accordion-panel-height) overflow-hidden text-p2-medium transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
          >
            {/* Мастер ставит слот содержимого ровно на 24px ниже шапки
                (шапка заканчивается на 60, слот начинается на 84) и тянет
                его во всю ширину строки — без собственных отступов снизу и
                по бокам, раз у триггера отступов больше нет. */}
            <div className="pt-6">
              {children}
            </div>
          </AccordionPrimitive.Panel>
        )}
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

function AccordionList({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="accordion-list"
      role="list"
      // Просто стек строк с шагом 24px, без рамки и разделителей: в Figma
      // инстансы `ELK / content accordion` стоят один под другим с зазором
      // 24 (варианты 8/7: y = 0, 84, 168, 252, 336 при высоте строки 60)
      // внутри контентного блока страницы — «Компонент располагается внутри
      // контентного блока». Рамка + divide-y были изобретением кита.
      className={cn("flex w-full flex-col gap-6", className)}
    >
      <InListContext.Provider value>{children}</InListContext.Provider>
    </div>
  )
}

export { AccordionList, AccordionListItem }
