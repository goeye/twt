/**
 * 部署记录与版本模拟数据
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
    changelog: '修复群聊消息同步延迟问题\n优化文件传输断点续传\n新增消息已读回执',
    customerCount: 2, isLatest: true,
  },
  {
    key: '2', version: 'v2.3.0', releaseDate: '2026-03-20',
    changelog: '新增屏幕共享功能\n新增群组公告\n优化移动端推送到达率',
    customerCount: 0, isLatest: false,
  },
  {
    key: '3', version: 'v2.2.0', releaseDate: '2026-02-01',
    changelog: '新增视频通话功能\n新增消息撤回\n优化离线消息同步',
    customerCount: 1, isLatest: false,
  },
  {
    key: '4', version: 'v2.1.0', releaseDate: '2025-12-15',
    changelog: '新增文件共享功能\n新增消息搜索\n新增组织架构管理',
    customerCount: 1, isLatest: false,
  },
  {
    key: '5', version: 'v2.0.0', releaseDate: '2025-08-01',
    changelog: '全新架构重构\n端到端加密上线\n私有化部署支持',
    customerCount: 1, isLatest: false,
  },
]

export type ClientPlatform = 'macos' | 'windows' | 'ios' | 'android'

export interface ClientVersion {
  key: string
  version: string
  platform: ClientPlatform
  releaseDate: string
  changelog: string
  downloadUrl: string
  minServerVersion: string
  isLatest: boolean
}

export const clientVersionsData: ClientVersion[] = [
  {
    key: '1', version: 'v2.3.1', platform: 'macos', releaseDate: '2026-04-10',
    changelog: '修复消息通知不显示问题\n优化内存占用',
    downloadUrl: '/releases/link-desktop-2.3.1.dmg',
    minServerVersion: 'v2.2.0', isLatest: true,
  },
  {
    key: '2', version: 'v2.3.1', platform: 'windows', releaseDate: '2026-04-10',
    changelog: '修复消息通知不显示问题\n优化内存占用',
    downloadUrl: '/releases/link-desktop-2.3.1.exe',
    minServerVersion: 'v2.2.0', isLatest: true,
  },
  {
    key: '3', version: 'v2.3.0', platform: 'ios', releaseDate: '2026-04-08',
    changelog: '新增屏幕共享\n优化推送到达率\n修复后台断连问题',
    downloadUrl: '/releases/link-mobile-2.3.0.ipa',
    minServerVersion: 'v2.2.0', isLatest: true,
  },
  {
    key: '4', version: 'v2.3.0', platform: 'android', releaseDate: '2026-04-08',
    changelog: '新增屏幕共享\n优化推送到达率\n适配 Android 15',
    downloadUrl: '/releases/link-mobile-2.3.0.apk',
    minServerVersion: 'v2.2.0', isLatest: true,
  },
  {
    key: '5', version: 'v2.2.0', platform: 'macos', releaseDate: '2026-02-05',
    changelog: '新增视频通话\n新增消息撤回',
    downloadUrl: '/releases/link-desktop-2.2.0.dmg',
    minServerVersion: 'v2.1.0', isLatest: false,
  },
  {
    key: '6', version: 'v2.2.0', platform: 'windows', releaseDate: '2026-02-05',
    changelog: '新增视频通话\n新增消息撤回',
    downloadUrl: '/releases/link-desktop-2.2.0.exe',
    minServerVersion: 'v2.1.0', isLatest: false,
  },
]
