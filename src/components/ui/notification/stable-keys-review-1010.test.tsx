import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NotificationPanel } from "@/components/ui/notification"
import { SelectionButton } from "@/components/ui/selection-button"
import { Steps } from "@/components/ui/steps"

// Ревью 10.10, КК-5: элементы списков шли с ключом-индексом. При вставке
// или перестановке React отдавал элементу чужой узел вместе с его
// состоянием. Теперь у элемента есть необязательный устойчивый `id`.

describe("Устойчивые ключи элементов списка (ревью 10.10, КК-5)", () => {
  it("NotificationPanel: узел уведомления едет вместе с ним", () => {
    const a = { id: "a", title: "Платёж исполнен" }
    const b = { id: "b", title: "Новое письмо" }
    const { rerender } = render(<NotificationPanel items={[a, b]} />)
    const node = screen.getByText("Платёж исполнен").closest('[data-slot="notification-item"]')
    rerender(<NotificationPanel items={[b, a]} />)
    expect(screen.getByText("Платёж исполнен").closest('[data-slot="notification-item"]')).toBe(node)
  })

  it("Steps: узел шага едет вместе с ним", () => {
    const one = { id: "one", title: "Шаг 1", description: "Заявка" }
    const two = { id: "two", title: "Шаг 2", description: "Документы" }
    const { rerender } = render(<Steps steps={[one, two]} />)
    const node = screen.getByText("Заявка").closest('[data-slot="steps-strip"] > *')
    rerender(<Steps steps={[two, one]} />)
    expect(screen.getByText("Заявка").closest('[data-slot="steps-strip"] > *')).toBe(node)
  })

  it("SelectionButton: узел пункта едет вместе с ним", async () => {
    const user = userEvent.setup()
    const copy = { id: "copy", text: "Копировать" }
    const remove = { id: "remove", text: "Удалить" }
    const { rerender } = render(<SelectionButton items={[copy, remove]} />)
    await user.click(screen.getByRole("button"))
    const node = await screen.findByRole("menuitem", { name: "Копировать" })
    rerender(<SelectionButton items={[remove, copy]} />)
    expect(screen.getByRole("menuitem", { name: "Копировать" })).toBe(node)
  })
})
