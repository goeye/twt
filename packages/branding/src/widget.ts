import type { QuickAccessActionType, QuickAccessItem, TenantConfig } from './types'

const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`

export const FEEDBACK_QUICK_ACCESS_ICON = svgToDataUri(`
  <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'>
    <defs>
      <linearGradient id='feedback-gradient' x1='8' y1='7' x2='35' y2='36' gradientUnits='userSpaceOnUse'>
        <stop stop-color='#8EC5FF'/>
        <stop offset='1' stop-color='#2F6BFF'/>
      </linearGradient>
    </defs>
    <path d='M8 15.5c0-5 4-9 9-9h8c5 0 9 4 9 9v7c0 5-4 9-9 9h-5.2L14 35c-1 .7-2.3 0-2.3-1.2v-3.2c-2.3-1.5-3.7-4-3.7-6.9v-8.2z' fill='url(#feedback-gradient)'/>
    <circle cx='17.2' cy='19.6' r='1.5' fill='white'/>
    <circle cx='22' cy='19.6' r='1.5' fill='white'/>
    <circle cx='26.8' cy='19.6' r='1.5' fill='white'/>
    <circle cx='31.5' cy='31.5' r='5.5' fill='#21C45D' stroke='white' stroke-width='2'/>
  </svg>
`)

export const QUICK_ACCESS_ICON_PRESETS = {
  telegram: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'>
      <defs>
        <linearGradient id='telegram-gradient' x1='8' y1='7' x2='36' y2='37' gradientUnits='userSpaceOnUse'>
          <stop stop-color='#53C7FF'/>
          <stop offset='1' stop-color='#2A74F5'/>
        </linearGradient>
      </defs>
      <circle cx='22' cy='22' r='20' fill='url(#telegram-gradient)'/>
      <path d='M31.6 13.8 28.2 30c-.3 1.4-1.2 1.8-2.4 1.1l-5.3-3.9-2.6 2.5c-.3.3-.6.6-1.2.6l.5-5.5 10-9.1c.4-.4-.1-.6-.7-.2l-12.3 7.7-5.3-1.7c-1.2-.4-1.2-1.2.3-1.8l20.6-7.9c1-.4 1.9.2 1.6 1.9z' fill='white'/>
    </svg>
  `),
  facebook: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'>
      <circle cx='22' cy='22' r='20' fill='#1877F2'/>
      <path d='M24.8 33V23.8h3.1l.5-3.6h-3.6v-2.3c0-1 .3-1.8 1.9-1.8h1.9V13a22.4 22.4 0 0 0-3.3-.3c-3.3 0-5.5 2-5.5 5.6v1.9h-3.7v3.6h3.7V33h5z' fill='white'/>
    </svg>
  `),
  linkedin: svgToDataUri(`
    <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44' fill='none'>
      <circle cx='22' cy='22' r='20' fill='#0A66C2'/>
      <circle cx='16.2' cy='15.3' r='2.4' fill='white'/>
      <rect x='14' y='19' width='4.4' height='12.5' rx='1.2' fill='white'/>
      <path d='M21.3 19h4.2v1.7c.7-1.2 2-2.2 4.2-2.2 4 0 5.3 2.6 5.3 6.5v6.5h-4.4v-5.8c0-1.7-.6-3.4-2.6-3.4s-3 1.5-3 3.4v5.8h-4.4V19z' fill='white'/>
    </svg>
  `)
} as const

export const DEFAULT_QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: 'qa-telegram',
    label: 'Telegram',
    url: 'https://telegram.org/',
    icon: QUICK_ACCESS_ICON_PRESETS.telegram,
    actionType: 'link'
  },
  {
    id: 'qa-facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/',
    icon: QUICK_ACCESS_ICON_PRESETS.facebook,
    actionType: 'link'
  },
  {
    id: 'qa-linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    icon: QUICK_ACCESS_ICON_PRESETS.linkedin,
    actionType: 'link'
  }
]

const cloneQuickAccessItem = (item: QuickAccessItem): QuickAccessItem => ({ ...item })

const isQuickAccessActionType = (value: unknown): value is QuickAccessActionType =>
  value === 'link' || value === 'copy' || value === 'message'

export const getDefaultQuickAccessItems = (): QuickAccessItem[] =>
  DEFAULT_QUICK_ACCESS_ITEMS.map(cloneQuickAccessItem)

export function getWidgetQuickAccessItems(
  config?: Pick<TenantConfig, 'metadata'> | null
): QuickAccessItem[] {
  const rawItems = config?.metadata?.widget?.quickAccessItems

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return getDefaultQuickAccessItems()
  }

  const normalized = rawItems.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const candidate = item as Partial<QuickAccessItem>
    const label = typeof candidate.label === 'string' ? candidate.label.trim() : ''
    const icon = typeof candidate.icon === 'string' ? candidate.icon : undefined
    const url = typeof candidate.url === 'string' && candidate.url.trim() ? candidate.url.trim() : '#'

    if (!label && !icon) {
      return []
    }

    return [{
      id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `qa-${index + 1}`,
      label,
      url,
      icon,
      actionType: isQuickAccessActionType(candidate.actionType) ? candidate.actionType : undefined,
      faqId: typeof candidate.faqId === 'string' ? candidate.faqId : undefined
    }]
  })

  return normalized.length > 0 ? normalized : getDefaultQuickAccessItems()
}
