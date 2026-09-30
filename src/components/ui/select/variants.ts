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
        // Полный проход 30.09: S/Mobile в макете — 12/16 (P2 Medium Mobile), а
        // S/Desktop — 14/20; стояло 14/20 на обоих.
        sm: "min-h-8 gap-2 rounded-[8px] px-4 text-p3-medium desktop:text-p2-medium",
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
/// Полный проход 30.09: всплывшая подпись — на 8 от внешнего края на
// десктопе (блок 40 центрован в 56) и на 7 на мобильной (блок 36 на y=7 в
// 48), то есть top-[7px] и top-[6px] от внутреннего края; значение стоит
// вплотную под подписью (см. pt в trigger.tsx).
// Правая граница подписи обязательна: абсолютная подпись без неё растёт
// под свой текст, `truncate` не об что обрезать, и длинная подпись уходила
// под шеврон и за край поля (аудит 14: до 749px при поле 343). Место —
// как у Input: отступ 16 + шеврон 16 + зазор 8 = `right-10`; при значении
// рядом встаёт ещё крестик очистки (16 + 8) — `right-16`.
export const selectFloatingLabelClassName =
  "pointer-events-none absolute top-1/2 left-4 right-10 -translate-y-1/2 truncate group-[&:not([data-placeholder])]/trigger:right-16 text-p2-medium text-[var(--select-label-fg)] transition-all desktop:text-p1-medium group-data-popup-open/trigger:top-[6px] desktop:group-data-popup-open/trigger:top-[7px] group-data-popup-open/trigger:translate-y-0 group-data-popup-open/trigger:text-p3-medium desktop:group-data-popup-open/trigger:text-p3-medium group-[&:not([data-placeholder])]/trigger:top-[6px] desktop:group-[&:not([data-placeholder])]/trigger:top-[7px] group-[&:not([data-placeholder])]/trigger:translate-y-0 group-[&:not([data-placeholder])]/trigger:text-p3-medium desktop:group-[&:not([data-placeholder])]/trigger:text-p3-medium group-data-disabled/trigger:text-[var(--select-label-fg-disabled)]"

// Статичная подпись (S) видна только в пустом поле — крестика рядом ещё
// нет, поэтому граница одна: `right-10`. Центрируется сдвигом, а не
// флексом: у flex-контейнера текст — анонимный элемент, и `truncate`
// обрезал его без многоточия.
export const selectStaticLabelClassName =
  "pointer-events-none absolute top-1/2 left-4 right-10 -translate-y-1/2 truncate text-p3-medium desktop:text-p2-medium text-[var(--select-label-fg)] transition-opacity group-[&:not([data-placeholder])]/trigger:opacity-0 group-data-disabled/trigger:text-[var(--select-label-fg-disabled)]"

export const SELECT_ICON_SIZE = { sm: "size-4", lg: "size-4" } as const
