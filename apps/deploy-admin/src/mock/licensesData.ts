/**
 * License 模拟数据
 */

export type LicenseStatus = 'active' | 'expired' | 'revoked'

export interface License {
  key: string
  licenseKey: string
  customerId: string
  customerName: string
  plan: string
  maxUsers: number
  features: string[]
  issuedAt: string
  expiresAt: string
  status: LicenseStatus
  lastVerified: string
}

export const licensesData: License[] = [
  {
    key: '1',
    licenseKey: 'LIC-STAR-2026-PRO',
    customerId: 'cust-001',
    customerName: '星辰科技',
    plan: '专业版',
    maxUsers: 500,
    features: ['group-chat', 'file-sharing', 'video-call', 'screen-sharing'],
    issuedAt: '2026-01-10',
    expiresAt: '2027-01-15',
    status: 'active',
    lastVerified: '2026-04-22 08:00:00',
  },
  {
    key: '2',
    licenseKey: 'LIC-BLUE-2026-ENT',
    customerId: 'cust-002',
    customerName: '蓝海金融',
    plan: '企业版',
    maxUsers: 1000,
    features: ['group-chat', 'file-sharing', 'video-call', 'screen-sharing', 'e2ee', 'audit-log'],
    issuedAt: '2026-02-05',
    expiresAt: '2027-06-30',
    status: 'active',
    lastVerified: '2026-04-22 08:00:00',
  },
  {
    key: '3',
    licenseKey: 'LIC-GREEN-2026-STD',
    customerId: 'cust-003',
    customerName: '绿叶教育',
    plan: '标准版',
    maxUsers: 200,
    features: ['group-chat', 'file-sharing'],
    issuedAt: '2026-03-01',
    expiresAt: '2026-12-31',
    status: 'active',
    lastVerified: '2026-04-22 08:00:00',
  },
  {
    key: '4',
    licenseKey: 'LIC-RED-2026-PRO',
    customerId: 'cust-004',
    customerName: '红杉电商',
    plan: '专业版',
    maxUsers: 300,
    features: ['group-chat', 'file-sharing', 'video-call', 'screen-sharing'],
    issuedAt: '2026-04-15',
    expiresAt: '2027-04-20',
    status: 'active',
    lastVerified: '2026-04-22 08:00:00',
  },
  {
    key: '5',
    licenseKey: 'LIC-PURPLE-2025-PRO',
    customerId: 'cust-005',
    customerName: '紫光医疗',
    plan: '专业版',
    maxUsers: 400,
    features: ['group-chat', 'file-sharing', 'video-call', 'screen-sharing'],
    issuedAt: '2025-10-20',
    expiresAt: '2026-03-31',
    status: 'expired',
    lastVerified: '2026-04-01 08:00:00',
  },
  {
    key: '6',
    licenseKey: 'LIC-ORANGE-2025-STD',
    customerId: 'cust-006',
    customerName: '橙光游戏',
    plan: '标准版',
    maxUsers: 250,
    features: ['group-chat', 'file-sharing'],
    issuedAt: '2025-08-15',
    expiresAt: '2025-12-31',
    status: 'revoked',
    lastVerified: '2026-01-01 08:00:00',
  },
]
