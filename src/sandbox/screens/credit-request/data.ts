// Данные экрана D4 — с эталонов 70371:24608 / 24650 / 24684 / 24755.

interface Predecessor {
  id: string
  fullName: string
  shortName: string
  ogrn: string
}

const SEEDED_PREDECESSOR: Predecessor = {
  id: "p1",
  fullName: "Общество с ограниченной ответственностью «СК Альфа»",
  shortName: "ООО «СК Альфа»",
  ogrn: "1234567890123",
}

interface UploadedFile {
  id: string
  name: string
  meta: string
}

/** Два одноимённых файла — ровно как в эталоне «файлы приложены». */
const SEEDED_FILES: UploadedFile[] = [
  { id: "f1", name: "File.txt", meta: "21.02.2026, 16:34 - 589 Кб" },
  { id: "f2", name: "File.txt", meta: "21.02.2026, 16:34 - 589 Кб" },
]

const CITIZENSHIPS = [
  { value: "ru", label: "Российская Федерация" },
  { value: "by", label: "Республика Беларусь" },
  { value: "kz", label: "Республика Казахстан" },
]

const DOCUMENT_TYPES = [
  { value: "charter", label: "Устав" },
  { value: "protocol", label: "Протокол" },
  { value: "order", label: "Приказ" },
]

const YES_NO = [
  { value: "yes", label: "Да" },
  { value: "no", label: "Нет" },
]

export {
  CITIZENSHIPS,
  DOCUMENT_TYPES,
  SEEDED_FILES,
  SEEDED_PREDECESSOR,
  YES_NO,
}
export type { Predecessor, UploadedFile }
