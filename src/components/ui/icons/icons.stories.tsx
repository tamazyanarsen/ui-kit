import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import type { ComponentType, SVGProps } from "react"

import {
  Bell,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CirclePlus,
  CircleUser,
  CircleX,
  Clock,
  Copy,
  Download,
  Ellipsis,
  Eye,
  EyeOff,
  FileIcon,
  FileText,
  ImageIcon,
  Info,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Menu,
  Minus,
  Pencil,
  Search,
  Settings,
  Star,
  Wallet,
  X,
} from "@/icons"

const ICONS: { name: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { name: "Bell", Icon: Bell },
  { name: "Briefcase", Icon: Briefcase },
  { name: "CalendarDays", Icon: CalendarDays },
  { name: "Check", Icon: Check },
  { name: "ChevronDown", Icon: ChevronDown },
  { name: "ChevronLeft", Icon: ChevronLeft },
  { name: "ChevronRight", Icon: ChevronRight },
  { name: "ChevronsUpDown", Icon: ChevronsUpDown },
  { name: "ChevronUp", Icon: ChevronUp },
  { name: "CircleAlert", Icon: CircleAlert },
  { name: "CircleCheck", Icon: CircleCheck },
  { name: "CircleHelp", Icon: CircleHelp },
  { name: "CirclePlus", Icon: CirclePlus },
  { name: "CircleUser", Icon: CircleUser },
  { name: "CircleX", Icon: CircleX },
  { name: "Clock", Icon: Clock },
  { name: "Copy", Icon: Copy },
  { name: "Download", Icon: Download },
  { name: "Ellipsis", Icon: Ellipsis },
  { name: "Eye", Icon: Eye },
  { name: "EyeOff", Icon: EyeOff },
  { name: "FileIcon", Icon: FileIcon },
  { name: "FileText", Icon: FileText },
  { name: "ImageIcon", Icon: ImageIcon },
  { name: "Info", Icon: Info },
  { name: "Loader2", Icon: Loader2 },
  { name: "Lock", Icon: Lock },
  { name: "LogOut", Icon: LogOut },
  { name: "Mail", Icon: Mail },
  { name: "Menu", Icon: Menu },
  { name: "Minus", Icon: Minus },
  { name: "Pencil", Icon: Pencil },
  { name: "Search", Icon: Search },
  { name: "Settings", Icon: Settings },
  { name: "Star", Icon: Star },
  { name: "Wallet", Icon: Wallet },
  { name: "X", Icon: X },
]

function IconTile({ name, Icon }: { name: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { ${name} } from "@/icons"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex flex-col items-center gap-3 rounded-xl border border-[#DEDEDE] bg-white p-4 text-center transition-colors hover:border-[#999999] hover:bg-[#F8F8F8]"
    >
      <Icon className="size-6 text-[#252628]" />
      <span className="text-xs text-[#6D6D6D]">{copied ? "Скопировано" : name}</span>
    </button>
  )
}

function IconsPage() {
  return (
    <div className="flex flex-col gap-6 bg-white p-8">
      <div>
        <h1 className="text-2xl font-medium text-[#252628]">Иконки</h1>
        <p className="mt-1 text-sm text-[#6D6D6D]">
          Все {ICONS.length} иконок из src/icons. Клик по плитке копирует строку импорта. Цвет наследуется от
          text-color (currentColor) — управляется className.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {ICONS.map((item) => (
          <IconTile key={item.name} name={item.name} Icon={item.Icon} />
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: "Preview/.Icons",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof IconsPage>

export default meta
type Story = StoryObj<typeof meta>

export const AllIcons: Story = {
  render: () => <IconsPage />,
}
