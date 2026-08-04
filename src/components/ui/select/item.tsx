import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon } from "@/icons"

import { cn } from "@/lib/utils"

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-p3-regular text-muted-foreground", className)}
      {...props}
    />
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      // Round-2 audit: matches the literal "Menu Point (ELK), Type=Level 1,
      // Style=Text" instances sampled directly off canvas 666:11 (both the
      // standalone component and concrete usages inside real "ELK /
      // dropdown" instances) — p-[16px] all sides (not py-2/pr-8/pl-3), no
      // independent corner radius (pixel-sampled: item hover fills to a
      // hard square corner, rounding only comes from the popup's own clip),
      // 16px/500 text color var(--select-fg) (was inheriting shadcn's
      // near-black text-popover-foreground instead of the spec's #252628 —
      // the same class of bug this whole audit pass exists to catch), and
      // #F8F8F8 highlighted background instead of the generic --accent
      // token. Also swapped `focus:` for `data-highlighted:` — Base UI's
      // own SelectItemDataAttributes only defines highlighted/selected/
      // disabled, not a real DOM-focus hook, so `focus:` here never matched
      // Figma's hover treatment via keyboard navigation.
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 py-4 pr-12 pl-4 text-p1-medium text-[var(--select-fg)] outline-hidden select-none data-highlighted:bg-[#F8F8F8] data-disabled:pointer-events-none data-disabled:text-[var(--select-label-fg)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-4 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}
