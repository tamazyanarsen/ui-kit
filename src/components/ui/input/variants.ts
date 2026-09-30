import { cva } from "class-variance-authority"

// В дизайне у Input определены только два размерных токена: S (32px на
// обоих брейкпоинтах) и L (48px на мобильном → 56px на десктопе, сначала
// мобильный, через `desktop:`). Размера M нет.
type InputSize = "sm" | "lg"

const inputBoxVariants = cva(
  // ⚠️ Заблокированное поле помечается `aria-disabled`, а НЕ нативным
  // `disabled` — см. комментарий у `fieldProps` в input.tsx. Поэтому все
  // селекторы состояния идут по атрибуту, а не по псевдоклассу.
  "group/input relative flex w-full items-center border border-[var(--input-border)] bg-[var(--input-bg)] transition-colors has-[[aria-disabled=true]]:cursor-not-allowed has-[[aria-disabled=true]]:border-[var(--input-border-disabled)] has-[[aria-disabled=true]]:bg-[var(--input-bg-disabled)]",
  {
    variants: {
      size: {
        // Второй проход: у sm стояло px-3 (12px), а оба символа S Desktop
        // — и вариант с комментарием, и пустой — дают литеральный
        // px-[16px], те же горизонтальные отступы, что у lg, а не
        // меньшие.
        sm: "h-8 gap-2 rounded-[8px] px-4",
        lg: "h-12 gap-2 rounded-[16px] px-4 desktop:h-14",
      },
      invalid: {
        true: "border-[var(--input-border-error)]",
        false: "",
      },
      interactive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        invalid: false,
        interactive: true,
        class:
          "hover:border-[var(--input-border-hover)] has-[input:focus]:border-[var(--input-border-hover)]",
      },
      {
        invalid: true,
        interactive: true,
        class:
          "hover:border-[var(--input-border-error-hover)] has-[input:focus]:border-[var(--input-border-error-hover)]",
      },
    ],
    defaultVariants: {
      size: "lg",
      invalid: false,
      interactive: true,
    },
  }
)

/**
 * Размер текста самого поля.
 *
 * Обновление мобильного макета Input (компонент-сет «ELK / input»
 * v1.2.0): у размера S текст на мобиле — 12/16 (Mobile.
 * Параграф/P2 Medium Mobile), а на десктопе остаётся 14/20
 * (Desktop. Параграф/P2 Medium). Раньше оба брейкпоинта
 * держали 14/20, из-за чего мобильный S был крупнее макета.
 *
 * ⚠️ Отдельной константой, а не только внутри `inputFieldVariants`: этот же
 * размер обязаны повторить невидимый двойник-измеритель и знак «₽» у маски
 * суммы. Разъедутся они — поле начнёт прокручиваться и обрежет начало числа.
 */
const FIELD_TEXT_SIZE: Record<InputSize, string> = {
  sm: "text-p3-medium desktop:text-p2-medium",
  lg: "text-p2-medium desktop:text-p1-medium",
}

