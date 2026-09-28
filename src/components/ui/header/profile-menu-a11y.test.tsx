import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ORG_MANY } from "@/test/header-fixtures"

import { ProfileMenu } from "./profile-menu"

// Третий раунд аудита: выбранная организация объявляется скринридеру, а не
// только галочкой под `aria-hidden`.

describe("ProfileMenu: выбор организации", () => {
  it("строки — menuitemradio, выбранная отмечена aria-checked", async () => {
    const user = userEvent.setup()
    render(<ProfileMenu organizations={ORG_MANY} value="3" />)
    await user.click(screen.getByRole("button", { name: /Чекап/ }))

    const rows = await screen.findAllByRole("menuitemradio")
    expect(rows).toHaveLength(ORG_MANY.length)
    const checked = rows.filter((row) => row.getAttribute("aria-checked") === "true")
    expect(checked).toHaveLength(1)
    expect(checked[0]).toHaveTextContent("ООО «Чекап»")
  })

  it("выбор другой организации зовёт onValueChange и закрывает меню", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<ProfileMenu organizations={ORG_MANY} value="1" onValueChange={onValueChange} />)
    await user.click(screen.getByRole("button", { name: /ИП Константинопольский/ }))
    await user.click(await screen.findByRole("menuitemradio", { name: /Северострой/ }))

    expect(onValueChange).toHaveBeenCalledWith("2")
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
  })
})
