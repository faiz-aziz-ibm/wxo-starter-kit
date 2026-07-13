import type { SVGProps } from 'react'

/* Line-based SVG icon set. No emojis anywhere in the UI. */

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const IconCompass = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
)
export const IconDraft = (p: P) => (
  <svg {...base(p)}><path d="M4 20h16" /><path d="M14.5 4.5a2.1 2.1 0 0 1 3 3L8 17l-4 1 1-4 9.5-9.5Z" /></svg>
)
export const IconBuild = (p: P) => (
  <svg {...base(p)}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>
)
export const IconTest = (p: P) => (
  <svg {...base(p)}><path d="M9 3h6" /><path d="M10 3v6.2L5.4 17A2 2 0 0 0 7.1 20h9.8a2 2 0 0 0 1.7-3L14 9.2V3" /><path d="M8 15h8" /></svg>
)
export const IconDeploy = (p: P) => (
  <svg {...base(p)}><path d="M12 3c3.5 2 5 5.5 5 9l-5 3-5-3c0-3.5 1.5-7 5-9Z" /><circle cx="12" cy="10" r="1.7" /><path d="M9 17l-2 4 3-1.5M15 17l2 4-3-1.5" /></svg>
)
export const IconMonitor = (p: P) => (
  <svg {...base(p)}><path d="M3 12h3l2-5 3 11 3-14 2 8h5" /></svg>
)
export const IconAlert = (p: P) => (
  <svg {...base(p)}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.6" fill="currentColor" /></svg>
)
export const IconPlug = (p: P) => (
  <svg {...base(p)}><path d="M9 3v5M15 3v5" /><path d="M7 8h10v3a5 5 0 0 1-10 0V8Z" /><path d="M12 16v5" /></svg>
)
export const IconBook = (p: P) => (
  <svg {...base(p)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /></svg>
)
export const IconSpark = (p: P) => (
  <svg {...base(p)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /><circle cx="12" cy="12" r="2.4" /></svg>
)
export const IconArrow = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m4 12 5 5L20 6" /></svg>
)
export const IconX = (p: P) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const IconCopy = (p: P) => (
  <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
)
export const IconInfo = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="7.6" r="0.6" fill="currentColor" /></svg>
)
export const IconBulb = (p: P) => (
  <svg {...base(p)}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2H14.5c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></svg>
)
export const IconKey = (p: P) => (
  <svg {...base(p)}><circle cx="8" cy="8" r="4.2" /><path d="m11 11 8 8M16 16l2-2M18.5 13.5 20.5 15.5" /></svg>
)
export const IconChat = (p: P) => (
  <svg {...base(p)}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8M8 12h5" /></svg>
)
export const IconRoute = (p: P) => (
  <svg {...base(p)}><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M6 8.4V13a4 4 0 0 0 4 4h5.5" /></svg>
)
export const IconLayers = (p: P) => (
  <svg {...base(p)}><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5M3 18l9 5 9-5" /></svg>
)
export const IconGauge = (p: P) => (
  <svg {...base(p)}><path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-5" /><circle cx="12" cy="18" r="1.2" fill="currentColor" /></svg>
)
export const IconShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const IconWrench = (p: P) => (
  <svg {...base(p)}><path d="M15 4a4.5 4.5 0 0 0-5.7 5.7L4 15v5h5l5.3-5.3A4.5 4.5 0 0 0 20 9l-3 3-3-3 3-3a4.5 4.5 0 0 0-2-1Z" /></svg>
)
export const IconDatabase = (p: P) => (
  <svg {...base(p)}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3" /></svg>
)
export const IconUsers = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.7" /></svg>
)
export const IconMenu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconGithub = (p: P) => (
  <svg {...base(p)}><path d="M9 19c-4 1.4-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.9 2.6 5.9 2.9 5.9 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.5 9.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
)
export const IconTerminal = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></svg>
)
export const IconTarget = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>
)
export const IconClock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
)
export const IconBranch = (p: P) => (
  <svg {...base(p)}><circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="8" r="2.2" /><path d="M6 8.2v7.6M8.2 6H14a2 2 0 0 1 2 2" /></svg>
)
export const IconMap = (p: P) => (
  <svg {...base(p)}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>
)
export const IconDownload = (p: P) => (
  <svg {...base(p)}><path d="M12 3v12M7 11l5 5 5-5" /><path d="M4 20h16" /></svg>
)
export const IconTrophy = (p: P) => (
  <svg {...base(p)}><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /><path d="M10 13.5V17H9v3h6v-3h-1v-3.5" /></svg>
)
export const IconCalculator = (p: P) => (
  <svg {...base(p)}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4" /></svg>
)
