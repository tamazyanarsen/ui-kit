import type { IconProps } from "./types"

// Глифа «заглушка изображения» на страницах макета, доступных из этого
// файла, не нашлось: поиск по дизайн-системе отдаёт только
// «icons/Placeholder/Images» из внешней библиотеки «Assets», которая
// отсюда недостижима — та же история, что у Pencil. Нарисован от руки
// (собран из примитивов, а не обведён) под ту же толщину и тот же
// viewBox, что у остального набора, чтобы не тащить lucide-react.
export function ImageIcon({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><rect width="13" height="11" x="1.5" y="2.5" stroke="currentColor" strokeWidth="1.2" rx="1.4"/><circle cx="5.5" cy="6" r="1.25" fill="currentColor"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="m2 11.5 3.3-3.3a1 1 0 0 1 1.4 0L9 10.5l1.6-1.6a1 1 0 0 1 1.4 0l2.5 2.6"/></svg>
  )
}
