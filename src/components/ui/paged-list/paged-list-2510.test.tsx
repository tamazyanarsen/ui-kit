import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { PagedList } from "./paged-list"

// Правки UI-Kit от 25.10, пункт «Постраничный список и точки карусели».
// В jsdom `useIsDesktop()` видит мобильный вид — по умолчанию лента страниц.

const rows = (n: number) =>
  Array.from({ length: n }, (_, i) => <div key={i} data-testid="row">Строка {i + 1}</div>)

describe("PagedList", () => {
  it("мобильный вид: страницы по N строк, точки по числу страниц", () => {
    const { container } = render(<PagedList pageSize={4}>{rows(7)}</PagedList>)
    const pages = container.querySelectorAll('[data-slot="paged-list-page"]')
    expect(pages).toHaveLength(2)
    expect(pages[0].children).toHaveLength(4)
    expect(pages[1].children).toHaveLength(3)
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("лента: scroll-snap x mandatory, stop always, без полосы прокрутки", () => {
    const { container } = render(<PagedList pageSize={3}>{rows(5)}</PagedList>)
    const track = container.querySelector('[data-slot="paged-list-track"]') as HTMLElement
    expect(track.className).toContain("snap-x")
    expect(track.className).toContain("snap-mandatory")
    expect(track.className).toContain("[scrollbar-width:none]")
    const page = container.querySelector('[data-slot="paged-list-page"]') as HTMLElement
    expect(page.className).toContain("snap-start")
    expect(page.className).toContain("[scroll-snap-stop:always]")
  })

  it("точки: от списка 12, до низа 16", () => {
    render(<PagedList pageSize={2}>{rows(3)}</PagedList>)
    const dots = screen.getByRole("group", { name: "Страницы" })
    expect(dots.className).toContain("mt-3")
    expect(dots.className).toContain("mb-4")
  })

  it("одна страница — ни ленты, ни точек", () => {
    const { container } = render(<PagedList pageSize={4}>{rows(3)}</PagedList>)
    expect(container.querySelector('[data-slot="paged-list-track"]')).toBeNull()
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("paged={false} (десктоп) — обычный список", () => {
    const { container } = render(
      <PagedList pageSize={2} paged={false}>
        {rows(5)}
      </PagedList>
    )
    expect(container.querySelector('[data-slot="paged-list"]')).toHaveAttribute("data-paged", "false")
    expect(screen.getAllByTestId("row")).toHaveLength(5)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("нажатие на точку листает к своей странице и делает её текущей", () => {
    const { container } = render(<PagedList pageSize={2}>{rows(5)}</PagedList>)
    const track = container.querySelector('[data-slot="paged-list-track"]') as HTMLElement
    Object.defineProperty(track, "clientWidth", { value: 300, configurable: true })
    const scrollTo = vi.fn()
    track.scrollTo = scrollTo as unknown as typeof track.scrollTo
    fireEvent.click(screen.getAllByRole("button")[2])
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: 600 }))
    expect(screen.getAllByRole("button")[2]).toHaveAttribute("aria-current", "true")
  })

  it("прокрутка ленты меняет текущую точку", () => {
    const { container } = render(<PagedList pageSize={2}>{rows(4)}</PagedList>)
    const track = container.querySelector('[data-slot="paged-list-track"]') as HTMLElement
    Object.defineProperty(track, "clientWidth", { value: 300, configurable: true })
    track.scrollLeft = 300
    fireEvent.scroll(track)
    expect(screen.getAllByRole("button")[1]).toHaveAttribute("aria-current", "true")
  })
})

describe("PagedList: дети во фрагменте", () => {
  it("строки, обёрнутые в <>…</>, раскладываются по страницам", () => {
    const { container } = render(
      <PagedList paged pageSize={2}>
        <>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </>
      </PagedList>
    )
    expect(container.querySelectorAll('[data-slot="paged-list-page"]').length).toBe(2)
  })
})
