import * as React from "react"

import { cn } from "@/lib/utils"
import { pressHandlers } from "@/lib/press"
import type { PaymentSystem } from "@/components/ui/thumbnail"
import { useToastOptional } from "@/components/ui/toast-message"

import { CardBack, CardFace, type BankCardSize } from "./faces"
import type { BankCardSkin } from "./variants"

// BankCard — «ELK / cards»: полный внешний вид банковской карты (не путать
// с посторонним компонентом `Card`, который рисует строку счёта). Нажатие на
// лицевую сторону переворачивает карту на обратную (спецификация: «по
// нажатию на иконку eye раскрывается номер карты или CVC/CVV-код.
// Одновременно оба значения в полях не могут быть открытыми»), а раскрытие
// любого из значений одновременно копирует его и показывает тост
// (спецификация: «Одновременно с раскрытием должно происходить
// копирование»).
//
// Дизайн-чек №16: артворк каждой карты — настоящий векторный ассет из
// Figma (см. ./variants.ts). Прежний комментарий здесь утверждал, что
// «извлекаемых данных о цвете нет, поэтому это CSS-приближения по
// скриншоту» — это и было причиной «принципиальных различий» с макетом:
// ассеты у Figma есть, слоем `Card Image` внутри каждого символа.
interface BankCardProps {
  skin?: BankCardSkin
  /** Свойство `Size` — Desktop (332×208) или Mobile (254×160). */
  size?: BankCardSize
  /**
   * Свойство `Type` — какой стороной лежит карта. Управляемый близнец
   * внутреннего переворота по клику: задан — сторона фиксирована снаружи,
   * не задан — картой управляет клик по ней.
   */
  type?: "face" | "back"
  /**
   * Попытка перевернуть карту (клик, «Показать реквизиты»). В управляемом
   * режиме (`type` задан) — единственный способ узнать о ней снаружи.
   */
  onTypeChange?: (type: "face" | "back") => void
  paymentSystem?: PaymentSystem
  last4?: string
  cardNumber?: string
  cvc?: string
  cardholderName?: string
  expiry?: string
  balance?: React.ReactNode
  showPaymentSystem?: boolean
  showCardNumber?: boolean
  showBalance?: boolean
  showRequisites?: boolean
  className?: string
}

function BankCard({
  skin = "mono",
  size = "desktop",
  type,
  onTypeChange,
  paymentSystem = "mir",
  last4 = "4498",
  cardNumber = "2200 1234 5678 4498",
  cvc = "123",
  cardholderName = "KONSTANTIN KONSTANTINOPOLSKY",
  expiry = "01/2025",
  balance = "1 200 101,16 ₽",
  showPaymentSystem = true,
  showCardNumber = true,
  showBalance = true,
  showRequisites = true,
  className,
}: BankCardProps) {
  const [internalSide, setInternalSide] = React.useState<"face" | "back">("face")
  const side = type ?? internalSide
  const setSide = React.useCallback(
    (next: "face" | "back") => {
      if (type === undefined) setInternalSide(next)
      onTypeChange?.(next)
    },
    [type, onTypeChange]
  )
  // Управляемая карта без колбэка перевернуться не может — и кнопкой себя
  // не объявляет.
  const flippable = type === undefined || onTypeChange !== undefined
  const [revealed, setRevealed] = React.useState<"number" | "cvc" | null>(null)
  // Тост — только сообщение о копировании: без `<ToastProvider>` карта
  // рисуется и копирует молча, а не роняет дерево.
  const toast = useToastOptional()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const prevSide = React.useRef(side)

  // Отвёрнутая сторона становится `inert`, и если фокус был в ней (Enter на
  // «Показать реквизиты»), браузер сбрасывает его на `<body>` — клавиатурный
  // пользователь оказывается в начале документа. Поэтому до отрисовки фокус
  // переносится на первую кнопку показанной стороны, а если кнопок нет — на
  // саму карту. Фокус на корне (переворот кликом по карте) не трогается.
  React.useLayoutEffect(() => {
    if (prevSide.current === side) return
    prevSide.current = side
    const root = rootRef.current
    const active = document.activeElement
    if (!root || !active) return
    const slot = (name: string) =>
      root.querySelector<HTMLElement>(`[data-slot="bank-card-${name}"]`)
    const hiddenSide = slot(side === "back" ? "face" : "back")
    if (!hiddenSide?.contains(active)) return
    const target =
      slot(side)?.querySelector<HTMLElement>("button:not([disabled])") ??
      (root.tabIndex >= 0 ? root : null)
    target?.focus()
  }, [side])

  function flip() {
    setSide(side === "face" ? "back" : "face")
  }

  // Показать реквизит и положить его в буфер — два разных действия, и
  // сообщение относится только ко второму. `writeText` штатно отклоняется
  // (небезопасный контекст, отказ в разрешении, документ не в фокусе), а
  // тост «Номер карты скопирован» раньше показывался и в этом случае —
  // вместе с необработанным отклонением промиса. Раскрытие при этом
  // остаётся: пользователь всё равно видит номер и может списать его
  // руками.
  async function toggleReveal(field: "number" | "cvc") {
    if (revealed === field) {
      setRevealed(null)
      return
    }
    setRevealed(field)
    const value = field === "number" ? cardNumber : cvc
    const label = field === "number" ? "Номер карты скопирован" : "CVC-код скопирован"
    try {
      // Вне безопасного контекста `navigator.clipboard` нет вовсе, и
      // `clipboard?.writeText` молча давал `undefined` — то есть «успех».
      if (!navigator.clipboard) throw new Error("Clipboard API недоступен")
      await navigator.clipboard.writeText(value.replace(/\s/g, ""))
      // `transient`, как у CopyButton: отклик системы в центре уведомлений
      // не остаётся (дизайн-чек от 08.09, замечание 15).
      toast?.add({ type: "checked", title: label, timeout: 3000, behavior: "transient" })
    } catch {
      toast?.add({
        type: "error",
        title: "Не удалось скопировать",
        timeout: 3000,
        behavior: "transient",
      })
    }
  }

  return (
    <div
      ref={rootRef}
      data-slot="bank-card"
      role={flippable ? "button" : undefined}
      tabIndex={flippable ? 0 : undefined}
      // Enter на «глазе» или «Показать реквизиты» — нажатие ИХ кнопки, а
      // не переворот карты.
      {...pressHandlers<HTMLDivElement>(flippable ? flip : undefined)}
      className={cn(
        "relative outline-none focus-visible:focus-ring",
        flippable && "cursor-pointer",
        size === "mobile" ? "h-[160px] w-[254px]" : "h-[208px] w-[332px]",
        className
      )}
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative size-full transition-transform duration-250 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFace
          skin={skin}
          size={size}
          paymentSystem={paymentSystem}
          last4={last4}
          balance={balance}
          showPaymentSystem={showPaymentSystem}
          showCardNumber={showCardNumber}
          showBalance={showBalance}
          // Управляемая карта без `onTypeChange` перевернуться не может:
          // подпись «Показать реквизиты» остаётся (она есть в макете), но
          // без обработчика рисуется текстом, а не мёртвой кнопкой.
          showRequisites={showRequisites}
          onShowRequisites={flippable ? () => setSide("back") : undefined}
          hidden={side !== "face"}
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0"
        />
        <CardBack
          size={size}
          last4={last4}
          cardNumber={cardNumber}
          cvc={cvc}
          cardholderName={cardholderName}
          expiry={expiry}
          revealed={revealed}
          onToggleReveal={toggleReveal}
          hidden={side !== "back"}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}

export { BankCard }
export type { BankCardProps, BankCardSize }
