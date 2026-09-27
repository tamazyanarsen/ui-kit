import { cva } from "class-variance-authority"

// Общие стилевые константы — ComboboxTrigger переиспользует их как есть
// (тот же макет триггера, другое содержимое всплывающего окна), поэтому
// держите их не привязанными ни к одной конкретной реализации триггера.

// Коробка оформлена так же, как у Input: S (32px, радиус 8, на обоих
// брейкпоинтах) и L (48px на мобильном → 56px на десктопе через
// `desktop:`, радиус 16). Размера M нет.
export const selectTriggerVariants = cva(
  // Это рисуется как <div> (через пропс `render`), а не как нативный
  // элемент формы, поэтому :enabled и :disabled не действуют. Останавливает
  // наведение и фокус у выключенного триггера именно
  // data-disabled:pointer-events-none.
  "group/trigger relative flex w-full cursor-pointer items-center border border-[var(--select-border)] bg-[var(--select-bg)] text-left outline-none transition-colors select-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-[var(--select-border-disabled)] data-disabled:bg-[var(--select-bg-disabled)] focus-visible:focus-ring",
  {
    variants: {
      size: {
        // Второй проход: стояло px-3 (12px), а литеральный инстанс
        // «ELK / select» высотой 32px использует px-[16px] — те же
        // горизонтальные отступы, что и у размера lg, а не меньшие.
        // Дизайн-чек 3/3 №21: высоты стали минимальными, а не жёсткими.
        // Маска `Logotype BIK` — трёхстрочная (подпись, значение и БИК), её
        // блок в макете 52px, и в коробку фиксированной высоты 56px она не
        // влезала: третья строка обрезалась нижней границей. Пустое и
        // однострочное поле от этой замены не меняется — контент ниже
        // минимума, `items-center` держит его по центру.
        sm: "min-h-8 gap-2 rounded-[8px] px-4 text-p2-medium",
        lg: "min-h-12 gap-2 rounded-[16px] px-4 text-p2-medium desktop:min-h-14 desktop:text-p1-medium",
      },
      invalid: {
        true: "border-[var(--select-border-error)] hover:border-[var(--select-border-error-hover)] focus:border-[var(--select-border-error-hover)]",
        false:
          "hover:border-[var(--select-border-hover)] focus:border-[var(--select-border-hover)]",
      },
    },
    defaultVariants: { size: "lg", invalid: false },
  }
)

// У L есть двухстрочная плавающая подпись (как у lg в Input). S всего 32px
// высотой, для второй строки места нет, поэтому подпись просто угасает на
// месте при заполнении — ровно так же, как sm в Input откатывается на
// обычный placeholder.
//
// Подпись всплывает, пока открыто всплывающее окно (`data-popup-open`) или
// пока есть значение, и намеренно *не* по `:focus`. Для текстового
// `<input>` фокус — надёжный признак «пользователь сейчас начнёт печатать»,
// но здесь триггер открывается кликом: после закрытия окна фокус остаётся
// на нём (и это правильно с точки зрения доступности — закрытие не должно
// его снимать). Привяжи всплытие к фокусу — и подпись будет висеть наверху
// бесконечно после каждого взаимодействия, когда резервировать место над
// значением давно уже незачем.
// Дизайн-чек, замечание 15: подпись в пустом состоянии стояла плоским
// text-xs (12px), тем же, что и во всплывшем состоянии, — слишком мелко,
// пока значения ещё нет. Правка та же, что и у Input: text-sm, пока пусто,
// и уменьшение до text-xs после всплытия.
export const selectFloatingLabelClassName =
  "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 truncate text-p2-medium text-[var(--select-label-fg)] transition-all desktop:text-p1-medium group-data-popup-open/trigger:top-[7px] group-data-popup-open/trigger:translate-y-0 group-data-popup-open/trigger:text-p3-medium desktop:group-data-popup-open/trigger:text-p3-medium group-[&:not([data-placeholder])]/trigger:top-[7px] group-[&:not([data-placeholder])]/trigger:translate-y-0 group-[&:not([data-placeholder])]/trigger:text-p3-medium desktop:group-[&:not([data-placeholder])]/trigger:text-p3-medium group-data-disabled/trigger:text-[var(--select-fg-disabled)]"

export const selectStaticLabelClassName =
  "pointer-events-none absolute inset-y-0 left-4 flex items-center truncate text-p2-medium text-[var(--select-label-fg)] transition-opacity group-[&:not([data-placeholder])]/trigger:opacity-0 group-data-disabled/trigger:text-[var(--select-fg-disabled)]"

export const SELECT_ICON_SIZE = { sm: "size-4", lg: "size-4" } as const
