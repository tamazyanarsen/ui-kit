import type { IconProps } from "./types"

// icon / paper plane tilt — 11. Call Message, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function PaperPlaneTilt({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M20.259 1.582a1.74 1.74 0 0 1 .917-.009 1.74 1.74 0 0 1 1.251 1.251 1.74 1.74 0 0 1-.009.917l-4.927 17.468a1.752 1.752 0 0 1-3.266.274l-3.763-7.945-7.946-3.764a1.745 1.745 0 0 1-.994-1.728 1.75 1.75 0 0 1 1.269-1.537zm.113 2.046L3.975 8.252l7.029 3.33 3.744-3.745a1 1 0 0 1 1.414 1.415l-3.744 3.744 3.329 7.028z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.535 1.251a1 1 0 0 1 1.096 1.255L11.45 14.173a1 1 0 0 1-1.821.252l-3.054-5.09-5.09-3.054a1 1 0 0 1 .252-1.821l11.667-3.182zM4.523 5.772l2.624 1.576 1.57-1.57a1 1 0 0 1 1.414 1.414l-1.57 1.57 1.575 2.624 2.107-7.719z"/></svg>
  )
}
