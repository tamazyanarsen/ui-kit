import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TitleInformationText } from "./information-text"

// Добор покрытия: регрессии проверяли у TitleInformationText только
// клавиатуру, а `forwardRef`, добавленный тем же исправлением, — нет. На
// React 18 обычная функция теряла ref потребителя молча.
describe("TitleInformationText: добор покрытия", () => {
  it("ref доходит до корня", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <TitleInformationText ref={ref} href="/help">
        Подробнее
      </TitleInformationText>
    )
    expect(ref.current).toBe(container.querySelector('[data-slot="title-information-text"]'))
  })
})
