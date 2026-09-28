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
      className={cn(
        "min-h-0 flex-1 border-y border-transparent px-6 py-5 desktop:px-(--modal-px) desktop:py-4",
        scrolledFromTop && "border-t-[var(--modal-divider)]",
        !scrolledToEnd && "border-b-[var(--modal-divider)]",
        className
      )}
    >
      {children}
    </Scrollbar>
  )
})

export { ModalBody }
