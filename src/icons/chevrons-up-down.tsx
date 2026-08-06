import type { IconProps } from "./types"

interface ChevronsUpDownProps extends IconProps {
  /** Which chevron is highlighted — Figma's `table-sort` states. `"none"`
   * (Default) leaves both chevrons muted; `"asc"`/`"desc"` darken the up/down
   * one respectively, which is how a sorted column is marked. */
  sort?: "none" | "asc" | "desc"
}

// The two chevrons are two-tone by design (muted grey + dark) rather than a
// single currentColor shape — #999999 is this kit's established muted-grey
// token (same value as --select-label-fg / --filter-subtitle-fg etc.), kept
// literal here; the highlighted chevron inherits currentColor instead, so it
// picks up whatever the surrounding control's active text color is.
export function ChevronsUpDown({ size: _size, sort = "none", ...props }: ChevronsUpDownProps) {
  const muted = "#999999"
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.99991 15.5C8.2717 15.5 8.53207 15.3891 8.72061 15.1934L12.4052 11.3672C12.788 10.9694 12.7756 10.3361 12.3778 9.95312C11.98 9.57048 11.3477 9.58286 10.9648 9.98047L8.00088 13.0586L5.04288 9.98047C4.66011 9.58261 4.02687 9.57049 3.62881 9.95312C3.23094 10.3359 3.21883 10.9691 3.60147 11.3672L7.2792 15.1934L7.35342 15.2627C7.53311 15.415 7.76214 15.4999 7.99991 15.5Z"
        fill={sort === "desc" ? "currentColor" : muted}
      />
      <path
        d="M11.0128 6.00596C11.3992 6.40049 12.0323 6.40787 12.4269 6.02159C12.8215 5.63531 12.8277 5.0022 12.4416 4.60752L8.71499 0.800882C8.52515 0.606967 8.26467 0.498175 7.99331 0.500101C7.72213 0.502085 7.46351 0.61425 7.27651 0.810648L3.65444 4.61729C3.27374 5.01739 3.2895 5.65065 3.6896 6.03135C4.0896 6.41165 4.72204 6.39585 5.10268 5.99619L8.01089 2.94053L11.0128 6.00596Z"
        fill={sort === "asc" ? "currentColor" : muted}
      />
    </svg>
  )
}
