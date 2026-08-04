import {
  FileUploadDropzone,
  FileListItem,
  buildFileUploadSubtitle,
} from "@/components/ui/file-upload"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function FileUploadDemo() {
  return (
    <>
      <AccordionItem value="file-upload-variants">
        <AccordionTrigger>File Upload — варианты</AccordionTrigger>
        <AccordionPanel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <RowLabel>Исходное состояние</RowLabel>
              <FileUploadDropzone subtitle="До 10 файлов DOCX без ограничений по размеру" />
            </div>
            <div className="space-y-1.5">
              <RowLabel>Не доступный для взаимодействия</RowLabel>
              <FileUploadDropzone
                disabled
                subtitle="До 10 файлов DOCX без ограничений по размеру"
              />
            </div>
            <div className="space-y-1.5">
              <RowLabel>Состояние ошибки</RowLabel>
              <FileUploadDropzone
                error
                subtitle="До 10 файлов DOCX без ограничений по размеру"
              />
            </div>
            <div className="space-y-1.5">
              <RowLabel>Состояние при наведении (drag over)</RowLabel>
              <FileUploadDropzone subtitle="Перетащите файл в область, чтобы увидеть Grey 100" />
            </div>
          </div>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Drag & Drop, а также через кнопку/ссылку «загрузите файлы» (клик
            по всей области открывает системный диалог выбора файла). При
            перетаскивании файла над областью фон меняется на Grey 100 —
            попробуйте перетащить файл на последнюю карточку.
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="file-item-variants">
        <AccordionTrigger>File — состояния элемента списка</AccordionTrigger>
        <AccordionPanel>
          <div className="grid grid-cols-1 gap-x-8 divide-y sm:grid-cols-2 sm:divide-y-0">
            <div>
              <RowLabel>Исходное состояние</RowLabel>
              <FileListItem name="File.doc" meta="21.06.2025, 16:34 · 589 КБ" />
            </div>
            <div>
              <RowLabel>Состояние загрузки файла</RowLabel>
              <FileListItem name="File.doc" state="loading" />
            </div>
            <div>
              <RowLabel>Не доступный для взаимодействия</RowLabel>
              <FileListItem
                name="File.doc"
                meta="21.06.2025, 16:34 · 589 КБ"
                state="disabled"
              />
            </div>
            <div>
              <RowLabel>Состояние ошибки</RowLabel>
              <FileListItem name="File.doc" state="error" />
            </div>
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="file-upload-subtitle-rules">
        <AccordionTrigger>
          File Upload — правила составления текста в Subtitle
        </AccordionTrigger>
        <AccordionPanel>
          <div className="space-y-6">
            {[
              {
                desc: "До N файлов · несколько форматов · лимит на файл и на сумму",
                opts: {
                  maxFiles: 5,
                  formats: ["PDF", "DOCX", "RTF"],
                  maxFileSizeMb: 20,
                  maxTotalSizeMb: 30,
                },
              },
              {
                desc: "До N файлов · один формат · без ограничения по размеру",
                opts: { maxFiles: 10, formats: ["DOCX"] },
              },
              {
                desc: "Один файл · один формат · лимит на файл",
                opts: { maxFiles: 1, formats: ["PDF"], maxFileSizeMb: 20 },
              },
            ].map(({ desc, opts }) => (
              <div key={desc} className="space-y-1.5">
                <RowLabel>{desc}</RowLabel>
                <FileUploadDropzone subtitle={buildFileUploadSubtitle(opts)} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Правило: количество + формат, затем размер. Без лимита на файл —
            «без ограничений по размеру» (без запятой). С лимитом на файл —
            «не более X MB» (запятая перед этой частью), и «... MB каждый и
            не более Y MB суммарно», если также задан лимит на сумму файлов.
            Лимит на сумму без лимита на файл — недопустимая комбинация по
            спецификации.
          </p>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { FileUploadDemo }
