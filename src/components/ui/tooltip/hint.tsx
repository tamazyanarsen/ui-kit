import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

import {
  ARROW_BASE,
  DIRECTION_PLACEMENT,
  TOOLTIP_WIDTH,
  arrowPositionClass,
  type TooltipDirection,
  type TooltipWidth,
} from "./variants"

// Hint открывается по клику и закрывается своим крестиком или кликом
// снаружи (обычное поведение поповера). В отличие от Tooltip, он несёт
// больше содержимого: необязательный заголовок плюс основной текст.
// Максимальная ширина 592px, высота подстраивается.
//
// Ниже `md` это вообще другой компонент, а не переоформленный поповер:
// вариант `Direction=Mobile` в макете — это настоящий инстанс
// `ELK / Modal`, то есть нижняя шторка со строкой заголовка и крестиком,
// основным текстом и кнопкой «Понятно» во всю ширину, прижатой к нижней
// панели. Такую подмену средствами CSS не выразить (обе формы —
// поддеревья в портале), поэтому она работает от медиазапроса, а не от
// класса `desktop:`.
const MOBILE_DISMISS_LABEL = "Понятно"

interface HintProps {
  title?: React.ReactNode
  content: React.ReactNode
  showCross?: boolean
  direction?: TooltipDirection
  /**
   * Режим ширины: `base` — 256px, `auto` — по содержимому (до 592).
   *
   * Дизайн-чек от 07.09, замечание 18 (см. `TOOLTIP_WIDTH` в variants.ts).
   * Раньше Hint был жёстко 592 — на десктопе это половина колонки, и
   * короткая подсказка растягивалась во всю её ширину.
   */
  width?: TooltipWidth
  children: React.ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function Hint({
  title,
  content,
  showCross = true,
  direction = "down-center",
  width = "base",
  children,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: HintProps) {
  const { side, align } = DIRECTION_PLACEMENT[direction]
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <ModalTrigger render={children} />
        {/* Ниже `md` размер не имеет значения — там шторка всегда во всю
            ширину, — но `m` оставляет десктопный запасной вариант на
            карточке 592px, а не на 1008px, если это вдруг отрисуется
            широко. */}
        <ModalContent
          size="m"
          showClose={showCross}
          data-slot="hint-sheet"
          // Иначе у Hint без заголовка шторка осталась бы без доступного
          // имени: основной текст — это описание, а не подпись.
          aria-label={hasNode(title) ? undefined : "Подсказка"}
        >
          {hasNode(title) && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
          )}
          <ModalDescription
            className={cn(
              // Аудит 13: длинный текст раздвигал шторку за край экрана —
              // колонка шторки обрезана (`max-h-[87vh]`, `overflow-hidden`),
              // и вторая половина текста вместе с «Понятно» уходила вниз.
              // Текст сжимается и прокручивается сам, подвал всегда виден.
              "themed-scrollbar min-h-0 overflow-y-auto",
              "px-6 pb-5 desktop:px-8 desktop:pb-6",
              // Без шапки над собой тексту нужен её верхний отступ, иначе
              // он налезет на скруглённый верхний край шторки.
              !hasNode(title) && "pt-5 desktop:pt-6"
            )}
          >
            {content}
          </ModalDescription>
          <ModalFooter>
            <ModalClose
              render={
                <Button variant="secondary-grey" size="lg">
                  {MOBILE_DISMISS_LABEL}
                </Button>
              }
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverPrimitive.Trigger render={children} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="hint-content"
            className={cn(
              // Отступы и раскладка попиксельно сверены с мастером
              // «ELK / tooltip & hint»: обёртка это pl-4/pr-3/py-3 (а НЕ
              // равномерный p-4 — тот давал лишние 4px сверху и снизу), а
              // заголовок вместе с содержимым лежат в одной колонке
              // flex-col, которая является соседом значка закрытия (ряд с
              // gap-2), а не шапкой со значком над содержимым. Разница не
              // косметическая: когда значок стоит рядом со *всей* колонкой
              // текста, а не только со строкой заголовка, колонка текста
              // уже по всей высоте, и точка переноса длинного текста
              // получается другой, чем при укладке «значок сверху».
              "relative flex items-start gap-2 rounded-[8px] bg-[var(--tooltip-bg)] py-3 pr-3 pl-4 text-p3-medium text-[var(--tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              TOOLTIP_WIDTH[width],
              className
            )}
            /* Дизайн-чек 3/3 №4: та же правка, что и у Tooltip — стрелка
               прижата к грани пузыря по разрешённым side/align, а не наведена
               на центр якоря штатным `<Popover.Arrow>`. */
            render={(popupProps, state) => (
              <div {...popupProps}>
                <div className="themed-scrollbar -m-1 flex max-h-[calc(var(--available-height)-1.5rem)] min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-1 pr-2 [overflow-wrap:anywhere]">
                  {hasNode(title) && (
                    <PopoverPrimitive.Title className="font-medium">
                      {title}
                    </PopoverPrimitive.Title>
                  )}
                  <div>{content}</div>
                </div>
                {showCross && (
                  <PopoverPrimitive.Close
                    aria-label="Закрыть"
                    className="shrink-0 text-[var(--tooltip-fg)] outline-none focus-visible:focus-ring"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </PopoverPrimitive.Close>
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
          />
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Hint }
export type { HintProps }
