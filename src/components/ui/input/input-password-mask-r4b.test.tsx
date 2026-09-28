import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Аудит r4: маскированное поле стало получать исходный `type`, а переключение
// «глазом» между password и text было только у поля без маски — маскированный
// пароль оставался скрытым при нажатой кнопке.

describe("Input с маской и type=password", () => {
  it("«Показать пароль» переключает тип маскированного поля", async () => {
    const user = userEvent.setup()
    render(<Input mask="passport" type="password" label="Паспорт" />)
    const field = screen.getByLabelText("Паспорт") as HTMLInputElement
    expect(field.type).toBe("password")

    await user.click(screen.getByRole("button", { name: "Показать пароль" }))
    expect(field.type).toBe("text")

    await user.click(screen.getByRole("button", { name: "Скрыть пароль" }))
    expect(field.type).toBe("password")
  })
})
