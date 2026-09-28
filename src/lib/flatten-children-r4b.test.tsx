import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu/root"
import { ListOfErrors } from "@/components/ui/list-of-errors/list-of-errors"

import { flattenChildren } from "./flatten-children"

// Аудит r4: повторный `toArray` внутри фрагмента выдавал ключи с нуля —
// `[<><b/><i/></>, <u/>]` давал `.0, .1, .1`, вложенные фрагменты — `.0, .0`.
// React путал строки: после исчезновения фрагмента оставался устаревший
// элемент.

const keysOf = (nodes: React.ReactNode[]) =>
  nodes.map((node) => (React.isValidElement(node) ? node.key : null))

describe("flattenChildren: уникальные ключи", () => {
  afterEach(() => vi.restoreAllMocks())

  it("фрагмент рядом с элементом", () => {
    // Дети JSX без явных ключей — как их пишет потребитель.
    const keys = keysOf(
      flattenChildren(
        <>
          <>
            <b />
            <i />
          </>
          <u />
        </>
      )
    )
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("вложенные фрагменты", () => {
    const keys = keysOf(
      flattenChildren(
        <>
          <>
            <b />
          </>
          <>
            <i />
          </>
        </>
      )
    )
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("ListOfErrors: после исчезновения фрагмента остаётся только C", () => {
    const view = (has: boolean) => (
      <ListOfErrors>
        {has && (
          <>
            <p>A</p>
            <p>B</p>
          </>
        )}
        <p>C</p>
      </ListOfErrors>
    )
    const { rerender, container } = render(view(false))
    rerender(view(true))
    rerender(view(false))
    const rows = Array.from(
      container.querySelectorAll('[data-slot="list-of-errors-item"]')
    ).map((li) => li.textContent)
    expect(rows).toEqual(["C"])
  })

  it("ButtonMenu: после исчезновения фрагмента остаётся только C, без предупреждения о ключах", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const view = (has: boolean) => (
      <ButtonMenu>
        {has && (
          <>
            <Button>A</Button>
            <Button>B</Button>
          </>
        )}
        <Button>C</Button>
      </ButtonMenu>
    )
    const { rerender } = render(view(false))
    rerender(view(true))
    rerender(view(false))
    const visible = screen
      .getAllByRole("button")
      .filter((button) => !button.closest('[aria-hidden="true"]'))
      .map((button) => button.textContent?.trim())
      .filter((text) => text && text !== "")
    expect(visible).toEqual(["C"])
    const keyWarnings = error.mock.calls.filter((call) =>
      String(call[0]).includes("same key")
    )
    expect(keyWarnings).toHaveLength(0)
  })
})
