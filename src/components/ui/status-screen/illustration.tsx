import attentionImg from "@/assets/status-screen/attention.png"
import clockImg from "@/assets/status-screen/clock.png"
import editImg from "@/assets/status-screen/edit.png"
import errorImg from "@/assets/status-screen/error.png"
import lockImg from "@/assets/status-screen/lock.png"
import questionImg from "@/assets/status-screen/question.png"
import searchAttentionImg from "@/assets/status-screen/search-attention.png"
import searchImg from "@/assets/status-screen/search.png"
import successImg from "@/assets/status-screen/success.png"
import timeAttentionImg from "@/assets/status-screen/time-attention.png"

import { cn } from "@/lib/utils"

import type { StatusType } from "./variants"

/**
 * Status IMG (ELK) — иллюстрация экрана результата (нода 47962:53070).
 *
 * Дизайн-чек 3/3 №16: «должны быть объёмные изображения». Раньше здесь
 * сознательно стояла заглушка — плоская цветная плашка 64×64 с иконкой, по
 * тому же решению, что и у ErrorPage: «3D-маскот — авторская иллюстрация,
 * вендорить её не будем». Претензия принята: у каждого из десяти статусов в
 * макете свой отдельный 3D-кадр, и подменять их иконкой нельзя.
 *
 * Кадры выгружены из Figma как ИСХОДНЫЕ растры заливок (`download_assets`,
 * ветка `rawImages`) — 264×204 каждый. Через `get_design_context` они не
 * выгружаются: там слой «image» отдаётся как vector, и PNG-экспорт возвращает
 * пустую прозрачную картинку 1024×792 (проверено по alpha — она нулевая).
 *
 * В макете кадр рисуется в коробке 232×176; тень — отдельный слой под ним,
 * но она уже впечатана в сам растр, поэтому отдельным элементом не рисуется.
 */
const STATUS_IMAGE: Record<StatusType, string> = {
  success: successImg,
  error: errorImg,
  attention: attentionImg,
  question: questionImg,
  search: searchImg,
  clock: clockImg,
  lock: lockImg,
  edit: editImg,
  "search-attention": searchAttentionImg,
  "time-attention": timeAttentionImg,
}

function StatusIllustration({
  status,
  className,
}: {
  status: StatusType
  className?: string
}) {
  return (
    <img
      src={STATUS_IMAGE[status]}
      alt=""
      aria-hidden="true"
      width={232}
      height={176}
      className={cn("h-44 w-58 shrink-0 object-contain", className)}
    />
  )
}

export { StatusIllustration }
