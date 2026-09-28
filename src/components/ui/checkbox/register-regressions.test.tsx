import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"
import { Toggle } from "@/components/ui/toggle/toggle"

import { Checkbox } from "./checkbox"

/**
 * Упрощённый `register()` react-hook-form с теми же допущениями, на которых
 * держится настоящий: поле находится по `event.target.name`, значение
 * читается из узла, отданного в `ref` (`checked` у флажка, `value`
 * отмеченной радиокнопки), фокус на ошибке — `ref.focus()`.
 */
function createForm() {
  const refs = new Map<string, HTMLInputElement[]>()
  const values: Record<string, unknown> = {}
  const touched = new Set<string>()

  function read(name: string) {
    const nodes = refs.get(name) ?? []
    const first = nodes[0]
    if (first?.type === "radio") return nodes.find((n) => n.checked)?.value
    if (first?.type === "checkbox") return first.checked
    return first?.value
  }

  function register(name: string) {
    return {
      name,
      ref(node: HTMLInputElement | null) {
        if (!node) return
        const nodes = refs.get(name) ?? []
        if (!nodes.includes(node)) refs.set(name, [...nodes, node])
      },
      // Как `ChangeHandler` у react-hook-form: `target` любого вида.
      onChange(event: { target: unknown }) {
        const field = (event.target as HTMLInputElement).name
        if (refs.has(field)) values[field] = read(field)
      },
      onBlur(event: { target: unknown }) {
        const field = (event.target as HTMLInputElement).name
        if (refs.has(field)) touched.add(field)
      },
    }
  }

  return { register, values, touched, refs }
}

describe("Checkbox / Toggle / Radio with register()", () => {
  it("reports checkbox and toggle values and touched state", async () => {
    const user = userEvent.setup()
    const form = createForm()
    render(
      <>
        <Checkbox label="Согласен" {...form.register("agree")} />
        <Toggle label="Уведомления" {...form.register("notify")} />
      </>
    )

    await user.click(screen.getByRole("checkbox", { name: "Согласен" }))
    await user.click(screen.getByRole("switch", { name: "Уведомления" }))
    await user.tab()

    expect(form.values).toEqual({ agree: true, notify: true })
    expect(form.touched.has("agree")).toBe(true)
    expect(form.touched.has("notify")).toBe(true)
  })

  it("reports the checked radio value when the group has no name", async () => {
    const user = userEvent.setup()
    const form = createForm()
    render(
      <RadioGroup>
        <Radio value="a" label="Первый" {...form.register("plan")} />
        <Radio value="b" label="Второй" {...form.register("plan")} />
      </RadioGroup>
    )

    await user.click(screen.getByRole("radio", { name: "Второй" }))

    expect(form.values.plan).toBe("b")
  })

  it("focuses the control through the registered ref", () => {
    const form = createForm()
    render(<Checkbox label="Согласен" {...form.register("agree")} />)

    form.refs.get("agree")![0].focus()

    expect(screen.getByRole("checkbox", { name: "Согласен" })).toHaveFocus()
  })
})
