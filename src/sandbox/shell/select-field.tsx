import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Обёртка над составным `Select` для форм песочниц.
//
// Композиционный API кита (`Select` + `SelectTrigger` + `SelectContent` +
// `SelectItem`) остаётся способом собрать нестандартный селект; здесь —
// обычный случай «подпись + список значений», который на песочных экранах
// встречается тридцать с лишним раз. Без обёртки каждый экран повторял бы
// четырнадцать строк JSX, и `clearable={false}` в одном из них однажды бы
// потерялся.
//
// ⚠️ `clearable` выключен по умолчанию, а в ките у `SelectTrigger` он
// включён. Эталоны песочниц рисуют у селектов ТОЛЬКО шеврон — крестика
// очистки нет ни на одном из тринадцати экранов, поэтому умолчание здесь
// снято с эталонов, а не унаследовано.

interface SelectOption {
  value: string
  label: string
}

interface SandboxSelectProps {
  label?: React.ReactNode
  items: SelectOption[]
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  comment?: React.ReactNode
  error?: React.ReactNode
  disabled?: boolean
  /**
   * Значение задано снаружи и в личном кабинете не меняется: селект
   * показывает ЗАМОК вместо шеврона и не раскрывается.
   *
   * ⚠️ Это не `disabled`. Выключенный селект гаснет целиком («Disabled
   * гасит ВСЁ» — сквозное правило проекта), а закрытый на замок остаётся
   * читаемым: значение всё ещё надо видеть. На «Правах подписи документов»
   * (D10) это ровно та разница, что нарисована в эталоне.
   */
  readOnly?: boolean
  clearable?: boolean
  size?: "sm" | "lg"
  className?: string
}

function SandboxSelect({
  label,
  items,
  value,
  onValueChange,
  placeholder = "",
  comment,
  error,
  disabled,
  readOnly,
  clearable = false,
  size = "lg",
  className,
}: SandboxSelectProps) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      readOnly={readOnly}
    >
      <SelectTrigger
        size={size}
        label={label}
        comment={comment}
        error={error}
        clearable={clearable}
        className={className}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { SandboxSelect }
export type { SandboxSelectProps, SelectOption }
