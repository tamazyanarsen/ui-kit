export type ThumbnailSize = "l" | "m"

// Типы семейства «Card» (card, sticker, picture) рисуют тёмный квадрат со
// знаком платёжной системы или картинкой, приглушаемый прозрачностью в
// выключенном состоянии (сверено с собственными образцами Disabled в
// макете: это плоский opacity-50 на всей плитке, а не подмена цвета фона).
// Типы СБП рисуют ту же тёмную плитку, но абсолютно спозиционированным
// внутренним слоем, а не внешней заливкой, — чтобы «sbp-card-account» мог
// показать под ней тонкий просвет (эффект «выглядывающей второй карты»).
// «icon» — самостоятельная светло-серая плитка с тёмным глифом, к тёмному
// семейству карт она НЕ относится.
//
// Дизайн-чек №3 №4: «Некорректные нейминги в матрице thumbnail. Это не
// more, это вариант с иконкой». В мастере вариант называется `Type=Icon` и
// держит любой 24px-глиф набора; «многоточие» — лишь содержимое инстанса по
// умолчанию, а не имя варианта.
//
// Типы icon-status рисуют светлый подкрашенный квадрат с глифом.
export type ThumbnailType =
  | "icon"
  | "card"
  | "sticker"
  | "sbp-card"
  | "sbp-card-account"
  | "picture"
  | "check"
  | "question"
  | "clock"
  | "alert"
  | "alert-red"

/**
 * Платёжная система на плашке карты.
 *
 * Дизайн-чек «Storybook 3», замечание 9: «заменить в card account "unionpay"
 * на "МИР" с белой иконкой». UnionPay из набора убран целиком, а не только в
 * одной витрине: перечисление у плашки карты одно на весь кит (Card Account,
 * Thumbnail, Bank Card), и оставить отвергнутое значение в двух местах из
 * трёх — значит развести их между собой.
 *
 * `mir-white` — тот же знак «МИР», но белым: так он нарисован на тёмной
 * миниатюре бизнес-карты (макет D-10923).
 */
export type PaymentSystem = "mir" | "mir-white" | "mastercard" | "visa"

/**
 * Заливка квадрата у плитки с иконкой (`Type=Icon`).
 *
 * Дизайн-чек от 13.09, замечание 5: «Добавить версию Thumbnail с белым фоном
 * квадрата. В ДС такая версия приедет позже, пока просто добавить её в кит.
 * Отличаться будет только цвет фона».
 *
 * Отдельная ось, а не ещё один `Type`: тип задаёт, ЧТО на плитке (карта,
 * стикер, картинка, статус), и белая заливка ни одному из них не подходит —
 * у карточных она чёрная, потому что это сама карта, у статусных подкрашена
 * статусом. Свободна она ровно у `Icon`, и меняется там действительно только
 * фон: глиф, размер и радиус те же.
 */
export type ThumbnailBackground = "grey" | "white"

export const THUMBNAIL_ICON_BG: Record<ThumbnailBackground, string> = {
  grey: "var(--tag-grey-secondary-bg)",
  white: "var(--white-101)",
}

export const CARD_TYPES = new Set<ThumbnailType>(["card", "sticker", "picture"])

export const SBP_TYPES = new Set<ThumbnailType>(["sbp-card", "sbp-card-account"])

// Подкраска типов icon-status переиспользует вторичные цветовые токены Tag
// (то же семейство оттенков «12% поверх белого») и цвета значков Informer.
// Подтверждено пипеткой: значок Check у thumbnail против
// --informer-icon-green совпал в пределах шума сглаживания.
export const ICON_STATUS_STYLE: Record<
  "check" | "question" | "clock" | "alert" | "alert-red",
  { bg: string; fg: string }
> = {
  check: { bg: "var(--tag-green-secondary-bg)", fg: "var(--informer-icon-green)" },
  question: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  clock: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  alert: { bg: "var(--tag-orange-secondary-bg)", fg: "var(--informer-icon-yellow)" },
  "alert-red": { bg: "var(--tag-red-secondary-bg)", fg: "var(--informer-icon-red)" },
}

export function isIconStatusType(
  type: ThumbnailType
): type is "check" | "question" | "clock" | "alert" | "alert-red" {
  return type in ICON_STATUS_STYLE
}
