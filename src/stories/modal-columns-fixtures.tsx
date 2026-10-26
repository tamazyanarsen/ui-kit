import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Наполнение витрины двухколоночной модалки — пример «Операции и выписки»
 * из макета 40843:8020 (дизайн-чек 08.10, замечание 15: «пример наполнения
 * для витрины сторибука… содержимое взять можно»).
 *
 * Слева — список вопросов (`SideBar List (ELK)`: p 12, радиус 8, P1 Medium,
 * выбранный — заливка Grey 109), справа — ответ: заголовок H4, картинка
 * 480:290 с рамкой Grey 124 и радиусом 12, текст P1, интервал 24.
 */
const HELP_ITEMS = [
  "Как заказать выписку",
  "Какие выписки можно заказать",
  "Как посмотреть заказанную ранее выписку и выписки по расписанию",
  "Где я могу посмотреть активные расписания для выписок",
  "Как посмотреть историю операций",
  "Как скачать подтверждение о размещении средств",
]

const HELP_TEXT =
  "Для успешного завершения процесса подписания платежа вам необходимо выполнить несколько шагов. Сначала убедитесь, что все требуемые данные заполнены корректно и полностью. Это может включать в себя ввод личной информации, данных о платеже и других важных сведений. После того как вы завершите этот этап, просто нажмите на соответствующую кнопку, чтобы продолжить. Как только вы нажмете на кнопку, система предоставит вам подсказку о том, какой шаг следует предпринять далее. Эта подсказка будет зависеть от типа подписи, который вы настроили для использования в системе. Важно внимательно ознакомиться с предложенными рекомендациями и инструкциями, чтобы успешно завершить процесс подписания платежа и избежать возможных ошибок. Не забывайте, что правильное выполнение всех шагов поможет вам сэкономить время и избежать ненужных задержек."

function useHelpColumns() {
  const [active, setActive] = React.useState(0)

  const left = (
    <nav aria-label="Вопросы раздела" className="flex flex-col">
      {HELP_ITEMS.map((item, index) => (
        <button
          key={item}
          type="button"
          aria-current={index === active ? "true" : undefined}
          onClick={() => setActive(index)}
          className={cn(
            "rounded-[8px] p-3 text-left text-p1-medium text-[var(--modal-title-fg)] outline-none transition-colors focus-visible:focus-ring",
            index === active
              ? "bg-[var(--grey-109)]"
              : "hover:bg-[var(--grey-109)]"
          )}
        >
          {item}
        </button>
      ))}
    </nav>
  )

  const right = (
    <article className="flex flex-col gap-6 pb-2">
      <h3 className="text-h4-adaptive text-[var(--modal-title-fg)]">
        {HELP_ITEMS[active]}
      </h3>
      <div
        aria-hidden="true"
        className="aspect-[480/290] w-full rounded-[12px] border border-[var(--grey-124)] bg-[var(--card-bg)]"
      />
      <p className="text-p1-medium-adaptive text-[var(--modal-title-fg)]">
        {HELP_TEXT}
      </p>
    </article>
  )

  return { left, right }
}

/** Ссылка под заголовком окна — «Подробнее в разделе «Помощь»». */
function HelpLink() {
  return (
    <a
      href="#help"
      onClick={(event) => event.preventDefault()}
      className="text-p1-medium-adaptive text-[var(--modal-title-fg)] underline decoration-from-font underline-offset-auto"
    >
      Подробнее в разделе «Помощь»
    </a>
  )
}

export { HelpLink, useHelpColumns }
