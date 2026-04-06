import { reactive } from 'vue'

interface VersionState {
  hasUpdate: boolean
  notes: string
}

export function useVersionCheck() {
  const versionState = reactive<VersionState>({
    hasUpdate: false,
    notes: '',
  })

  // 模拟版本检查
  function checkVersion() {
    // 实际项目中这里应该调用 API 检查版本
    // const response = await fetch('/api/version')
    // const data = await response.json()
    // if (data.hasUpdate) {
    //   versionState.hasUpdate = true
    //   versionState.notes = data.notes
    // }
  }

  function doRefresh() {
    window.location.reload()
  }

  function dismissUpdate() {
    versionState.hasUpdate = false
  }

  // 启动时检查一次
  checkVersion()

  // 每 5 分钟检查一次
  setInterval(checkVersion, 5 * 60 * 1000)

  return {
    versionState,
    doRefresh,
    dismissUpdate,
  }
}
