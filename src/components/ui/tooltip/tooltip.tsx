import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"

import {
  ARROW_BASE,
  DIRECTION_PLACEMENT,
  TOOLTIP_WIDTH,
  arrowPositionClass,
  type TooltipDirection,
  type TooltipWidth,
} from "./variants"
import { CloseCross } from "@/components/ui/close-cross"

// Tooltip — младший брат Hint (см. hint.tsx), открывающийся по наведению.
// По макету: появляется после задержки наведения в 400 мс (чтобы при
// проводке курсора по странице подсказки не мигали) и закрывается сразу,
// как только курсор ушёл. Максимальная ширина 256px, высота
// подстраивается.
interface TooltipProps {
  content: React.ReactNode
  /** Дизайн-чек 3/3 №5: у `ELK / tooltip & hint` есть свойство Show Title —
   * заголовок над текстом, поэтому он есть и здесь, а не только
   * у Hint. */
  title?: React.ReactNode
  /** Дизайн-чек 3/3 №5: свойство Show Cross того же компонент-сета
   * . У Tooltip по умолчанию выключен — он закрывается уводом
   * курсора, крестик нужен не всегда. */
  showCross?: boolean
  direction?: TooltipDirection
  /**
   * Режим ширины: `base` — 256px, `auto` — по содержимому.
   *
   * Дизайн-чек от 07.09, замечание 18 (см. `TOOLTIP_WIDTH` в variants.ts).
   */
  width?: TooltipWidth
  children: React.ReactElement
  className?: string
  /** Держит подсказку постоянно закрытой, оставляя обёртку
   * смонтированной. Для якорей, у которых подсказка появляется и исчезает
   * вместе с содержимым (Input поясняет себя только пока заблокирован или
   * пока значение не помещается): переключение между обёрнутым и
   * необёрнутым ребёнком вместо этого перемонтировало бы всё поддерево
   * якоря, а для поля это означает потерю фокуса и позиции каретки прямо
   * посреди набора текста. */
  disabled?: boolean
}

// ⚠️ Tooltip умеет быть целью `render` чужого триггера. `SelectionButton`
// принимает `trigger`, и потребитель кладёт туда `<Tooltip><Button/></Tooltip>`,
// чтобы у кнопки меню была подсказка: примитив меню клонирует элемент,
// отдавая ему ref и свои обработчики. Компонент без forwardRef ref терял, а
// обработчики оставались на нём самом — меню не открывалось вовсе. Теперь
// лишние пропсы и ref уходят на триггер подсказки, то есть на сам дочерний
// элемент.
type TooltipRestProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "content" | "title" | "children" | "className"
>

const Tooltip = React.forwardRef<
  HTMLElement,
  TooltipProps & TooltipRestProps
>(function Tooltip({
  content,
  title,
  showCross = false,
  direction = "top-center",
  width = "base",
  children,
  className,
  disabled = false,
  ...triggerProps
}, ref) {
  const { side, align } = DIRECTION_PLACEMENT[direction]
  // `{cond && <Button/>}` отдаёт сюда false/null, а текст — строку: id
  // читается только у настоящего элемента.
  const childId = React.isValidElement(children)
    ? (children.props as { id?: string }).id
    : undefined
  // Состояние открытия управляемое всегда, а не по условию: передавать
  // Root пропс `open` только в выключенном состоянии значило бы
  // переключать его между неуправляемым и управляемым, а Base UI
  // предупреждает ровно об этом.
  const [open, setOpen] = React.useState(false)
  // Выключение сбрасывает и внутреннее состояние. Base UI при `open={false}`
  // считает подсказку закрытой и `onOpenChange(false)` не присылает, так что
  // `open` оставался `true` — и при повторном включении подсказка
  // всплывала сама, без наведения.
  if (disabled && open) setOpen(false)

  // Прикрепить подсказку не к чему (`{cond && <Button/>}` дало false) — не
  // рисуем ничего: пустой триггер был бы лишней фокусируемой кнопкой.
  if (children == null || (children as unknown) === false || (children as unknown) === true) {
    return null
  }

  return (
    <TooltipPrimitive.Provider delay={400} closeDelay={0}>
      <TooltipPrimitive.Root open={disabled ? false : open} onOpenChange={setOpen}>
        {/* ⚠️ Id ребёнка отдаётся самому триггеру. Base UI регистрирует триггер
            под своим id, а собственный `id` у ребёнка (`<Button id="save">`)
            перекрывает его в DOM: реестр «терял» триггер, и подсказка,
            открывшись, тут же закрывалась сама. */}
        <TooltipPrimitive.Trigger
          {...triggerProps}
          ref={ref as React.Ref<HTMLButtonElement>}
          id={childId ?? triggerProps.id}
          // Строка или число вместо элемента: Base UI отвергает такой
          // `render` ошибкой, поэтому текст становится содержимым триггера.
          render={React.isValidElement(children) ? children : undefined}
        >
          {React.isValidElement(children) ? undefined : (children as React.ReactNode)}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={8}
            className="z-50"
          >
            {/* Дизайн-чек 3/3 №4: стрелка рисуется вручную и прижимается к
                грани самого пузыря (см. arrowPositionClass в variants.ts), а
                не к центру якоря, как это делает `<Tooltip.Arrow>`. Раскладку
                берём из состояния попапа — оно отдаёт РАЗРЕШЁННЫЕ side/align,
                то есть уже с учётом возможного collision-флипа. */}
            <TooltipPrimitive.Popup
              data-slot="tooltip-content"
              render={(popupProps, state) => (
                <div {...popupProps}>
                  <div className="themed-scrollbar -m-1 flex max-h-[calc(var(--available-height)-1.5rem)] min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-1 pr-2 [overflow-wrap:anywhere]">
                    {hasNode(title) && <p className="font-medium">{title}</p>}
                    <div>{content}</div>
                  </div>
                  {showCross && (
                    <CloseCross
                      onClick={() => setOpen(false)}
                      className="text-[var(--tooltip-fg)]"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      ARROW_BASE,
                      arrowPositionClass(state.side, state.align)
                    )}
                  />
                </div>
              )}
              className={cn(
                // Раскладка та же, что у Hint: текстовая колонка и крестик —
                // соседи в одной строке (gap-2), а не «иконка над текстом».
                "relative flex items-start gap-2 rounded-[8px] bg-[var(--tooltip-bg)] py-3 pr-3 pl-4 text-p3-medium text-[var(--tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                TOOLTIP_WIDTH[width],
                className
              )}
            />
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
})

export { Tooltip }
export type { TooltipProps }
