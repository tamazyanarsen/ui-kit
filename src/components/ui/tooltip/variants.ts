// Shared 8-direction placement system for both Tooltip and Hint (they're
// one Figma spec, "Tooltip & Hint", and share the same speech-bubble
// language). The spec names directions by which way the bubble *expands*
// from its anchor corner — e.g. "Top Center" points its arrow up (anchor
// above, bubble below), which is Floating UI's side="bottom"; "Down
// Center" is the reverse (side="top"). "Left"/"Right" only ever center
// vertically — there's no Left-Top/Left-Bottom in the spec's property list.
export type TooltipDirection =
  | "left"
  | "right"
  | "top-center"
  | "top-left"
  | "top-right"
  | "down-center"
  | "down-left"
  | "down-right"

export const DIRECTION_PLACEMENT: Record<
  TooltipDirection,
  { side: "top" | "bottom" | "left" | "right"; align: "start" | "center" | "end" }
> = {
  left: { side: "right", align: "center" },
  right: { side: "left", align: "center" },
  "top-center": { side: "bottom", align: "center" },
  "top-left": { side: "bottom", align: "start" },
  "top-right": { side: "bottom", align: "end" },
  "down-center": { side: "top", align: "center" },
  "down-left": { side: "top", align: "start" },
  "down-right": { side: "top", align: "end" },
}
