// Canonical "Dropdown" popup surface (Figma: ELK Select/Dropdown, node 666:11).
// Button Menu's overflow trigger and Selection Button both point back to this
// component in the spec ("настройки списка — в разделе Select, Dropdown"), so
// they render Menu-based popups that must still share these exact tokens
// instead of re-deriving their own (which had drifted to a generic
// shadow-lg + ring, not the spec's literal shadow).
export const DROPDOWN_POPUP_CLASS =
  "rounded-[16px] bg-popover text-popover-foreground shadow-[0_4px_12px_rgba(139,153,169,0.24)] outline-none origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

// Item variant with an optional secondary description line (used by the
// action-list popups above; Select's own SelectItem has no description slot).
export const DROPDOWN_ACTION_ITEM_CLASS =
  "flex cursor-default flex-col gap-0.5 rounded-xl px-3 py-2.5 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-[#F4F4F4]"
