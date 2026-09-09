import * as React from "react"

import { BannerDots } from "./header-menu-parts"
import { MenuBanner, type MenuBannerProps } from "./menu-banner"

/**
 * Карусель баннеров в раскрытом меню.
 *
 * Дизайн-чек от 08.09, замечание 4: «Оживить баннер и дать анимацию
 * перелистывания… Правки естественно корневые, относятся к корневому меню, а
 * не к одному песочному экрану». До этого баннеры переключались только
 * точками и подменялись одним кадром — «живости» не было ни на входе, ни при
 * переключении.
 *
 * Что здесь есть:
 *
 *   • стрелки слева и справа, проявляющиеся при наведении на баннер, —
 *     `Banner Switch Button` мастера (нода 70303:53219). Правило из
 *     комментария макета «Наведение на баннеры и на элементы
 *     перелистывания» (нода 70303:58492): «при наведении на баннер
 *     становятся видны элементы перелистывания (стрелки слева и справа)…
 *     область клика — во всю высоту, 32 пикселя от края баннера»;
 *   • лента из всех баннеров со сдвигом `translateX` — карточки ЕДУТ, а не
 *     подменяются; переключение стрелками и точками анимируется тем же
 *     переходом;
 *   • автолистание, пока на карусель не навели курсор и не увели в неё фокус
 *     (иначе она уезжает из-под читающего);
 *   • уважение к `prefers-reduced-motion`: там ни движения, ни автолистания.
 *
 * Листание ЗАЦИКЛЕНО: с последнего баннера «вперёд» ведёт на первый. В макете
 * стрелки нарисованы на всех кадрах одинаково — выключенного состояния у них
 * нет, значит упереться в край нельзя.
 *
 * ⚠️ Интервал автолистания в макете не задан — 6 с выбраны нами: столько
 * хватает прочитать заголовок и подпись баннера (две строки плюс две), и это
 * заметно дольше самой анимации, чтобы карусель не читалась как мигание.
 */
const AUTOPLAY_MS = 6000
const SLIDE_MS = 400

interface BannerCarouselProps {
  banners: MenuBannerProps[]
}

function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const reducedMotion = usePrefersReducedMotion()

  // Набор баннеров может смениться (у разных ролей своя полка) — тогда
  // текущий индекс легко оказывается за пределами нового списка.
  React.useEffect(() => {
    setIndex((prev) => (prev < banners.length ? prev : 0))
  }, [banners.length])

  React.useEffect(() => {
    if (banners.length < 2 || paused || reducedMotion) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [banners.length, paused, reducedMotion])

  if (banners.length === 0) return null

  const many = banners.length > 1
  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + banners.length) % banners.length)

  return (
    <div
      data-slot="menu-banner-carousel"
      className="flex w-full flex-col gap-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="w-full overflow-hidden rounded-[24px]">
        <div
          data-slot="menu-banner-track"
          className="flex w-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: reducedMotion
              ? undefined
              : `transform ${SLIDE_MS}ms ease-out`,
          }}
        >
          {banners.map((banner, position) => (
            <div
              key={position}
              // `shrink-0 basis-full` — каждая карточка ровно в ширину окна
              // ленты. Без `shrink-0` флекс ужал бы все три в одну ширину, и
              // ехать было бы нечему.
              className="w-full shrink-0 basis-full"
              // Уехавшие карточки прячутся от чтения с экрана и от таба:
              // визуально их нет, а кнопка внутри осталась бы фокусируемой.
              aria-hidden={position === index ? undefined : true}
              {...(position === index ? {} : { inert: "" })}
            >
              <MenuBanner
                {...banner}
                // Стрелки только там, где есть что листать: у одиночного
                // баннера кнопок в макете нет.
                onPrev={many ? () => go(-1) : undefined}
                onNext={many ? () => go(1) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
      {many && (
        <BannerDots count={banners.length} active={index} onSelect={setIndex} />
      )}
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])
  return reduced
}

export { BannerCarousel }
export type { BannerCarouselProps }
