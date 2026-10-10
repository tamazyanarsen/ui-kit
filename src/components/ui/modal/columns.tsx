import * as React from "react"

import { cn } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { Scrollbar } from "@/components/ui/scrollbar"

/**
 * Двухколоночное тело модалки — `Modal Body (Large, ELK)`, `Column = Two`.
 *
 * Дизайн-чек 08.10, замечание 15: «пересобрать с двумя слотами для
 * соответствующей структуры». Раньше «Two» был обычным `ModalBody` с
 * `grid-cols-2` — одна прокрутка на обе колонки, без разделителя между ними.
 * В макете (45321:17352 без кнопок, 45321:17365 с кнопками) это два
 * независимых слота:
 *
 *   • Left — 384px (64 + 300 + 20), справа 1px Grey 134, своя полоса
 *     прокрутки (8 от правого края, 8 сверху и снизу);
 *   • Right — остаток ширины, pl 24 / pr 64, своя полоса прокрутки;
 *   • у обоих py 16;
 *   • разделители по краям тела — те же, что у `ModalBody`: верхний, когда
 *     хотя бы одна колонка прокручена, нижний — пока хотя бы одна не
 *     домотана до конца;
 *   • без кнопок внизу остаётся пустой холдер 48px (`Bottom → Holder`),
 *     с кнопками его роль играет `ModalFooter`.
 *
 * На мобильном (шторка) мобильного варианта у «Two» в макете нет: колонки
 * встают одна под другой и прокручиваются вместе, как обычное тело.
 */
interface ModalColumnsProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Slot 1 — левая колонка (навигация, список). */
  left: React.ReactNode
  /** Slot 2 — правая колонка (содержимое). */
  right: React.ReactNode
}

function ModalColumn({
  side,
  children,
  edges,
}: {
  side: "left" | "right"
  children: React.ReactNode
  edges: ReturnType<typeof useScrollEdges<HTMLDivElement>>
}) {
  return (
    <div
      data-slot={`modal-column-${side}`}
      className={cn(
        "flex shrink-0 flex-col desktop:min-h-0 desktop:shrink",
        side === "left"
          ? "border-b border-[var(--modal-divider)] desktop:w-[384px] desktop:border-r desktop:border-b-0"
          : "desktop:min-w-0 desktop:flex-1"
      )}
    >
      <Scrollbar
        ref={edges.ref}
        onScroll={edges.update}
        className={cn(
          // Полоса — в 8px от правого края колонки (поле справа у окна
          // прокрутки) и с отступом 8 сверху и снизу (поле дорожки, а не
          // рамка: содержимое обрезается краем колонки, а не на 8px раньше).
          "min-h-0 flex-1 desktop:mr-2 desktop:[&::-webkit-scrollbar-track]:my-2",
          side === "left"
            ? // 12 + 8 (поле под полосу) = 20 справа, как в макете.
              "px-4 py-4 desktop:pt-4 desktop:pr-3 desktop:pb-4 desktop:pl-(--modal-px)"
            : // 56 + 8 = 64 справа.
              "px-4 py-4 desktop:pt-4 desktop:pr-[calc(var(--modal-px)_-_8px)] desktop:pb-4 desktop:pl-6"
        )}
      >
        {children}
      </Scrollbar>
    </div>
  )
}

const ModalColumns = React.forwardRef<HTMLDivElement, ModalColumnsProps>(function ModalColumns(
  { left, right, className, ...props },
  ref
) {
  // Три окна прокрутки: на мобильном прокручивается общий ряд, на десктопе —
  // каждая колонка. Разделитель решает «хоть одно» из них.
  const row = useScrollEdges<HTMLDivElement>([left, right])
  const leftEdges = useScrollEdges<HTMLDivElement>([left])
  const rightEdges = useScrollEdges<HTMLDivElement>([right])
  const all = [row, leftEdges, rightEdges]
  const dividerTop = all.some((edge) => edge.scrolledFromTop)
  const dividerBottom = all.some((edge) => !edge.scrolledToEnd)

  return (
    <div
      ref={ref}
      data-slot="modal-columns"
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        // Последний в окне (подвала нет) — холдер 48px снизу, как
        // `Bottom → Holder` у варианта без кнопок; на мобильном — 24.
        "last:pb-6 desktop:last:pb-12",
        className
      )}
      {...props}
    >
      <Scrollbar
        ref={row.ref}
        onScroll={row.update}
        data-divider-top={dividerTop ? "" : undefined}
        data-divider-bottom={dividerBottom ? "" : undefined}
        className={cn(
          "flex min-h-0 flex-1 flex-col desktop:flex-row desktop:overflow-hidden",
          "[box-shadow:var(--divider-top,0_0_#0000),var(--divider-bottom,0_0_#0000)]",
          dividerTop && "[--divider-top:inset_0_1px_0_var(--modal-divider)]",
          dividerBottom && "[--divider-bottom:inset_0_-1px_0_var(--modal-divider)]"
        )}
      >
        <ModalColumn side="left" edges={leftEdges}>
          {left}
        </ModalColumn>
        <ModalColumn side="right" edges={rightEdges}>
          {right}
        </ModalColumn>
      </Scrollbar>
    </div>
  )
})

export { ModalColumns }
export type { ModalColumnsProps }
