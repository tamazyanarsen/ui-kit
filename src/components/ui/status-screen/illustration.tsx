import attentionAvif from "@/assets/status-screen/attention.avif"
import attentionWebp from "@/assets/status-screen/attention.webp"
import clockAvif from "@/assets/status-screen/clock.avif"
import clockWebp from "@/assets/status-screen/clock.webp"
import editAvif from "@/assets/status-screen/edit.avif"
import editWebp from "@/assets/status-screen/edit.webp"
import errorAvif from "@/assets/status-screen/error.avif"
import errorWebp from "@/assets/status-screen/error.webp"
import lockAvif from "@/assets/status-screen/lock.avif"
import lockWebp from "@/assets/status-screen/lock.webp"
import questionAvif from "@/assets/status-screen/question.avif"
import questionWebp from "@/assets/status-screen/question.webp"
import searchAttentionAvif from "@/assets/status-screen/search-attention.avif"
import searchAttentionWebp from "@/assets/status-screen/search-attention.webp"
import searchAvif from "@/assets/status-screen/search.avif"
import searchWebp from "@/assets/status-screen/search.webp"
import successAvif from "@/assets/status-screen/success.avif"
import successWebp from "@/assets/status-screen/success.webp"
import timeAttentionAvif from "@/assets/status-screen/time-attention.avif"
import timeAttentionWebp from "@/assets/status-screen/time-attention.webp"

import { cn } from "@/lib/utils"
import { Picture } from "@/lib/picture"

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
const STATUS_IMAGE: Record<StatusType, { avif: string; webp: string }> = {
  attention: { avif: attentionAvif, webp: attentionWebp },
  clock: { avif: clockAvif, webp: clockWebp },
  edit: { avif: editAvif, webp: editWebp },
  error: { avif: errorAvif, webp: errorWebp },
  lock: { avif: lockAvif, webp: lockWebp },
  question: { avif: questionAvif, webp: questionWebp },
  "search-attention": { avif: searchAttentionAvif, webp: searchAttentionWebp },
  search: { avif: searchAvif, webp: searchWebp },
  success: { avif: successAvif, webp: successWebp },
  "time-attention": { avif: timeAttentionAvif, webp: timeAttentionWebp },
}

function StatusIllustration({
  status,
  className,
}: {
  status: StatusType
  className?: string
}) {
  return (
    <Picture
      avif={STATUS_IMAGE[status].avif}
      webp={STATUS_IMAGE[status].webp}
      alt=""
      aria-hidden="true"
      width={232}
      height={176}
      className={cn("h-44 w-58 shrink-0 object-contain", className)}
    />
  )
}

export { StatusIllustration }
