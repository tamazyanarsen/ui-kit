import type { IconProps } from "./types"

// В выгрузке макета это угловой (конический) градиент — от прозрачного к
// плотному примерно на 360°, то есть «хвост» спиннера, — и задан он
// метаданными `data-figma-gradient-fill`. Это внутренний формат макета, а
// не настоящий SVG: браузеры его игнорируют, вставить как есть нельзя, и
// собственного конического градиента в SVG тоже нет. Здесь тот же
// затухающий хвост набран секторами-клиньями `donut` (кольцо: внешний
// r=12, внутренний r=7.8 — геометрия как в выгрузке), а прозрачность
// нарастает от 0 до 1 по кругу. Цвет берётся из `currentColor`, а не
// зашит синим, чтобы иконка и дальше наследовала цвет места установки
// (серый у input.tsx, акцент под вариант у button.tsx и так далее — всё
// это уже задано через className и не менялось с тех пор, как в этом
// файле появилась настоящая разметка).
export function Loader2({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.000 0.000 A12 12 0 0 1 14.337 0.230 L13.519 4.349 A7.8 7.8 0 0 0 12.000 4.200 Z" fill="currentColor" fillOpacity={0.004} />
      <path d="M14.337 0.230 A12 12 0 0 1 16.584 0.910 L14.980 4.792 A7.8 7.8 0 0 0 13.519 4.349 Z" fill="currentColor" fillOpacity={0.012} />
      <path d="M16.584 0.910 A12 12 0 0 1 18.656 2.015 L16.326 5.510 A7.8 7.8 0 0 0 14.980 4.792 Z" fill="currentColor" fillOpacity={0.023} />
      <path d="M18.656 2.015 A12 12 0 0 1 20.473 3.502 L17.507 6.476 A7.8 7.8 0 0 0 16.326 5.510 Z" fill="currentColor" fillOpacity={0.036} />
      <path d="M20.473 3.502 A12 12 0 0 1 21.965 5.315 L18.477 7.655 A7.8 7.8 0 0 0 17.507 6.476 Z" fill="currentColor" fillOpacity={0.051} />
      <path d="M21.965 5.315 A12 12 0 0 1 23.076 7.383 L19.200 8.999 A7.8 7.8 0 0 0 18.477 7.655 Z" fill="currentColor" fillOpacity={0.069} />
      <path d="M23.076 7.383 A12 12 0 0 1 23.763 9.629 L19.646 10.459 A7.8 7.8 0 0 0 19.200 8.999 Z" fill="currentColor" fillOpacity={0.088} />
      <path d="M23.763 9.629 A12 12 0 0 1 24.000 11.965 L19.800 11.977 A7.8 7.8 0 0 0 19.646 10.459 Z" fill="currentColor" fillOpacity={0.109} />
      <path d="M24.000 11.965 A12 12 0 0 1 23.777 14.302 L19.655 13.496 A7.8 7.8 0 0 0 19.800 11.977 Z" fill="currentColor" fillOpacity={0.131} />
      <path d="M23.777 14.302 A12 12 0 0 1 23.103 16.551 L19.217 14.958 A7.8 7.8 0 0 0 19.655 13.496 Z" fill="currentColor" fillOpacity={0.156} />
      <path d="M23.103 16.551 A12 12 0 0 1 22.004 18.627 L18.503 16.307 A7.8 7.8 0 0 0 19.217 14.958 Z" fill="currentColor" fillOpacity={0.181} />
      <path d="M22.004 18.627 A12 12 0 0 1 20.523 20.448 L17.540 17.491 A7.8 7.8 0 0 0 18.503 16.307 Z" fill="currentColor" fillOpacity={0.208} />
      <path d="M20.523 20.448 A12 12 0 0 1 18.714 21.946 L16.364 18.465 A7.8 7.8 0 0 0 17.540 17.491 Z" fill="currentColor" fillOpacity={0.237} />
      <path d="M18.714 21.946 A12 12 0 0 1 16.649 23.063 L15.022 19.191 A7.8 7.8 0 0 0 16.364 18.465 Z" fill="currentColor" fillOpacity={0.266} />
      <path d="M16.649 23.063 A12 12 0 0 1 14.406 23.756 L13.564 19.642 A7.8 7.8 0 0 0 15.022 19.191 Z" fill="currentColor" fillOpacity={0.298} />
      <path d="M14.406 23.756 A12 12 0 0 1 12.070 24.000 L12.046 19.800 A7.8 7.8 0 0 0 13.564 19.642 Z" fill="currentColor" fillOpacity={0.330} />
      <path d="M12.070 24.000 A12 12 0 0 1 9.732 23.784 L10.526 19.659 A7.8 7.8 0 0 0 12.046 19.800 Z" fill="currentColor" fillOpacity={0.363} />
      <path d="M9.732 23.784 A12 12 0 0 1 7.481 23.117 L9.063 19.226 A7.8 7.8 0 0 0 10.526 19.659 Z" fill="currentColor" fillOpacity={0.398} />
      <path d="M7.481 23.117 A12 12 0 0 1 5.403 22.024 L7.712 18.516 A7.8 7.8 0 0 0 9.063 19.226 Z" fill="currentColor" fillOpacity={0.434} />
      <path d="M5.403 22.024 A12 12 0 0 1 3.577 20.547 L6.525 17.556 A7.8 7.8 0 0 0 7.712 18.516 Z" fill="currentColor" fillOpacity={0.471} />
      <path d="M3.577 20.547 A12 12 0 0 1 2.074 18.744 L5.548 16.383 A7.8 7.8 0 0 0 6.525 17.556 Z" fill="currentColor" fillOpacity={0.510} />
      <path d="M2.074 18.744 A12 12 0 0 1 0.951 16.682 L4.818 15.043 A7.8 7.8 0 0 0 5.548 16.383 Z" fill="currentColor" fillOpacity={0.549} />
      <path d="M0.951 16.682 A12 12 0 0 1 0.251 14.440 L4.363 13.586 A7.8 7.8 0 0 0 4.818 15.043 Z" fill="currentColor" fillOpacity={0.590} />
      <path d="M0.251 14.440 A12 12 0 0 1 0.000 12.106 L4.200 12.069 A7.8 7.8 0 0 0 4.363 13.586 Z" fill="currentColor" fillOpacity={0.631} />
      <path d="M0.000 12.106 A12 12 0 0 1 0.210 9.767 L4.336 10.549 A7.8 7.8 0 0 0 4.200 12.069 Z" fill="currentColor" fillOpacity={0.674} />
      <path d="M0.210 9.767 A12 12 0 0 1 0.870 7.514 L4.766 9.084 A7.8 7.8 0 0 0 4.336 10.549 Z" fill="currentColor" fillOpacity={0.717} />
      <path d="M0.870 7.514 A12 12 0 0 1 1.957 5.432 L5.472 7.731 A7.8 7.8 0 0 0 4.766 9.084 Z" fill="currentColor" fillOpacity={0.762} />
      <path d="M1.957 5.432 A12 12 0 0 1 3.428 3.602 L6.428 6.542 A7.8 7.8 0 0 0 5.472 7.731 Z" fill="currentColor" fillOpacity={0.808} />
      <path d="M3.428 3.602 A12 12 0 0 1 5.227 2.094 L7.598 5.561 A7.8 7.8 0 0 0 6.428 6.542 Z" fill="currentColor" fillOpacity={0.854} />
      <path d="M5.227 2.094 A12 12 0 0 1 7.286 0.965 L8.936 4.827 A7.8 7.8 0 0 0 7.598 5.561 Z" fill="currentColor" fillOpacity={0.902} />
      <path d="M7.286 0.965 A12 12 0 0 1 9.525 0.258 L10.391 4.368 A7.8 7.8 0 0 0 8.936 4.827 Z" fill="currentColor" fillOpacity={0.950} />
      <path d="M9.525 0.258 A12 12 0 0 1 11.859 0.001 L11.908 4.201 A7.8 7.8 0 0 0 10.391 4.368 Z" fill="currentColor" fillOpacity={1.000} />
    </svg>
  )
}