const inputFieldVariants = cva(
  // Насыщенность живёт в text-pN-medium у каждого размерного варианта ниже,
  // а не здесь.
  // Кольцо фокуса заблокированному полю нужно обязательно: обычное поле
  // показывает фокус собственной рамкой (состояние Focused кита), а у
  // заблокированного рамка своя и на фокус не меняется — без кольца
  // невозможно понять, где ты вообще находишься.
  // ⚠️ `text-ellipsis` + `focus:text-clip` — дизайн-чек от 13.09, замечание
  // 14: «Непоместившиеся символы обрезаются грубо… Должны уходить в
  // многоточие. В состоянии фокуса, конечно, многоточие не нужно».
  //
  // Многоточие у поля ввода работает ровно так: браузер рисует его, только
  // пока поле НЕ в фокусе (в фокусе там каретка, и текст надо прокручивать, а
  // не подрезать). `focus:text-clip` пишет это правило явно, а не полагается
  // на умолчание браузера, — иначе поведение зависело бы от движка.
  //
  // Один класс закрывает и `Input`, и `Autocomplete`: поле у них общее.
  "peer min-w-0 flex-1 overflow-hidden bg-transparent text-ellipsis whitespace-nowrap text-[var(--input-fg)] outline-none focus:text-clip placeholder:text-[var(--input-label-fg)] aria-disabled:cursor-not-allowed aria-disabled:text-[var(--input-fg-disabled)] aria-disabled:focus-visible:focus-ring",
  {
    variants: {
      size: FIELD_TEXT_SIZE,
      // Плавающая подпись существует только у размера L: на S (32px) для
      // второй строки просто нет места, поэтому дизайн откатывается на
      // обычный placeholder, исчезающий при вводе (см. эталон S/Desktop).
      floating: {
        // Полный проход 30.09: в Fill-колонке макета подпись (16) и значение
        // стоят вплотную, то есть верх значения = верх подписи + 16 на обеих
        // формах. Десктоп: блок 40 в коробке 56 — подпись на 8, значение на
        // 24 (pt-4). Мобильная: блок 36 на y=7 (7 сверху, 5 снизу), значение
        // на 23 (pt-[18px]). Раньше стояли pt-5 и pt-4: зазор 2 на десктопе и
        // наезд на 2 на мобильной.
        true: "placeholder:text-transparent [&:not(:placeholder-shown)]:pt-[18px] focus:pt-[18px] desktop:[&:not(:placeholder-shown)]:pt-4 desktop:focus:pt-4",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      floating: false,
    },
  }
)

// В пустом состоянии подпись совпадает по размеру с текстом самого поля
// (ведёт себя как placeholder), а всплыв наверх (при фокусе или
// заполнении) уменьшается до обычного размера пояснения кита.
// Дизайн-чек, замечания 3, 16 и 30: раньше в обоих состояниях стоял
// плоский text-xs (12px) — слишком мелко для пустой, ещё не всплывшей
// подписи на всех размерах, кроме S (там плавающей подписи нет вовсе, см.
// `floating` выше).
// На всплывшем заполненном символе «L / Desktop, Focused, Filled» и
// placeholder пустого состояния, и всплывшая маленькая подпись лежат
// внутри одной обёртки font-['Object_Sans:Medium'] — то есть Medium на
// любом размере, а не только в состоянии до всплытия P1/P2.
const floatingLabelVariants =
  // Всплывшее положение: десктопная коробка 56 центрует блок 40 (16 + 24) в
  // своём внутреннем пространстве 54 — подпись на 7 от внутреннего края
  // (8 от внешнего, как y=8 в макете). Мобильный блок 36 в макете стоит на
  // y=7 от внешнего края (7 сверху, 5 снизу), то есть 6 от внутреннего.
  "pointer-events-none absolute top-1/2 -translate-y-1/2 truncate text-p2-medium text-[var(--input-label-fg)] transition-all desktop:text-p1-medium peer-focus:top-[6px] peer-focus:translate-y-0 desktop:peer-focus:top-[7px] peer-focus:text-p3-medium desktop:peer-focus:text-p3-medium peer-[&:not(:placeholder-shown)]:top-[6px] peer-[&:not(:placeholder-shown)]:translate-y-0 desktop:peer-[&:not(:placeholder-shown)]:top-[7px] peer-[&:not(:placeholder-shown)]:text-p3-medium desktop:peer-[&:not(:placeholder-shown)]:text-p3-medium group-has-[[aria-disabled=true]]/input:text-[var(--input-label-fg-disabled)]"

// Замыкающие глифы (крестик очистки, глаз, замок, крутилка) — 16px на
// любом размере: `icon / close cross` в макете это `size-[16px]` и в ряду
// S, и в L-mobile, и в L-desktop одинаково.
// Полный проход 30.09: у S стояло size-3.5 (14px), а `icon / lock` S/Desktop и
// `icon / close cross` S/Mobile в макете — size-[16px].
const ICON_SIZE: Record<InputSize, string> = {
  sm: "size-4",
  lg: "size-4",
}

// Исключение — *ведущий* значок: ряд L рисует его в 24px (заполненный ряд
// «Icon Left» у поля высотой 56px), тогда как компактный ряд сохраняет
// 16px.
const LEADING_ICON_SIZE: Record<InputSize, string> = {
  sm: "size-4",
  lg: "size-6",
}

export {
  FIELD_TEXT_SIZE,
  ICON_SIZE,
  LEADING_ICON_SIZE,
  floatingLabelVariants,
  inputBoxVariants,
  inputFieldVariants,
}
export type { InputSize }
