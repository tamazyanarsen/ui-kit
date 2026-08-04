import { ProgressBar } from "@/components/ui/progress-bar"
import type { ProgressBarStatus } from "@/components/ui/progress-bar"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const STEP_COUNTS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

const STATUSES: ProgressBarStatus[] = [
  "default",
  "success",
  "attention",
  "error",
  "information",
]

function ProgressBarDemo() {
  return (
    <AccordionItem value="progress-bar">
      <AccordionTrigger>Progress Bar</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Step — 2..10 шагов (текущий = 2)</RowLabel>
          <div className="flex flex-col gap-5">
            {STEP_COUNTS.map((total) => (
              <ProgressBar
                key={total}
                title={`Шаг 2 из ${total}`}
                label="Label"
                totalSteps={total}
                currentStep={2}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Timeline</RowLabel>
          <ProgressBar
            variant="timeline"
            title="Title"
            label="Label"
            value={60}
            subtitle="Value"
            description="Description"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Статусы — цвет Subtitle</RowLabel>
          <div className="flex flex-col gap-5">
            {STATUSES.map((status) => (
              <ProgressBar
                key={status}
                variant="timeline"
                title="Title"
                label="Label"
                value={60}
                subtitle="Value"
                description="Description"
                status={status}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Timeline — цвет шкалы по значению (0 / 30 / 70 / 100)</RowLabel>
          <div className="flex flex-col gap-5">
            <ProgressBar variant="timeline" title="Title" value={0} />
            <ProgressBar variant="timeline" title="Title" value={30} />
            <ProgressBar variant="timeline" title="Title" value={70} />
            <ProgressBar variant="timeline" title="Title" value={100} />
          </div>
        </div>

        <p className="mt-4 text-p3 text-muted-foreground">
          <code>variant="step"</code> делит шкалу на <code>totalSteps</code>{" "}
          (2–10) равных сегментов: пройденные — заливка, текущий —
          диагональная штриховка (пользователь никогда не увидит шкалу
          полностью залитой — текущий шаг всегда заштрихован), оставшиеся —
          плоский трек. <code>variant="timeline"</code> — непрерывная шкала
          от <code>value</code> (0–100); цвет заливки по умолчанию считается
          автоматически (0–50 зелёный, 50–99 жёлтый/оранжевый, 100 красный),
          но можно задать явно через <code>color</code>. <code>status</code>{" "}
          красит только текст Subtitle и не связан с цветом самой шкалы.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ProgressBarDemo }
