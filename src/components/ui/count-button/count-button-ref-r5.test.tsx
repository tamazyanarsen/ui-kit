import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Popover } from "@base-ui/react/popover"

import { CountButton } from "./count-button"

// Итоговая проверка №4: CountButton был обычной функцией, и на React 18 ref
// до кнопки не доходил. Подставленный триггером меню или поповера
// (`render={<CountButton/>}`), он оставлял Base UI без якоря: попап
// «открывался» (aria-expanded=true), но так и висел невидимым — opacity 0.

describe("CountButton: ref доходит до кнопки", () => {
  it("ref потребителя указывает на саму кнопку", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <CountButton ref={ref} count={2}>
        Фильтры
      </CountButton>
    )
    expect(ref.current).toBe(screen.getByRole("button", { name: /Фильтры/ }))
  })

  it("триггером поповера — попап получает якорь и не остаётся невидимым", async () => {
    const user = userEvent.setup()
    render(
      <Popover.Root>
        <Popover.Trigger render={<CountButton count={2}>Фильтры</CountButton>} />
        <Popover.Portal>
          <Popover.Positioner data-testid="positioner" sideOffset={8}>
            <Popover.Popup>Содержимое</Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    )
    await user.click(screen.getByRole("button", { name: /Фильтры/ }))
    const positioner = await screen.findByTestId("positioner")
    expect(positioner.style.opacity).not.toBe("0")
  })
})
