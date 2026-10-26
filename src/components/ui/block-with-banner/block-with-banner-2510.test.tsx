import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { BlockWithBanner } from "./block-with-banner"

// Правки UI-Kit от 25.10, пункт «Инлайн-баннер под блоком».

describe("BlockWithBanner", () => {
  it("без баннера — нет подложки", () => {
    const { container } = render(<BlockWithBanner>Блок</BlockWithBanner>)
    const root = container.firstChild as HTMLElement
    expect(root).not.toHaveAttribute("data-banner")
    expect(root.className).not.toContain("--block-with-banner-bg")
    expect(container.querySelector('[data-slot="block-with-banner-banner"]')).toBeNull()
  })

  it("с баннером — подложка Blue 114 с тем же скруглением и обрезкой", () => {
    const { container } = render(
      <BlockWithBanner banner="Подключите НСО" actionLabel="Подключить">
        Блок
      </BlockWithBanner>
    )
    const root = container.firstChild as HTMLElement
    const block = container.querySelector('[data-slot="block-with-banner-block"]') as HTMLElement
    expect(root.className).toContain("bg-[var(--block-with-banner-bg)]")
    expect(root.className).toContain("overflow-hidden")
    for (const cls of ["rounded-[16px]", "desktop:rounded-[24px]"]) {
      expect(root.className).toContain(cls)
      expect(block.className).toContain(cls)
    }
    expect(screen.getByRole("button", { name: "Подключить" })).toBeInTheDocument()
  })

  it("заход под блок и поля: 16 в мобильном, 32 на десктопе; кнопка под текстом через 8", () => {
    const { container } = render(<BlockWithBanner banner="Текст" actionLabel="Ок" />)
    const banner = container.querySelector('[data-slot="block-with-banner-banner"]') as HTMLElement
    for (const cls of ["-mt-4", "pt-8", "px-4", "pb-4", "flex-col", "gap-2", "desktop:-mt-8", "desktop:pt-16", "desktop:px-8", "desktop:pb-8", "desktop:flex-row"]) {
      expect(banner.className).toContain(cls)
    }
  })

  it("переход наружу — ссылка в новой вкладке со значком справа", () => {
    render(
      <BlockWithBanner banner="Текст" actionLabel="Подробнее" href="https://example.com" external />
    )
    const link = screen.getByRole("link", { name: "Подробнее" })
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link.querySelector('[data-icon="inline-end"]')).not.toBeNull()
  })
})
