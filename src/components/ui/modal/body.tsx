import * as React from "react"

import { cn } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { useComposedRefs } from "@/lib/compose-refs"
import { Scrollbar } from "@/components/ui/scrollbar"

// Прокручиваемая область содержимого. Разделитель появляется только у того
// края, за которым прокрутка действительно скрывает содержимое (сверху —
// когда уже прокрутили вниз, снизу — пока не дошли до конца) и никогда у
// обоих краёв сразу, если всё помещается. Само правило живёт в
// `useScrollEdges`: у Notification оно ровно такое же.
//
// Областью прокрутки служит собственный Scrollbar кита, а не голый
// overflow-y-auto: канвас Modal в макете кладёт инстанс `ELK / scrollbar`
// внутрь каждого тела окна (их там 29; шириной 4px, с отступом 8px справа и
// сверху, скрытый до того, как содержимое действительно переполнится), а
// это ровно то, что даёт вертикальная дорожка 4px у Scrollbar.
//
// `ref` и `onScroll` потребителя склеиваются с внутренними: раньше свой
// `onScroll` (он шёл в `{...props}` после внутреннего) молча отключал
// разделители, а `ref` на React 18 не доходил вовсе.
const ModalBody = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function ModalBody(
  { className, children, onScroll, ...props },
  forwardedRef
) {
  const { ref, scrolledFromTop, scrolledToEnd, update } =
    useScrollEdges<HTMLDivElement>([children])
  const setRef = useComposedRefs(ref, forwardedRef)

  return (
    <Scrollbar
      {...props}
      ref={setRef}
      onScroll={(event) => {
        update()
        onScroll?.(event)
      }}
      data-slot="modal-body"
      data-divider-top={scrolledFromTop ? "" : undefined}
      data-divider-bottom={!scrolledToEnd ? "" : undefined}
      // Разделители — внутренняя тень по краю, а не рамка: в макете
      // `Scroll Divider` лежит поверх края тела (y=-1) и места не занимает,
      // а рамка в CSS отнимала бы по пикселю сверху и снизу у КАЖДОГО окна.
      // Две тени складываются через переменные: обычный `shadow-*` у
      // верхнего и нижнего краёв перебивал бы друг друга.
      className={cn(
        "min-h-0 flex-1 px-4 py-3 desktop:px-(--modal-px) desktop:py-4",
        // Без шапки первым идёт холдер, и содержимое встаёт сразу под ним:
        // в макете у Body нет верхнего отступа (десктоп), а на мобильном
        // между строкой крестика и содержимым 24px.
        "[[data-slot=modal-top-holder]+&]:pt-6 desktop:[[data-slot=modal-top-holder]+&]:pt-0",
        "[box-shadow:var(--divider-top,0_0_#0000),var(--divider-bottom,0_0_#0000)]",
        scrolledFromTop && "[--divider-top:inset_0_1px_0_var(--modal-divider)]",
        !scrolledToEnd && "[--divider-bottom:inset_0_-1px_0_var(--modal-divider)]",
        className
      )}
    >
      {children}
    </Scrollbar>
  )
})

export { ModalBody }
