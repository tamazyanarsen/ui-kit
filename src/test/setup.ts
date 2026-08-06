import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// jsdom implements neither of these, but the kit targets real browsers and
// several components depend on them (ModalBody and Input observe their own
// box with ResizeObserver; Input gates its desktop-only overflow Tooltip on
// a media query). Stub them here rather than defensively branching in every
// component. Both stubs are inert: nothing resizes in jsdom, and the media
// query always reports "no match" so tests see the mobile form.
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
})
