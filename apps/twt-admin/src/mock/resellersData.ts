/**
 * 代理商模拟数据
 */

export interface Reseller {
  key: string
  id: string
  name: string
  contact: string
  email: string
  phone: string
  projectCount: number
  commissionRate: number
  totalRevenue: number
  status: 'pending' | 'active' | 'inactive' | 'rejected'
  createdAt: string
  remark: string
}

export const resellersData: Reseller[] = [
  {
    key: '1',
    id: 'reseller-demo',
    name: 'Demo 客服',
    contact: '张三',
    email: 'demo@example.com',
    phone: '13800138000',
    projectCount: 12,
    commissionRate: 30,
    totalRevenue: 125000,
    status: 'active',
    createdAt: '2026-01-15',
    remark: '优质代理商，合作顺利',
  },
  {
    key: '2',
    id: 'reseller-test',
    name: 'Test 客服',
    contact: '李四',
    email: 'test@example.com',
    phone: '13900139000',
    projectCount: 5,
    commissionRate: 25,
    totalRevenue: 48000,
    status: 'inactive',
    createdAt: '2026-02-20',
    remark: '暂时停用，等待重新激活',
  },
  {
    key: '3',
    id: 'reseller-pending',
    name: '待审核代理商',
    contact: '王五',
    email: 'pending@example.com',
    phone: '13700137000',
    projectCount: 0,
    commissionRate: 0,
    totalRevenue: 0,
    status: 'pending',
    createdAt: '2026-04-01',
    remark: '新申请的代理商，待审核',
  },
  {
    key: '4',
    id: 'reseller-alpha',
    name: 'Alpha 科技',
    contact: '赵六',
    email: 'alpha@example.com',
    phone: '13600136000',
    projectCount: 8,
    commissionRate: 28,
    totalRevenue: 89000,
    status: 'active',
    createdAt: '2026-01-20',
    remark: '技术型代理商',
  },
  {
    key: '5',
    id: 'reseller-beta',
    name: 'Beta 服务',
    contact: '孙七',
    email: 'beta@example.com',
    phone: '13500135000',
    projectCount: 15,
    commissionRate: 32,
    totalRevenue: 156000,
    status: 'active',
    createdAt: '2025-12-10',
    remark: '最大的代理商，业绩优秀',
  },
  {
    key: '6',
    id: 'reseller-rejected',
    name: '已拒绝代理商',
    contact: '周八',
    email: 'rejected@example.com',
    phone: '13400134000',
    projectCount: 0,
    commissionRate: 0,
    totalRevenue: 0,
    status: 'rejected',
    createdAt: '2026-03-15',
    remark: '资质不符，已拒绝',
  },
]

export interface ResellerDetail extends Reseller {
  totalOrders: number
  totalCommission: number
}

export function getResellerById(id: string): ResellerDetail | undefined {
  const reseller = resellersData.find(r => r.id === id)
  if (!reseller) return undefined

  return {
    ...reseller,
    totalOrders: Math.floor(reseller.totalRevenue / 9900 * 1.5),
    totalCommission: Math.floor(reseller.totalRevenue * reseller.commissionRate / 100),
  }
}
