import { StatusScreen } from "@/components/ui/status-screen"
import type { StatusType } from "@/components/ui/status-screen"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const STATUSES: { status: StatusType; label: string }[] = [
  { status: "success", label: "Success" },
  { status: "error", label: "Error" },
  { status: "attention", label: "Attention" },
  { status: "question", label: "Question" },
  { status: "search", label: "Search" },
  { status: "check", label: "Check" },
  { status: "lock", label: "Lock" },
  { status: "edit", label: "Edit" },
  { status: "search-attention", label: "Search (Attention)" },
  { status: "time-attention", label: "Time (Attention)" },
]

function StatusScreenDemo() {
  return (
    <AccordionItem value="status-screen">
      <AccordionTrigger>Status Screen</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RowLabel>Two Buttons — полный набор</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <StatusScreen
                status="success"
                title="Операция выполнена"
                subtitle="Перевод успешно отправлен получателю"
                primaryLabel="Готово"
                secondaryLabel="К списку операций"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Primary only</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <StatusScreen
                status="error"
                title="Не удалось выполнить операцию"
                subtitle="Попробуйте повторить позже"
                primaryLabel="Повторить"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Secondary only</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <StatusScreen
                status="attention"
                title="Требуется подтверждение"
                subtitle="Подтвердите операцию в приложении банка"
                secondaryLabel="Отмена"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Без Subtitle и без кнопок</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <StatusScreen status="search" title="Ничего не найдено" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Варианты — Статусы (10)</RowLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STATUSES.map(({ status, label }) => (
                <div key={status} className="rounded-lg border border-[#DEDEDE]">
                  <StatusScreen status={status} title={label} primaryLabel="Button" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Иллюстрация в спеке — 3D-маскот, свой для каждого статуса. Здесь,
          как и в Error Page/NPS ранее, вместо копии сложной графики —
          плоская цветная бейдж-иконка. Тип панели кнопок (Two Buttons/
          Primary/Secondary/без кнопок) выводится из того, какие label-пропсы
          переданы, а не из отдельного enum.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { StatusScreenDemo }
