import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Informer } from "./informer"

// Аудит r26: `customIcon={cond ? "имя" : null}` (и `false` от `cond && …`)
// уходил в ветку «готовый узел» и рисовал пустой слот 24px вместо штатного
// значка статуса — выбор шёл только по `undefined`.
describe("Informer: пустой customIcon", () => {
  it.each([null, false, ""])("%s — штатный значок статуса", (empty) => {
    const { container } = render(
      <Informer title="Заг" icon="attention-red" customIcon={empty as never} />
    )
    const root = container.querySelector("[data-slot=informer]")!
    expect(root.querySelector("svg")).not.toBeNull()
    expect(root.querySelector("span.size-6")).toBeNull()
  })
})
