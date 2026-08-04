import { useState } from "react"

import { MailFeed } from "@/components/ui/mail-feed"
import type { MailFeedState } from "@/components/ui/mail-feed"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const ROW_PROPS = {
  id: "159638",
  sender: "ООО «Родники и речки России»",
  date: "24.12.2022, 09:32",
  subject: "Ошибки в данных",
  message: "У меня сломалось отображение зарплатного проекта",
  preview:
    "Ответ банка: Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности позволяет выполнять важные задания по разработке системы обучения кадров.",
}

const STATES: { state: MailFeedState; label: string }[] = [
  { state: "default", label: "Default — прочитано" },
  { state: "new", label: "New — новое письмо" },
  { state: "used", label: "Used — обработано" },
  { state: "error", label: "Error — ошибка" },
]

function MailFeedDemo() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  return (
    <AccordionItem value="mail-feed">
      <AccordionTrigger>Mail — строка письма</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Статусы</RowLabel>
          <div className="grid max-w-[492px] grid-cols-1 gap-3">
            {STATES.map(({ state, label }) => (
              <div key={state} className="flex flex-col gap-1">
                <MailFeed {...ROW_PROPS} state={state} onClick={() => {}} />
                <span className="text-p3-regular text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>С чекбоксом для массового выбора</RowLabel>
          <div className="max-w-[492px]">
            <MailFeed
              {...ROW_PROPS}
              showCheckbox
              checked={checked.a ?? false}
              onCheckedChange={(v) => setChecked((s) => ({ ...s, a: v }))}
            />
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Статус письма (Default/New/Used/Error) и чекбокс массового выбора —
          независимые оси: чекбокс может быть показан при любом статусе.
          Тема — одна строка с многоточием; сообщение — 1 строка + строка
          превью ответа банка, тоже с многоточием.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { MailFeedDemo }
