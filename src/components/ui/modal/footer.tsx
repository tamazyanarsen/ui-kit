import * as React from "react"

import { cn } from "@/lib/utils"

// Закреплённая полоса кнопок («Modal Bottom» в макете). Передайте одну
// Button для «Type: Primary» или «Secondary» и две для «Type: Buttons».
// Порядок детей — [вторичная, основная]: на мобильном они складываются во
// всю ширину с основной сверху через flex-col-reverse, а на десктопе
// раскладываются слева в заданном порядке (дизайн-чек, замечание 36:
// раньше прижимались вправо через justify-end).
//
// Горизонтальный отступ следует за отступом самого окна, а не задан жёстко:
// `Modal Bottom (Large, ELK)` — это `px-[64px] pb-[48px]`, а у маленького
// 48px, то есть тот же --modal-px, которым уже пользуются шапка и тело.
// Плоские 48px здесь оставляли кнопки большого окна на 16px внутрь от его
// же текста.
const ModalFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function ModalFooter({ className, ...props }, ref) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-4 px-6 py-5 [&>*]:w-full desktop:flex-row desktop:justify-start desktop:gap-6 desktop:px-(--modal-px) desktop:pt-4 desktop:pb-12 desktop:[&>*]:w-auto",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

export { ModalFooter }
