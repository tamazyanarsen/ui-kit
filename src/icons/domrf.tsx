import type { IconProps } from "./types"

// icon / DOMRF — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Domrf({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M7.681 12.475H12.928V1H7.681V12.475ZM9.047 11.202H11.561V2.29H9.047V11.202Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M1 13.918H23V15.039H1V13.918Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M1 23H2.35V21.489H10.06V16.295H1V23ZM2.35 20.165H8.71V17.636H2.35V20.165Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M17.736 2.29V12.475H19.086V4.819L21.583 2.29V12.475H22.95V1.016H21.026L19.086 2.986V1.016H17.18L13.89 4.344V12.475H15.239V4.819L17.736 2.29Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M11.494 21.489H16.505V23H17.888V21.489H22.933V16.295H11.494V21.489ZM17.905 20.165H21.617V17.636H17.905V20.165ZM12.827 20.165H16.522V17.636H12.827V20.165Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M6.247 12.475V1H4.324L1 4.327V12.475H6.247ZM2.383 4.819L4.897 2.273V11.202H2.383V4.819Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="56.000 440.000 16.000 16.000" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs><clipPath id="domrf-16-clip1_70326_26"> <rect width="16" height="16" fill="white" transform="translate(56 440)" /> </clipPath></defs><g clipPath="url(#domrf-16-clip1_70326_26)"> <g> <path fillRule="evenodd" clipRule="evenodd" d="M61.121 448.317H64.619V440.667H61.121V448.317ZM62.032 447.468H63.708V441.527H62.032V447.468Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M56.667 449.279H71.334V450.026H56.667V449.279Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M56.667 455.333H57.567V454.326H62.707V450.863H56.667V455.333ZM57.567 453.443H61.807V451.757H57.567V453.443Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M67.825 441.526V448.316H68.724V443.213L70.389 441.526V448.316H71.3V440.678H70.018L68.724 441.99V440.678H67.453L65.26 442.896V448.316H66.16V443.213L67.825 441.526Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M63.663 454.326H67.004V455.333H67.926V454.326H71.289V450.863H63.663V454.326ZM67.937 453.443H70.412V451.757H67.937V453.443ZM64.552 453.443H67.015V451.757H64.552V453.443Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M60.165 448.317V440.667H58.883L56.667 442.885V448.317H60.165ZM57.589 443.213L59.265 441.515V447.468H57.589V443.213Z" fill="currentColor" /> </g> </g>
    </svg>
  )
}
