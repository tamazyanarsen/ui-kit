// buildFileUploadSubtitle — the composition rule from the spec:
//   [count clause] [format clause], [size clause]
// "Файл" when maxFiles is 1/unset, "До N файлов" when capped, "Любое
// количество файлов" when uncapped. Size clause is "без ограничений по
// размеру" (space-joined, no comma) when there's no per-file cap, otherwise
// "не более X MB" (+ "каждый и не более Y MB суммарно" when a total cap is
// also set) — comma-joined. A total cap without a per-file cap is invalid
// per the spec ("на сумму файлов ограничение по размеру невозможно" without
// a per-file limit already set) and is ignored here rather than thrown.

export interface FileUploadSubtitleOptions {
  maxFiles?: number | "unlimited"
  formats?: string[]
  maxFileSizeMb?: number
  maxTotalSizeMb?: number
}

export function buildFileUploadSubtitle({
  maxFiles,
  formats,
  maxFileSizeMb,
  maxTotalSizeMb,
}: FileUploadSubtitleOptions): string {
  const countClause =
    maxFiles === undefined || maxFiles === 1
      ? "Файл"
      : maxFiles === "unlimited"
        ? "Любое количество файлов"
        : `До ${maxFiles} файлов`

  const formatClause =
    formats && formats.length > 0 ? formats.join(" / ") : undefined

  const head = [countClause, formatClause].filter(Boolean).join(" ")

  if (!maxFileSizeMb) {
    return `${head} без ограничений по размеру`
  }

  const sizeClause = maxTotalSizeMb
    ? `не более ${maxFileSizeMb} MB каждый и не более ${maxTotalSizeMb} MB суммарно`
    : `не более ${maxFileSizeMb} MB`

  return `${head}, ${sizeClause}`
}
