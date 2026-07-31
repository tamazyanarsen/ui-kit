import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * Type scale digitized from ui/typography/01. Typography Object Sans.svg (Figma export,
 * "Actual new" — outlined-text vector, sliced into PNG strips and read visually since the
 * source has no extractable <text> nodes). Size/line-height/spacing are exact spec values;
 * "spacing" is the spec's own third column (paragraphSpacing, px) — kept under a neutral
 * label since the export UI mislabels it "Border".
 */
interface TypeStyle {
  name: string
  sample: string
  weight: 400 | 500 | 800
  link?: boolean
  desktop: { size: number; lineHeight: number; spacing: number }
  mobile: { size: number; lineHeight: number; spacing: number }
}

interface TypeSection {
  name: string
  styles: TypeStyle[]
}

const SECTIONS: TypeSection[] = [
  {
    name: "Заголовок",
    styles: [
      { name: "Factoid", sample: "Factoid", weight: 800, desktop: { size: 68, lineHeight: 68, spacing: 16 }, mobile: { size: 28, lineHeight: 38, spacing: 8 } },
      { name: "H1 Medium", sample: "Заголовок H1", weight: 500, desktop: { size: 44, lineHeight: 56, spacing: 16 }, mobile: { size: 28, lineHeight: 38, spacing: 8 } },
      { name: "H2 Medium", sample: "Заголовок H2", weight: 500, desktop: { size: 32, lineHeight: 44, spacing: 8 }, mobile: { size: 22, lineHeight: 30, spacing: 8 } },
      { name: "H3 Medium", sample: "Заголовок H3", weight: 500, desktop: { size: 24, lineHeight: 32, spacing: 8 }, mobile: { size: 18, lineHeight: 24, spacing: 8 } },
      { name: "H4 Medium", sample: "Заголовок H4", weight: 500, desktop: { size: 20, lineHeight: 28, spacing: 8 }, mobile: { size: 18, lineHeight: 24, spacing: 8 } },
    ],
  },
  {
    name: "Параграф",
    styles: [
      { name: "P1.1 Medium", sample: "Наборный текст первого порядка", weight: 500, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 16, lineHeight: 24, spacing: 8 } },
      { name: "P1 Heavy", sample: "Наборный текст первого порядка", weight: 800, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 14, lineHeight: 20, spacing: 8 } },
      { name: "P1 Medium", sample: "Наборный текст первого порядка", weight: 500, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 14, lineHeight: 20, spacing: 8 } },
      { name: "P1 Regular", sample: "Наборный текст первого порядка", weight: 400, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 14, lineHeight: 20, spacing: 8 } },
      { name: "P2 Heavy", sample: "Наборный текст второго порядка", weight: 800, desktop: { size: 14, lineHeight: 20, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P2 Medium", sample: "Наборный текст второго порядка", weight: 500, desktop: { size: 14, lineHeight: 20, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P2 Regular", sample: "Наборный текст второго порядка", weight: 400, desktop: { size: 14, lineHeight: 20, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P3 Medium", sample: "Хлебные крошки", weight: 500, desktop: { size: 12, lineHeight: 16, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P3 Regular", sample: "Текст ошибки, подписи и Tooltip", weight: 400, desktop: { size: 12, lineHeight: 16, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P4 Regular", sample: "Вспомогательный мелкий текст", weight: 400, desktop: { size: 10, lineHeight: 12, spacing: 8 }, mobile: { size: 10, lineHeight: 12, spacing: 8 } },
    ],
  },
  {
    name: "Ссылка",
    styles: [
      { name: "P1 Link Medium", sample: "Ссылка первого порядка", weight: 500, link: true, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 14, lineHeight: 20, spacing: 8 } },
      { name: "P1 Link Regular", sample: "Ссылка первого порядка", weight: 400, link: true, desktop: { size: 16, lineHeight: 24, spacing: 8 }, mobile: { size: 14, lineHeight: 20, spacing: 8 } },
      { name: "P2 Link Medium", sample: "Ссылка второго порядка", weight: 500, link: true, desktop: { size: 14, lineHeight: 20, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P2 Link Regular", sample: "Ссылка второго порядка", weight: 400, link: true, desktop: { size: 14, lineHeight: 20, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P3 Link Medium", sample: "Ссылка третьего порядка", weight: 500, link: true, desktop: { size: 12, lineHeight: 16, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P3 Link Regular", sample: "Ссылка третьего порядка", weight: 400, link: true, desktop: { size: 12, lineHeight: 16, spacing: 8 }, mobile: { size: 12, lineHeight: 16, spacing: 8 } },
      { name: "P4 Link", sample: "Ссылка четвёртого порядка", weight: 400, link: true, desktop: { size: 10, lineHeight: 12, spacing: 8 }, mobile: { size: 10, lineHeight: 12, spacing: 8 } },
    ],
  },
]

function StyleRow({ style, mode }: { style: TypeStyle; mode: "desktop" | "mobile" }) {
  const spec = style[mode]
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-baseline gap-6 border-b border-[#EFEFEF] py-4 last:border-0">
      <div className="min-w-0">
        <span
          className={style.link ? "underline" : undefined}
          style={{
            fontSize: spec.size,
            lineHeight: `${spec.lineHeight}px`,
            fontWeight: style.weight,
            color: "#252628",
          }}
        >
          {style.sample}
        </span>
        <div className="mt-1 text-xs text-[#999999]">{style.name}</div>
      </div>
      <div className="w-14 text-right text-xs text-[#6D6D6D] tabular-nums">{spec.size}px</div>
      <div className="w-14 text-right text-xs text-[#6D6D6D] tabular-nums">{spec.lineHeight}px</div>
      <div className="w-14 text-right text-xs text-[#6D6D6D] tabular-nums">{spec.spacing}px</div>
    </div>
  )
}

function TypeTable({ mode }: { mode: "desktop" | "mobile" }) {
  return (
    <div className="flex flex-1 flex-col gap-8">
      {SECTIONS.map((section) => (
        <section key={section.name}>
          <h2 className="mb-1 text-sm font-medium text-[#72A716]">{section.name}</h2>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 border-b border-[#DEDEDE] pb-2 text-xs text-[#999999]">
            <span>Style</span>
            <span className="w-14 text-right">Size</span>
            <span className="w-14 text-right">Interligne</span>
            <span className="w-14 text-right">Spacing</span>
          </div>
          {section.styles.map((style) => (
            <StyleRow key={style.name} style={style} mode={mode} />
          ))}
        </section>
      ))}
    </div>
  )
}

function TypographyPage() {
  return (
    <div className="flex flex-col gap-6 bg-white p-8">
      <div>
        <h1 className="text-2xl font-medium text-[#252628]">Типографика — Object Sans</h1>
        <p className="mt-1 text-sm text-[#6D6D6D]">
          Шкала стилей из ui/typography (Desktop / Mobile), Regular 400 / Medium 500 / Heavy 800.
        </p>
      </div>
      <div className="flex flex-col gap-12 lg:flex-row">
        <TypeTable mode="desktop" />
        <TypeTable mode="mobile" />
      </div>
    </div>
  )
}

const meta = {
  title: "Preview/.Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TypographyPage>

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {
  render: () => <TypographyPage />,
}
