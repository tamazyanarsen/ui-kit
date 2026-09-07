import { Chips, type ChipsType } from "@/components/ui/chips"

// Нажимаемая пилюля отбора.
//
// `Chips` в ките — намеренно НЕнажимаемый элемент: «a plain, non-interactive
// pill for a value», у него нет `onClick`, и состояние `State=Active` он
// только показывает. Поведение отбора живёт у `Filter` — но `Filter` это
// пилюля с ПОПОВЕРОМ и полем ввода, а на витрине продуктов (D3) пилюля
// переключает набор сразу, без попапа.
//
// Поэтому обработчик добавляется снаружи, обёрткой: `Chips` рисует `<span>`,
// вложить его в `<button>` — валидная разметка, а `aria-pressed` объясняет
// вспомогательным технологиям, что это переключатель, а не ссылка.
// Переписывать сам `Chips` под это незачем: его невзаимодействие —
// осознанное свойство компонента, а не упущение.

interface SandboxChipsToggleProps {
  children: React.ReactNode
  selected: boolean
  onSelect: () => void
  type?: ChipsType
  disabled?: boolean
}

function SandboxChipsToggle({
  children,
  selected,
  onSelect,
  type = "filter-grey",
  disabled = false,
}: SandboxChipsToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className="cursor-pointer rounded-md outline-none focus-visible:focus-ring disabled:cursor-default"
    >
      <Chips type={type} selected={selected} disabled={disabled}>
        {children}
      </Chips>
    </button>
  )
}

export { SandboxChipsToggle }
export type { SandboxChipsToggleProps }
