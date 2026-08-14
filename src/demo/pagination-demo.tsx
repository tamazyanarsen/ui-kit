import { useState } from "react"

import { Pagination } from "@/components/ui/pagination"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function PaginationDemo() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const [middlePage, setMiddlePage] = useState(6)
  const [endPage, setEndPage] = useState(26)
  const [bigPage, setBigPage] = useState(1288)

  return (
    <AccordionItem value="pagination">
      <AccordionTrigger>Pagination</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RowLabel>Интерактивный — 8 страниц</RowLabel>
            <Pagination
              page={page}
              totalPages={8}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Begin — 1 2 3 4 5 … 8</RowLabel>
            <Pagination page={1} totalPages={8} pageSize={25} showPageSize={false} />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Middle — 1 … 5 6 7 … 26</RowLabel>
            <Pagination
              page={middlePage}
              totalPages={26}
              onPageChange={setMiddlePage}
              pageSize={25}
              showPageSize={false}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>End — 1 … 22 23 24 25 26</RowLabel>
            <Pagination
              page={endPage}
              totalPages={26}
              onPageChange={setEndPage}
              pageSize={25}
              showPageSize={false}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Четырёхзначный номер — 1 … 1287 1288 1289 … 3209</RowLabel>
            <Pagination
              page={bigPage}
              totalPages={3209}
              onPageChange={setBigPage}
              pageSize={25}
              showPageSize={false}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>1 страница — только текущая, без стрелок в потоке</RowLabel>
            <Pagination page={1} totalPages={1} pageSize={25} pageSizeOptions={[25, 50, 100]} />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Page Count с 75 — 25 50 75 100</RowLabel>
            <Pagination
              page={1}
              totalPages={4}
              pageSize={50}
              pageSizeOptions={[25, 50, 75, 100]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>M — узкий контейнер (селектор переносится вниз влево)</RowLabel>
            <div className="max-w-64 rounded-lg border border-[#DEDEDE] p-3">
              <Pagination page={3} totalPages={8} pageSize={25} />
            </div>
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Максимум 7 элементов страниц без стрелок; при большем количестве
          страниц — усечение через «…» по трём паттернам (Begin/Middle/End).
          Layout «M» из спека — не отдельный size-проп, а реакция на нехватку
          горизонтального места (тут — через flex-wrap контейнера).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { PaginationDemo }
