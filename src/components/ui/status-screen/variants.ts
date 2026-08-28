// Десять статусов экрана результата — по одному 3D-кадру на каждый
// (см. illustration.tsx и порядок карточек в макете 47945:30260).
export type StatusType =
  | "success"
  | "error"
  | "attention"
  | "question"
  | "search"
  | "clock"
  | "lock"
  | "edit"
  | "search-attention"
  | "time-attention"

export const STATUS_TYPES: StatusType[] = [
  "success",
  "error",
  "attention",
  "question",
  "search",
  "clock",
  "lock",
  "edit",
  "search-attention",
  "time-attention",
]
