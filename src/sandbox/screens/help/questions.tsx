import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { FileListItem } from "@/components/ui/file-upload"

import { SandboxBlock } from "../../shell"

import type { HelpBlock, HelpSection, HelpTopic } from "./types"

// Правая колонка страницы «Помощь» — фрейм `Questions` (нода 70400:30502):
// заголовок раздела, блок `Indice` с якорными ссылками и сами темы,
// разделённые линиями.
//
// «Блок „Общие вопросы“ содержит якорные ссылки на одноимённые заголовки по
// странице» — поэтому у каждой темы есть свой id, а ссылка ведёт на него.
// Отступ прокрутки берётся от занятой высоты шапки: без него заголовок темы
// уезжал бы под закреплённое горизонтальное меню.

const ANCHOR_OFFSET = "scroll-mt-[calc(var(--viewport-inset-top,0px)+40px)]"

function anchorId(section: string, topic: string): string {
  return `help-${section}-${topic}`
}

/** Пустая рамка на месте картинки или видео — так они и стоят в эталоне. */
function MediaPlaceholder({
  height,
  width,
}: {
  height: number
  width?: number
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0 rounded-[8px] border border-[var(--grey-134)]",
        width ? "self-center" : "w-full"
      )}
      style={{ height, width }}
    />
  )
}

function ContentBlock({ block }: { block: HelpBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="w-full text-p1-medium text-[var(--grey-1514)]">
          {block.text}
        </p>
      )

    case "lines":
      return (
        <p className="w-full text-p1-medium text-[var(--grey-1514)]">
          {block.lines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>
      )

    case "list":
      return (
        <div className="w-full text-p1-medium text-[var(--grey-1514)]">
          {block.intro && <p>{block.intro}</p>}
          <ol className="list-decimal ps-6">
            {block.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      )

    case "link":
      return (
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="w-full text-p1-medium text-[var(--grey-1514)] underline outline-none focus-visible:focus-ring"
        >
          {block.label}
        </a>
      )

    case "media":
      // Видео идёт со своим заголовком H4 и зазором 16 — фрейм «Видео +
      // заголовок» (нода 70400:30529).
      return block.title ? (
        <div className="flex w-full flex-col gap-4">
          <h4 className="w-full text-h4 text-[var(--grey-1514)]">
            {block.title}
          </h4>
          <MediaPlaceholder height={block.height} width={block.width} />
        </div>
      ) : (
        <MediaPlaceholder height={block.height} width={block.width} />
      )
  }
}

function Topic({
  topic,
  sectionValue,
}: {
  topic: HelpTopic
  sectionValue: string
}) {
  return (
    <article className="flex w-full flex-col gap-6">
      <h3
        id={anchorId(sectionValue, topic.value)}
        className={cn("w-full text-h4 text-[var(--grey-1514)]", ANCHOR_OFFSET)}
      >
        {topic.title}
      </h3>

      {topic.body.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}

      {topic.files && (
        <div className="flex w-full flex-col gap-4">
          {topic.files.map((file) => (
            // Крестик — как в эталоне (`IB / files` нарисован с ним и в
            // справке тоже). Здесь он ничего не удаляет: страница помощи
            // только читается.
            <FileListItem key={file.name} name={file.name} meta={file.meta} />
          ))}
        </div>
      )}
    </article>
  )
}

interface QuestionsProps {
  section: HelpSection
  /** Темы, попавшие в выдачу поиска — по ним же строится `Indice`. */
  topics: HelpTopic[]
}

function Questions({ section, topics }: QuestionsProps) {
  function scrollToTopic(event: React.MouseEvent, topic: HelpTopic) {
    const target = document.getElementById(anchorId(section.value, topic.value))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <SandboxBlock aria-label={section.title}>
      <h2 className="w-full text-h3 text-[var(--grey-1514)]">
        {section.title}
      </h2>

      <nav className="flex w-full flex-col gap-4">
        {topics.map((topic) => (
          <a
            key={topic.value}
            href={`#${anchorId(section.value, topic.value)}`}
            onClick={(event) => scrollToTopic(event, topic)}
            className="w-full truncate text-p1-medium text-[var(--grey-1514)] underline outline-none focus-visible:focus-ring"
          >
            {topic.title}
          </a>
        ))}
      </nav>

      {topics.map((topic) => (
        <div key={topic.value} className="flex w-full flex-col gap-8">
          <Divider />
          <Topic topic={topic} sectionValue={section.value} />
        </div>
      ))}

      {section.cta && (
        <div className="flex w-full flex-col gap-8">
          <Divider />
          <div className="flex w-full flex-col items-center gap-4 p-6">
            <p className="w-full text-center text-p1-medium text-[var(--grey-1514)]">
              {section.cta.text}
            </p>
            <Button size="default">{section.cta.action}</Button>
          </div>
        </div>
      )}
    </SandboxBlock>
  )
}

export { Questions }
