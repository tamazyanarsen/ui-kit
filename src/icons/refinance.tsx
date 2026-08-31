import type { IconProps } from "./types"

// icon / refinance — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Refinance({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12.464 9.703a1 1 0 0 1 1.415 0l2.828 2.828a1 1 0 0 1 0 1.415l-2.828 2.828a1 1 0 0 1-1.415-1.414l2.122-2.122-2.122-2.121a1 1 0 0 1 0-1.414" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M7 15.238a3 3 0 0 1 3-3h6a1 1 0 0 1 0 2h-6a1 1 0 0 0-1 1v1a1 1 0 0 1-2 0z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M4.565 5a.55.55 0 0 0-.392.168A.62.62 0 0 0 4 5.6a.62.62 0 0 0 .173.432.55.55 0 0 0 .392.168h15.652c.48 0 .936.195 1.269.535.331.339.514.795.514 1.265v11.2c0 .47-.183.926-.514 1.265-.333.34-.789.535-1.269.535H4.565a2.55 2.55 0 0 1-1.821-.769A2.62 2.62 0 0 1 2 18.4V5.6c0-.683.265-1.341.744-1.831A2.55 2.55 0 0 1 4.565 3H17.87a1 1 0 0 1 0 2zM4 8.136V18.4a.62.62 0 0 0 .173.432.55.55 0 0 0 .392.168H20V8.2H4.565q-.289 0-.565-.064" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M12 1a1 1 0 0 1 0 2H3.5a.5.5 0 0 0 0 1H14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a3 3 0 0 1-3-3V3.5A2.5 2.5 0 0 1 3.5 1zM3 12a1 1 0 0 0 1 1h9V6H3.5q-.257 0-.5-.051zm6.293-4.707a1 1 0 0 1 1.414 0l1.5 1.5a1 1 0 0 1 0 1.414l-1.5 1.5A.999.999 0 0 1 9.136 10.5H6.5a.5.5 0 0 0-.5.5 1 1 0 0 1-2 0 2.5 2.5 0 0 1 2.5-2.5h2.635a1 1 0 0 1 .158-1.207"/></svg>
  )
}
