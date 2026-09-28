import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { ItemInformationField } from "./item-information-field"
import { ItemInformationFieldGroup } from "./group"

// Итоговая проверка №4: копирование без ToastProvider роняло дерево, а в
// группе поля во фрагменте не раскрывались — у последнего оставался
// висящий разделитель.

describe("ItemInformationField: копирование без провайдера тостов", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("поле с copyable рисуется и копирует без ToastProvider", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } })
    render(<ItemInformationField label="ИНН" value="7712345678" copyable />)
    // fireEvent, а не userEvent: тот подменяет navigator.clipboard своей заглушкой.
    fireEvent.click(screen.getByRole("button", { name: "Копировать" }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("7712345678"))
  })
})

describe("ItemInformationFieldGroup: поля во фрагменте", () => {
  it("последнее поле во фрагменте теряет разделитель", () => {
    const { container } = render(
      <ItemInformationFieldGroup>
        <>
          <ItemInformationField label="А" value="1" divider />
          <ItemInformationField label="Б" value="2" divider />
        </>
      </ItemInformationFieldGroup>
    )
    const fields = container.querySelectorAll('[data-slot="item-information-field"]')
    expect(fields).toHaveLength(2)
    expect(fields[1]).not.toHaveAttribute("data-divider", "on")
  })
})
