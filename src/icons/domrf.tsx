import type { IconProps } from "./types"

// icon / DOMRF — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Domrf({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7.681 12.475h5.247V1H7.681zm1.366-1.273h2.514V2.29H9.047zM1 13.918h22v1.121H1zM1 23h1.35v-1.511h7.71v-5.194H1zm1.35-2.835h6.36v-2.529H2.35zM17.736 2.29v10.185h1.35V4.819l2.497-2.529v10.185h1.367V1.016h-1.924l-1.94 1.97v-1.97H17.18l-3.29 3.328v8.131h1.349V4.819zm-6.242 19.199h5.011V23h1.383v-1.511h5.045v-5.194H11.494zm6.411-1.324h3.712v-2.529h-3.712zm-5.078 0h3.695v-2.529h-3.695zm-6.58-7.69V1H4.324L1 4.327v8.148zM2.383 4.819l2.514-2.546v8.929H2.383z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -440)"><defs><clipPath id="domrf-16-clip1_70326_26"><path fill="#fff" d="M56 440h16v16H56z"/></clipPath></defs><g fill="currentColor" fillRule="evenodd" clipPath="url(#domrf-16-clip1_70326_26)" clipRule="evenodd"><path d="M61.121 448.317h3.498v-7.65h-3.498zm.911-.849h1.676v-5.941h-1.676zm-5.365 1.811h14.667v.747H56.667zm0 6.054h.9v-1.007h5.14v-3.463h-6.04zm.9-1.89h4.24v-1.686h-4.24zm10.258-11.917v6.79h.899v-5.103l1.665-1.687v6.79h.911v-7.638h-1.282l-1.294 1.312v-1.312h-1.271l-2.193 2.218v5.42h.9v-5.103zm-4.162 12.8h3.341v1.007h.922v-1.007h3.363v-3.463h-7.626zm4.274-.883h2.475v-1.686h-2.475zm-3.385 0h2.463v-1.686h-2.463zm-4.387-5.126v-7.65h-1.282l-2.216 2.218v5.432zm-2.576-5.104 1.676-1.698v5.953h-1.676z"/></g></g></svg>
  )
}
