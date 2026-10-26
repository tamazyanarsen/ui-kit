import { act, render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageScrollbar } from "./page-scrollbar"

// Полоса страницы одна на страницу: оболочка и экран (или Storybook и
// история) могут смонтировать PageScrollbar оба — у окна не должно стоять
// двух полос. Когда рисующий экземпляр уходит, его место занимает следующий.
const bars = () => document.querySelectorAll('[data-slot="page-scrollbar"]').length

describe("PageScrollbar: один на страницу", () => {
  it("два экземпляра рисуют одну полосу, после ухода первого полоса остаётся", async () => {
    const first = render(<PageScrollbar areas={false} />)
    const second = render(<PageScrollbar areas={false} />)
    await act(async () => {})
    expect(bars()).toBe(1)
    first.unmount()
    await act(async () => {})
    expect(bars()).toBe(1)
    second.unmount()
    await act(async () => {})
    expect(bars()).toBe(0)
  })
})
