import * as React from "react"

import { Steps } from "@/components/ui/steps"
import type { Step } from "@/components/ui/steps"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const TOTAL_ROW_STEPS = 5

function StepsDemo() {
  const [current, setCurrent] = React.useState(1)

  const rowSteps: Step[] = Array.from({ length: TOTAL_ROW_STEPS }, (_, i) => {
    const stepNumber = i + 1
    if (stepNumber < current) {
      return {
        title: `Step ${stepNumber}`,
        description: "Description",
        statusText: "Заполнено",
        status: "filled",
        onClick: () => setCurrent(stepNumber),
      }
    }
    if (stepNumber === current) {
      return {
        title: `Step ${stepNumber}`,
        description: "Description",
        statusText: "Не заполнено",
        state: "active",
      }
    }
    return {
      title: `Step ${stepNumber}`,
      description: "Description",
      statusText: "Не заполнено",
      state: "disabled",
      disabledHint: "Сначала нужно заполнить предыдущие шаги",
    }
  })

  return (
    <AccordionItem value="steps">
      <AccordionTrigger>Steps</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Состояния — Default / Active / Disabled</RowLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Steps
              steps={[
                { title: "Step N", description: "Description", statusText: "Не заполнено" },
              ]}
            />
            <Steps
              steps={[
                {
                  title: "Step N",
                  description: "Description",
                  statusText: "Не заполнено",
                  state: "active",
                },
              ]}
            />
            <Steps
              steps={[
                {
                  title: "Step N",
                  description: "Description",
                  statusText: "Не заполнено",
                  state: "disabled",
                  disabledHint: "Сначала нужно заполнить предыдущие шаги",
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Steps Status — None / Filled / Error</RowLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Steps
              steps={[
                { title: "Step N", description: "Description", statusText: "Не заполнено" },
              ]}
            />
            <Steps
              steps={[
                {
                  title: "Step N",
                  description: "Description",
                  statusText: "Заполнено",
                  status: "filled",
                },
              ]}
            />
            <Steps
              steps={[
                {
                  title: "Step N",
                  description: "Description",
                  statusText: "Ошибки",
                  status: "error",
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Ряд шагов + навигация по краям (рабочий пример — жмите «Далее» /
            «Назад» или кликайте по заполненным шагам)
          </RowLabel>
          <Steps
            steps={rowSteps}
            showLeftFade
            showRightFade
            onClickLeft={() => setCurrent((c) => Math.max(1, c - 1))}
            onClickRight={() =>
              setCurrent((c) => Math.min(TOTAL_ROW_STEPS, c + 1))
            }
          />
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Пример выше держит состояние сам (текущий шаг), только чтобы
          показать переход живьём — в реальном коде это делает вызывающая
          сторона: <code>onClickLeft</code>/<code>onClickRight</code> и клик
          по шагу — просто callbacks, компонент не хранит какого-либо
          состояния пагинации сам. Заблокированный шаг показывает подсказку
          при наведении и курсор <code>not-allowed</code>.{" "}
          <code>status</code> красит Status-текст только для{" "}
          <code>error</code> (красный) — <code>none</code> и{" "}
          <code>filled</code> используют один и тот же приглушённый серый,
          как в спеке. <code>Description</code> — одна строка.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { StepsDemo }
