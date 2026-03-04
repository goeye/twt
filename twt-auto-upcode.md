---
description: 当用户提到「构建」「部署」「上传」「新建项目」「upcode」，或涉及 gm-protoview、projects-config.json 时，必须读取并遵循此规则
---
以下是 gm-global 项目管理、构建、部署的完整流程，可直接作为规则使用：

---

## 一、架构概览

```
gm-global/                          ← pnpm monorepo 根目录
├── scripts/
│   ├── projects-config.json        ← 集中配置（唯一真相源）
│   └── generate-meta.js            ← 元数据生成器
├── gm-protoview/                   ← 项目总览门户
│   └── public/projects.json        ← 运行时数据（自动生成，勿手动编辑）
├── gm-xxx/                         ← 各子项目
├── upcode.sh                       ← 云端部署脚本
├── chanpin3                        ← rsync 密码文件
└── pnpm-workspace.yaml             ← workspace 定义（仅 Vite 项目）
```

---

## 二、新建项目流程

### 步骤 1：创建项目目录
在 gm-global 根目录下创建 `gm-{项目名}` 文件夹，按需求选择技术栈（Vite 项目或纯 HTML 项目）。

### 步骤 2：注册到集中配置
编辑 `scripts/projects-config.json`，新增一个条目（将 `{项目名}` 替换为实际英文项目名）：
```json
"gm-{项目名}": {
  "name": "项目中文名",
  "description": "一句话描述",
  "category": "客户端|桌面端|运维工具|环境管理|其他",
  "status": "迭代中|已完成|仅Demo|已弃用",
  "icon": "lucide-react 图标名",
  "url": "",
  "uiUrl": "",
  "relatedTo": []
}
```
- `{项目名}` 必须替换为实际名称，如 `gm-docker`、`gm-waf` 等
- `url` 留空 → generate-meta.js 会自动填充为 `https://pm.pro.jishu666.com/gm-{项目名}/index.html`
- `uiUrl` 填 UI 设计稿链接（可选）
- `relatedTo` 填关联项目 ID 数组（可选，需双向配置）

### 步骤 3：如果是 Vite 项目，注册到 workspace
编辑 `pnpm-workspace.yaml`，添加一行（将 `{项目名}` 替换为实际名称）：
```yaml
- "gm-{项目名}"
```
然后在根目录执行 `pnpm install`。

### 步骤 4：创建 updatelog.md
每个项目目录下必须有且仅有一个 `updatelog.md`，中文记录每次修改。

---

## 三、构建 & 部署流程

### 场景 A：构建单个子项目并上传
```bash
cd gm-xxx && npm run build    # 构建到 dist/
cd .. && sh upcode.sh gm-xxx  # 上传 dist/ 到云端
```
最终地址：`https://pm.pro.jishu666.com/gm-xxx/index.html`

### 场景 B：构建 gm-protoview（门户）并上传
```bash
cd gm-protoview && npm run build && cd .. && sh upcode.sh gm-protoview
```
这条命令会自动执行：
1. `node ../scripts/generate-meta.js` → 扫描所有 `gm-*` 目录，读取集中配置 + 各项目 updatelog，生成 `gm-protoview/public/projects.json`
2. `tsc -b && vite build` → 构建前端
3. `sh upcode.sh gm-protoview` → 上传到云端

门户地址：`https://pm.pro.jishu666.com/gm-protoview/index.html`

### 场景 C：用户说"帮我构建项目"
按 pm-master 规则，引入 `vite-plugin-singlefile` 构建单文件 → 构建完成后恢复标准模式 → 自动执行 `sh upcode.sh {项目名}`。

---

## 四、数据流优先级

generate-meta.js 生成每个项目的元数据时，字段读取优先级为：

```
scripts/projects-config.json（集中配置，最高优先级）
    ↓ 如果为空
各项目/project.meta.json（手动覆盖文件）
    ↓ 如果为空
generate-meta.js 内置 MAP（硬编码默认值）
    ↓ 如果为空
自动推断（如 lastUpdated 从 updatelog 提取，url 从项目名拼接）
```

适用字段：name、description、category、status、icon、url、uiUrl、relatedTo

---

## 五、什么时候需要重新构建 gm-protoview

以下任一情况发生时，需要重新构建并部署 gm-protoview：
1. 编辑了 `scripts/projects-config.json`（修改项目名称/描述/状态/分类等）
2. 新增或删除了 `gm-*` 项目目录
3. 任何子项目的 `updatelog.md` 有更新（影响最近更新时间和变更日志）
4. gm-protoview 自身代码有修改

仅修改子项目代码并部署子项目本身时，不需要重新构建 gm-protoview（除非 updatelog 也更新了）。

---

## 六、upcode.sh 工作原理

```
sh upcode.sh gm-xxx
  → rsync gm-xxx/dist/ 到远程服务器 rsync://chanpin3@121.40.183.14:8730/project/gm-xxx/
  → 调用 WebHook 通知服务器刷新
  → 输出最终 URL
```
密码文件：根目录下的 `chanpin3`（仅含密码字符串）。

---

## 七、增量部署脚本 (scripts/quick-deploy.sh)

适用于修改了单个子项目后，一键完成「构建 → 部署 → 更新门户元数据」的完整流程：

```bash
# 构建 + 部署项目 + 自动更新 gm-protoview 的 projects.json
sh scripts/quick-deploy.sh gm-docker

# 跳过构建，仅部署 + 更新元数据（适用于纯 HTML 项目或已手动构建）
sh scripts/quick-deploy.sh gm-docker --skip-build

# 仅更新元数据并同步到云端（不构建不部署任何子项目）
sh scripts/quick-deploy.sh --meta-only
```

执行流程：
1. `cd gm-xxx && npm run build` → 构建子项目
2. `sh upcode.sh gm-xxx` → 上传子项目到云端
3. `node scripts/generate-meta.js` → 重新生成全量 projects.json
4. `cp projects.json → gm-protoview/dist/` → 直接覆盖已构建的门户数据
5. `sh upcode.sh gm-protoview` → 同步门户到云端

这样子项目和门户的数据都会同步更新，无需重新构建 gm-protoview 前端代码。

---

## 八、全量部署脚本 (scripts/deploy-all.sh)

适用于首次部署或大规模更新时，一次性处理所有 24 个项目：

```bash
sh scripts/deploy-all.sh --meta-only     # 仅生成元数据
sh scripts/deploy-all.sh --build-only    # 仅构建所有 Vite 项目
sh scripts/deploy-all.sh --deploy-only   # 仅上传（跳过构建）
sh scripts/deploy-all.sh --all           # 完整流程：元数据 → 构建 → 上传
```

项目分类：
- Vite 项目（12个）：通过 `pnpm -r run build` 统一构建，从 `dist/` 目录上传
- 纯 HTML 项目（10个）：无需构建，创建临时 `dist` 软链接后上传
- 无 index.html 的 HTML 项目（3个：gm-envmanager、gm-sourcemanager、gm-ssh）：先由 `generate-index.js` 自动生成导航首页

---

## 九、导航页生成器 (scripts/generate-index.js)

针对没有 `index.html` 的纯 HTML 项目（gm-envmanager、gm-sourcemanager、gm-ssh），自动扫描目录下所有 `.html` 文件，生成一个带链接列表的导航首页。

```bash
node scripts/generate-index.js
```

仅在全量部署 (`deploy-all.sh --all` 或 `--meta-only`) 时自动调用，增量部署不涉及。
