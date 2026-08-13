import * as React from "react"

// Match highlighting for Autocomplete results.
//
// NOTE ON THE COLOUR: this file's Figma canvas has no spec for highlighting
// the matched substring — searched the design system for it and checked the
// result-row node the rest of this component was built from (29750:54209),
// and neither defines a "match" treatment. So rather than invent a colour,
// the mark reuses the kit's existing primary accent (`--btn-primary-bg`,
// #80E3FF) behind the standard dark text, exposed as its own token so a
// designer can retune it in one place once the spec lands.
//
// Matching is case-insensitive and marks every occurrence, and the query is
// escaped before it reaches the regexp — a user typing "(" into the field
// must not throw.

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Splits `text` on every case-insensitive occurrence of `query` and wraps the
 * matches in a `<mark>`. Returns the text unchanged when there is nothing to
 * highlight, so callers can pass it through unconditionally.
 */
function highlightMatch(
  text: React.ReactNode,
  query: string | undefined
): React.ReactNode {
  if (typeof text !== "string" || !query) return text
  const trimmed = query.trim()
  if (!trimmed) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"))
  if (parts.length === 1) return text

  return parts.map((part, index) =>
    // Odd indices are the capture groups, i.e. the matches themselves.
    index % 2 === 1 ? (
      <mark
        key={index}
        data-slot="autocomplete-match"
        className="rounded-[2px] bg-[var(--autocomplete-match-bg)] text-[color:inherit]"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  )
}

export { highlightMatch }
