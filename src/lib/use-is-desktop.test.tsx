import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { useIsDesktop } from "./use-is-desktop"

function Probe({ onRender }: { onRender: (value: boolean) => void }) {
  const isDesktop = useIsDesktop()
  onRender(isDesktop)
  return <span>{isDesktop ? "desktop" : "mobile"}</span>
}

const originalMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

describe("useIsDesktop", () => {
  it("на десктопе уже ПЕРВЫЙ кадр десктопный — без мобильной вспышки", () => {
    mockMatchMedia(true)
    const seen: boolean[] = []
    render(<Probe onRender={(value) => seen.push(value)} />)
    expect(seen[0]).toBe(true)
    expect(seen).not.toContain(false)
    expect(screen.getByText("desktop")).toBeInTheDocument()
  })

  it("без matchMedia безопасно сообщает «не десктоп»", () => {
    // @ts-expect-error — окружение без matchMedia (старый jsdom, SSR-подобное)
    window.matchMedia = undefined
    render(<Probe onRender={() => {}} />)
    expect(screen.getByText("mobile")).toBeInTheDocument()
  })
})
