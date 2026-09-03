import * as React from "react"

import { Eye, EyeOff, Loader2, Lock, X } from "@/icons"
import { cn } from "@/lib/utils"

import { ICON_SIZE, type InputSize } from "./variants"

interface TrailingSlotProps {
  size: InputSize
  /** Поле нельзя редактировать — замок вместо любого другого значка. */
  locked: boolean
  /** «Идёт поиск» — спиннер занимает слот целиком. */
  loading: boolean
  isPassword: boolean
  passwordVisible: boolean
  onPasswordVisibleChange: (visible: boolean) => void
  /** Свой значок (например, галочка валидного промокода) вместо крестика. */
  trailingIcon?: React.ReactNode
  clearable: boolean
  onClear: () => void
  disabled?: boolean
}

/**
 * Хвостовой слот поля. Занят он всегда не больше чем одним значком, и
 * порядок приоритета жёсткий: замок → спиннер → глаз пароля → свой значок →
 * крестик очистки. Ранние возвраты, а не цепочка тернарников: так приоритет
 * виден сразу, и каждая ветка читается сама по себе.
 */
function InputTrailingSlot({
  size,
  locked,
  loading,
  isPassword,
  passwordVisible,
  onPasswordVisibleChange,
  trailingIcon,
  clearable,
  onClear,
  disabled,
}: TrailingSlotProps) {
  if (locked) {
    return (
      <Lock
        aria-hidden="true"
        className={cn(
          ICON_SIZE[size],
          "shrink-0 text-[var(--input-icon-fg)] group-has-[[aria-disabled=true]]/input:text-[var(--input-fg-disabled)]"
        )}
      />
    )
  }

  if (loading) {
    return (
      <Loader2
        aria-hidden="true"
        className={cn(
          ICON_SIZE[size],
          "shrink-0 animate-spin text-[var(--input-border-hover)]"
        )}
      />
    )
  }

  if (isPassword) {
    const Glyph = passwordVisible ? EyeOff : Eye
    return (
      <button
        type="button"
        aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
        onClick={() => onPasswordVisibleChange(!passwordVisible)}
        className="shrink-0 text-[var(--input-icon-fg)] outline-none focus-visible:focus-ring disabled:hidden"
        disabled={disabled}
      >
        <Glyph aria-hidden="true" className={ICON_SIZE[size]} />
      </button>
    )
  }

  if (trailingIcon) {
    return (
      <span className="shrink-0 text-[var(--input-icon-fg)]">
        {trailingIcon}
      </span>
    )
  }

  if (clearable) {
    return (
      <button
        type="button"
        aria-label="Очистить поле"
        onClick={onClear}
        // Крестик появляется только у заполненного поля — отсюда
        // `:not(:placeholder-shown)` на соседе-инпуте.
        className="hidden shrink-0 text-[var(--input-icon-fg)] outline-none focus-visible:focus-ring peer-[&:not(:placeholder-shown)]:block disabled:hidden"
        disabled={disabled}
      >
        <X aria-hidden="true" className={ICON_SIZE[size]} />
      </button>
    )
  }

  return null
}

/** Занят ли хвостовой слот — по нему поле решает, где обрезать подпись. */
function hasTrailingSlot({
  locked,
  loading,
  isPassword,
  trailingIcon,
  clearable,
}: Pick<
  TrailingSlotProps,
  "locked" | "loading" | "isPassword" | "trailingIcon" | "clearable"
>) {
  return Boolean(locked || loading || isPassword || trailingIcon || clearable)
}

export { InputTrailingSlot, hasTrailingSlot }
