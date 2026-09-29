// buildFileUploadSubtitle — правило сборки строки из макета:
//   [часть про количество] [часть про формат], [часть про размер]
// «Файл», когда maxFiles равен 1 или не задан; «До N файлов», когда есть
// ограничение; «Любое количество файлов», когда ограничения нет. Часть про
// размер — это «без ограничений по размеру» (присоединяется пробелом, без
// запятой), когда ограничения на файл нет, иначе «не более X MB» (плюс
// «каждый и не более Y MB суммарно», если задано и общее ограничение),
// присоединяется запятой. Общее ограничение без ограничения на файл по
// макету недопустимо («на сумму файлов ограничение по размеру невозможно»,
// пока не задан предел на файл) и здесь просто игнорируется, а не вызывает
// исключение.

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

  // Пустые названия форматов отбрасываются: «PDF /  / DOC» и «Файл  без
  // ограничений» выглядели опиской.
  const shownFormats = (formats ?? []).filter(
    (format) => typeof format === "string" && format.trim() !== ""
  )
  const formatClause =
    shownFormats.length > 0 ? shownFormats.join(" / ") : undefined

  const head = [countClause, formatClause].filter(Boolean).join(" ")

  if (!maxFileSizeMb) {
    return `${head} без ограничений по размеру`
  }

  const sizeClause = maxTotalSizeMb
    ? `не более ${maxFileSizeMb} MB каждый и не более ${maxTotalSizeMb} MB суммарно`
    : `не более ${maxFileSizeMb} MB`

  return `${head}, ${sizeClause}`
}
