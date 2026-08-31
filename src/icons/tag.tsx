import type { IconProps } from "./types"

// icon / tag — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Tag({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.518 8.756a1.24 1.24 0 1 0 0-2.479 1.24 1.24 0 0 0 0 2.479"/><path fill="currentColor" fillRule="evenodd" d="M11.451.463c.322-.056.65.047.881.278l10.543 10.543a2 2 0 0 1 0 2.828l-8.586 8.586a2 2 0 0 1-2.828 0L.918 12.155a1 1 0 0 1-.278-.881l1.5-8.5c.073-.413.397-.737.811-.811zM3.988 3.811 2.7 11.109l10.175 10.175 8.586-8.586L11.286 2.524z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.51.224c.319-.053.644.051.872.279l6.852 6.852a1 1 0 0 1 0 1.414l-6.189 6.188a1 1 0 0 1-1.414 0L.78 8.106a1 1 0 0 1-.28-.872l.884-5.304.038-.153a1 1 0 0 1 .784-.669zM3.24 2.963l-.683 4.092 5.781 5.781 4.775-4.774L7.331 2.28zM4.584 4.3a1 1 0 1 1 1.415 1.414A1 1 0 0 1 4.584 4.3"/></svg>
  )
}
