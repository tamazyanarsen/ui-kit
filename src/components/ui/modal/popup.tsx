import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const modalPopupVariants = cva(
  // Mobile-first: unprefixed classes are the mobile bottom-sheet form,
  // `md:` switches to the centered desktop card at the 768px breakpoint.
  // Deliberately no `overflow-hidden` here — it lives on the inner wrapper
  // instead (see ModalContent) so the close button, positioned outside
  // these bounds per design-check #37, doesn't get clipped by it.
  "fixed inset-x-0 bottom-0 z-50 flex max-h-[87vh] w-full flex-col rounded-t-[32px] bg-[var(--modal-bg)] shadow-xl outline-none data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[87vh] md:w-(--modal-width) md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--modal-radius)] md:data-open:slide-in-from-bottom-0 md:data-open:zoom-in-95 md:data-closed:slide-out-to-bottom-0 md:data-closed:zoom-out-95",
  {
    // Design-check #40: measured directly off ui/modal/modal-1.svg at
    // native scale (pixel-scanned the white card's own left/right edges,
    // not eyeballed) — "Large Modal" is 1008px and "Small Modal" is 592px,
    // both well past the previous 640/480 guesses.
    variants: {
      size: {
        l: "md:[--modal-width:1008px]",
        m: "md:[--modal-width:592px]",
      },
    },
    defaultVariants: {
      size: "l",
    },
  }
)

interface ModalContentProps
  extends DialogPrimitive.Popup.Props,
    VariantProps<typeof modalPopupVariants> {}

function ModalContent({
  className,
  size,
  children,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="modal-backdrop"
        className="fixed inset-0 z-50 bg-[var(--modal-backdrop)]/70 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <DialogPrimitive.Popup
        data-slot="modal-content"
        className={cn(modalPopupVariants({ size }), className)}
        {...props}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">
          {children}
        </div>
        <DialogPrimitive.Close
          // Design-check #37: sits outside the card's own bounds, not
          // inside it — floats above-right of the bottom sheet on mobile
          // (over whatever's behind, matching the anatomy sheet), peeks out
          // past the card's top-right corner on desktop.
          className="absolute -top-14 right-4 z-10 md:top-4 md:-right-14"
          render={
            <Button
              variant="secondary-grey"
              size="sm"
              icon={X}
              iconPosition="only"
              aria-label="Закрыть"
            />
          }
        />
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

export { ModalContent, modalPopupVariants }
