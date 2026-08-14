import { useToast } from "@/components/ui/toast-message"
import type { ToastType } from "@/components/ui/toast-message"
import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const TYPES: { type: ToastType; label: string }[] = [
  { type: "checked", label: "Checked" },
  { type: "attention", label: "Attention" },
  { type: "error", label: "Error" },
  { type: "information", label: "Information" },
]

function ToastTriggerButtons() {
  const toast = useToast()

  return (
    <div className="flex flex-wrap gap-3">
      {TYPES.map(({ type, label }) => (
        <Button
          key={type}
          type="button"
          variant="secondary-outline"
          size="sm"
          onClick={() =>
            toast.add({
              type,
              title: "Title",
              description: "Description",
              data: {
                primaryButtonLabel: "Button",
                secondaryButtonLabel: "Button",
              },
            })
          }
        >
          {label}
        </Button>
      ))}
      <Button
        type="button"
        variant="secondary-outline"
        size="sm"
        onClick={() =>
          toast.add({ type: "checked", title: "Title без description и кнопок" })
        }
      >
        Минимальный (только Title)
      </Button>
    </div>
  )
}

function ToastMessageDemo() {
  return (
    <AccordionItem value="toast-message">
      <AccordionTrigger>Toast Message</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Нажмите — тост появится в правом верхнем углу и исчезнет через 8
            сек
          </RowLabel>
          <ToastTriggerButtons />
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          4 типа (Checked / Attention / Error / Information) — цвет фона и
          иконки берутся из <code>type</code>, переданного в{" "}
          <code>toast.add()</code>. Description и кнопки (Type (Button):
          Two Buttons / Black Button / White Button) опциональны — задаются
          через <code>description</code> и <code>data</code> в{" "}
          <code>toast.add()</code>; без них остаётся минимальная форма
          (иконка + Title + крестик). Автозакрытие — 8000мс (
          <code>ToastProvider timeout</code>), до 3 одновременно видимых
          (<code>limit</code>). На мобильном вьюпорт переезжает к верхнему
          краю с отступом 16px по бокам.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ToastMessageDemo }
