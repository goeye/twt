/**
 * 私有化部署客户模拟数据
 */

export type DeployStatus = 'pending' | 'running' | 'suspended' | 'offline'
export type ServiceStatus = 'connected' | 'disconnected' | 'unconfigured'

export interface ServiceConfig {
  storage: { provider: string; bucket: string; region: string; status: ServiceStatus }
  push: { apns: ServiceStatus; fcm: ServiceStatus }
  email: { provider: string; fromEmail: string; status: ServiceStatus }
}

export interface RegistryCredential {
  username: string
  password: string
  registry: string
  createdAt: string
}

export interface Customer {
  key: string
  id: string
  name: string
  contact: string
  email: string
  phone: string
  deployStatus: DeployStatus
  currentVersion: string
  domain: string
  serverIp: string
  maxUsers: number
  activeUsers: number
  licenseKey: string
  licenseExpiry: string
  plan: string
  serviceConfig: ServiceConfig
  registryCredential: RegistryCredential
  createdAt: string
  remark: string
}

export const customersData: Customer[] = [
  {
    key: '1',
    id: 'cust-001',
    name: '星辰科技',
    contact: '张明',
    email: 'zhangming@starcorp.com',
    phone: '13800001001',
    deployStatus: 'running',
    currentVersion: 'v2.3.1',
    domain: 'link.starcorp.com',
    serverIp: '47.96.12.34',
    maxUsers: 500,
    activeUsers: 320,
    licenseKey: 'LIC-STAR-2026-PRO',
    licenseExpiry: '2027-01-15',
    plan: '专业版',
    serviceConfig: {
      storage: { provider: 'aliyun', bucket: 'star-link', region: 'cn-hangzhou', status: 'connected' },
      push: { apns: 'connected', fcm: 'connected' },
      email: { provider: 'aliyun', fromEmail: 'noreply@starcorp.com', status: 'connected' },
    },
    registryCredential: {
      username: 'starcorp',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2026-01-10',
    },
    createdAt: '2026-01-10',
    remark: '首批私有化客户，运行稳定',
  },
  {
    key: '2',
    id: 'cust-002',
    name: '蓝海金融',
    contact: '李婷',
    email: 'liting@blueocean.com',
    phone: '13900002002',
    deployStatus: 'running',
    currentVersion: 'v2.2.0',
    domain: 'link.blueocean.com',
    serverIp: '120.55.78.90',
    maxUsers: 1000,
    activeUsers: 670,
    licenseKey: 'LIC-BLUE-2026-ENT',
    licenseExpiry: '2027-06-30',
    plan: '企业版',
    serviceConfig: {
      storage: { provider: 'aws', bucket: 'blueocean-link', region: 'ap-southeast-1', status: 'connected' },
      push: { apns: 'connected', fcm: 'connected' },
      email: { provider: 'smtp', fromEmail: 'support@blueocean.com', status: 'connected' },
    },
    registryCredential: {
      username: 'blueocean',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2026-02-05',
    },
    createdAt: '2026-02-05',
    remark: '金融客户，对数据安全要求高',
  },
  {
    key: '3',
    id: 'cust-003',
    name: '绿叶教育',
    contact: '王强',
    email: 'wangqiang@greenedu.cn',
    phone: '13700003003',
    deployStatus: 'running',
    currentVersion: 'v2.3.1',
    domain: 'link.greenedu.cn',
    serverIp: '116.62.33.45',
    maxUsers: 200,
    activeUsers: 120,
    licenseKey: 'LIC-GREEN-2026-STD',
    licenseExpiry: '2026-12-31',
    plan: '标准版',
    serviceConfig: {
      storage: { provider: 'qiniu', bucket: 'green-edu-link', region: 'cn-east-1', status: 'connected' },
      push: { apns: 'connected', fcm: 'disconnected' },
      email: { provider: 'smtp', fromEmail: 'cs@greenedu.cn', status: 'connected' },
    },
    registryCredential: {
      username: 'greenedu',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2026-03-01',
    },
    createdAt: '2026-03-01',
    remark: '教育行业客户，运行稳定',
  },
  {
    key: '4',
    id: 'cust-004',
    name: '红杉电商',
    contact: '赵丽',
    email: 'zhaoli@redwood.shop',
    phone: '13600004004',
    deployStatus: 'pending',
    currentVersion: '-',
    domain: 'link.redwood.shop',
    serverIp: '47.100.22.88',
    maxUsers: 300,
    activeUsers: 0,
    licenseKey: 'LIC-RED-2026-PRO',
    licenseExpiry: '2027-04-20',
    plan: '专业版',
    serviceConfig: {
      storage: { provider: 'aliyun', bucket: '', region: '', status: 'unconfigured' },
      push: { apns: 'unconfigured', fcm: 'unconfigured' },
      email: { provider: '', fromEmail: '', status: 'unconfigured' },
    },
    registryCredential: {
      username: 'redwood',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2026-04-15',
    },
    createdAt: '2026-04-15',
    remark: '新签约客户，待部署',
  },
  {
    key: '5',
    id: 'cust-005',
    name: '紫光医疗',
    contact: '孙伟',
    email: 'sunwei@purplemed.com',
    phone: '13500005005',
    deployStatus: 'suspended',
    currentVersion: 'v2.1.0',
    domain: 'link.purplemed.com',
    serverIp: '39.108.45.67',
    maxUsers: 400,
    activeUsers: 0,
    licenseKey: 'LIC-PURPLE-2025-PRO',
    licenseExpiry: '2026-03-31',
    plan: '专业版',
    serviceConfig: {
      storage: { provider: 'aliyun', bucket: 'purple-link', region: 'cn-shenzhen', status: 'disconnected' },
      push: { apns: 'disconnected', fcm: 'disconnected' },
      email: { provider: 'smtp', fromEmail: 'noreply@purplemed.com', status: 'disconnected' },
    },
    registryCredential: {
      username: 'purplemed',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2025-10-20',
    },
    createdAt: '2025-10-20',
    remark: 'License 已过期，服务已暂停',
  },
  {
    key: '6',
    id: 'cust-006',
    name: '橙光游戏',
    contact: '周杰',
    email: 'zhoujie@orangegame.io',
    phone: '13400006006',
    deployStatus: 'offline',
    currentVersion: 'v2.0.0',
    domain: 'link.orangegame.io',
    serverIp: '8.134.56.78',
    maxUsers: 250,
    activeUsers: 0,
    licenseKey: 'LIC-ORANGE-2025-STD',
    licenseExpiry: '2025-12-31',
    plan: '标准版',
    serviceConfig: {
      storage: { provider: 'aws', bucket: 'orange-link', region: 'us-west-2', status: 'disconnected' },
      push: { apns: 'disconnected', fcm: 'disconnected' },
      email: { provider: 'smtp', fromEmail: 'help@orangegame.io', status: 'disconnected' },
    },
    registryCredential: {
      username: 'orangegame',
      password: '********',
      registry: 'registry.twt-link.com',
      createdAt: '2025-08-15',
    },
    createdAt: '2025-08-15',
    remark: '已下线，合同到期未续约',
  },
]

export function getCustomerById(id: string): Customer | undefined {
  return customersData.find(c => c.id === id)
}
