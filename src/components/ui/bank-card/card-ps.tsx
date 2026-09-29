import type { PaymentSystem } from "@/components/ui/thumbnail"
import { PaymentLogo } from "@/components/ui/thumbnail"

import type { BankCardSkin } from "./variants"

import mastercard from "./payment-systems/mastercard.svg"
import mir from "./payment-systems/mir.svg"
import mirSupreme from "./payment-systems/mir-supreme.svg"
import visa from "./payment-systems/visa.svg"

/**
 * `Card PS` — логотип платёжной системы на лицевой стороне карты.
 *
 * Раньше здесь стоял `PaymentLogo` (цвет и надпись «на глаз»), а
 * выгруженные из макета SVG лежали в `payment-systems/` неподключёнными —
 * причём с фоном страницы Figma внутри (три лишних `<rect>`). Теперь файлы
 * чистые (только контур логотипа, белая заливка у МИР и Visa, фирменные
 * цвета у Mastercard) и показываются через `<img>`.
 *
 * Размеры сняты с разрешённых экземпляров `Card PS` в символах `Face`
 * (`get_metadata`, не по дизайн-контексту: тот для Visa и Mastercard
 * возвращает картинку МИР):
 *
 *   коробка   Desktop 80×26, Mobile 52×17; у МИР Supreme 80×40 и 52×26
 *   МИР       51.33×17    (файл 80×26, рисунок 79 шириной, высота 17)
 *   Visa      50×17
 *   Mastercard 40×25      (в мобильной коробке 52×17 — высотой 17)
 *   Supreme   49.98×26    (файл 80×26 в натуральную величину)
 *
 * МИР Supreme в макете стоит на стиле `Multi` (мультивалютная карта, там же
 * подпись «МИР Supreme (для мультивалютной)»); на прочих стилях — обычный
 * МИР. Белый «МИР» (`mir-white`) на картах — тот же белый файл.
 *
 * Файлы приходят с `preserveAspectRatio="none"`, поэтому у `<img>` явные
 * ширина и высота: без них рисунок растягивается по коробке.
 */
const FILE_W = 80
const FILE_H = 26

/** Высота рисунка в коробке Desktop, px; Mobile везде 17 (высота коробки). */
const GLYPH_H: Partial<Record<PaymentSystem, number>> = {
  mir: 17,
  "mir-white": 17,
  visa: 17,
  mastercard: 25,
}

const FILES: Partial<Record<PaymentSystem, string>> = {
  mir,
  "mir-white": mir,
  visa,
  mastercard,
}

function CardPs({
  system,
  skin,
  size,
}: {
  system: PaymentSystem
  skin: BankCardSkin
  size: "desktop" | "mobile"
}) {
  const mobile = size === "mobile"
  const supreme = skin === "multi" && (system === "mir" || system === "mir-white")
  const src = supreme ? mirSupreme : FILES[system]

  if (!src) {
    // Системы без файла в макете остаются знаком — как и было.
    return <PaymentLogo system={system} size={mobile ? "md" : "lg"} />
  }

  const glyphH = supreme ? FILE_H : mobile ? 17 : (GLYPH_H[system] ?? 17)
  const boxW = mobile ? 52 : 80
  const boxH = supreme ? (mobile ? 26 : 40) : mobile ? 17 : 26

  return (
    <span
      data-slot="card-ps"
      data-system={supreme ? "mir-supreme" : system}
      aria-hidden="true"
      className="relative block shrink-0"
      style={{ width: boxW, height: boxH }}
    >
      <img
        src={src}
        alt=""
        width={(FILE_W * glyphH) / FILE_H}
        height={glyphH}
        draggable={false}
        className="absolute top-0 left-0 block max-w-none"
      />
    </span>
  )
}

export { CardPs }
