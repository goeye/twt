/**
 * 部署记录模拟数据
 */

export type DeployAction = 'deploy' | 'upgrade' | 'rollback' | 'suspend' | 'resume' | 'offline'
export type DeployResult = 'success' | 'failed' | 'in_progress'

export interface DeployRecord {
  key: string
  id: string
  customerId: string
  customerName: string
  action: DeployAction
  fromVersion: string
  toVersion: string
  result: DeployResult
  operator: string
  startedAt: string
  finishedAt: string
  remark: string
}

export const deployRecordsData: DeployRecord[] = [
  {
    key: '1', id: 'dep-001', customerId: 'cust-001', customerName: '星辰科技',
    action: 'upgrade', fromVersion: 'v2.2.0', toVersion: 'v2.3.1', result: 'success',
    operator: '管理员', startedAt: '2026-04-10 14:00:00', finishedAt: '2026-04-10 14:15:00',
    remark: '常规升级',
  },
  {
    key: '2', id: 'dep-002', customerId: 'cust-002', customerName: '蓝海金融',
    action: 'deploy', fromVersion: '-', toVersion: 'v2.2.0', result: 'success',
    operator: '管理员', startedAt: '2026-02-05 10:00:00', finishedAt: '2026-02-05 10:30:00',
    remark: '首次部署',
  },
  {
    key: '3', id: 'dep-003', customerId: 'cust-003', customerName: '绿叶教育',
    action: 'deploy', fromVersion: '-', toVersion: 'v2.3.1', result: 'success',
    operator: '管理员', startedAt: '2026-03-01 09:00:00', finishedAt: '2026-03-01 09:10:00',
    remark: '首次部署',
  },
  {
    key: '4', id: 'dep-004', customerId: 'cust-005', customerName: '紫光医疗',
    action: 'suspend', fromVersion: 'v2.1.0', toVersion: 'v2.1.0', result: 'success',
    operator: '系统', startedAt: '2026-04-01 00:00:00', finishedAt: '2026-04-01 00:00:05',
    remark: 'License 过期自动暂停',
  },
  {
    key: '5', id: 'dep-005', customerId: 'cust-001', customerName: '星辰科技',
    action: 'upgrade', fromVersion: 'v2.1.0', toVersion: 'v2.2.0', result: 'success',
    operator: '管理员', startedAt: '2026-03-15 16:00:00', finishedAt: '2026-03-15 16:12:00',
    remark: '',
  },
]

export interface VersionInfo {
  key: string
  version: string
  releaseDate: string
  changelog: string
  customerCount: number
  isLatest: boolean
}

export const versionsData: VersionInfo[] = [
  {
    key: '1', version: 'v2.3.1', releaseDate: '2026-04-08',
    changelog: '修复邮件渠道附件上传问题\n优化会话列表加载性能\n新增访客评价统计',
    customerCount: 2, isLatest: true,
  },
  {
    key: '2', version: 'v2.3.0', releaseDate: '2026-03-20',
    changelog: '新增 Telegram 渠道接入\n新增 AI 机器人 Autopilot 模式\n优化移动端会话体验',
    customerCount: 0, isLatest: false,
  },
  {
    key: '3', version: 'v2.2.0', releaseDate: '2026-02-01',
    changelog: '新增 Webhook 平台集成\n新增会话内部备注功能\n优化排队分配策略',
    customerCount: 1, isLatest: false,
  },
  {
    key: '4', version: 'v2.1.0', releaseDate: '2025-12-15',
    changelog: '新增邮箱渠道接入\n新增消息自动翻译\n新增角色权限管理',
    customerCount: 1, isLatest: false,
  },
  {
    key: '5', version: 'v2.0.0', releaseDate: '2025-08-01',
    changelog: '全新架构重构\n白标功能上线\n私有化部署支持',
    customerCount: 1, isLatest: false,
  },
]
