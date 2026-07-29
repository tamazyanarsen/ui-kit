import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const modalPopupVariants = cva(
  // Mobile-first: unprefixed classes are the mobile bottom-sheet form,
  // `md:` switches to the centered desktop card at the 768px breakpoint.
  "fixed inset-x-0 bottom-0 z-50 flex max-h-[87vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-[var(--modal-bg)] shadow-xl outline-none data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[87vh] md:w-(--modal-width) md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--modal-radius)] md:data-open:slide-in-from-bottom-0 md:data-open:zoom-in-95 md:data-closed:slide-out-to-bottom-0 md:data-closed:zoom-out-95",
  {
    variants: {
      size: {
        l: "md:[--modal-width:640px]",
        m: "md:[--modal-width:480px]",
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
        {children}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 z-10"
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
