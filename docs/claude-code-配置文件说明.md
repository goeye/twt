# Claude Code 配置文件说明

## CLAUDE.md 与 MEMORY.md 对比

| | `CLAUDE.md` | `MEMORY.md` |
|---|---|---|
| **用途** | 项目规范、编码约定、命令速查 | 会话中确认的偏好、决策记录 |
| **谁来维护** | 开发者手动编辑 | Claude 自动写入 |
| **版本控制** | 可以提交到 git，团队共享 | 不在项目里，仅本机 |
| **加载方式** | 自动加载当前工作目录及父目录中的所有 `CLAUDE.md` | 自动加载对应项目的 `memory/MEMORY.md` |
| **层级** | 支持全局 / 项目 / 子目录三级 | 仅一级（按项目路径自动映射） |

---

## CLAUDE.md 不同层级说明

### 1. 全局级别

- **路径**: `~/.claude/CLAUDE.md`
- **作用范围**: 所有项目生效
- **内容示例**:

```markdown
- 永远用中文回复
- commit message 用中文
- 优先使用 pnpm 作为包管理器
- 不要自动添加 emoji
```

### 2. 项目根目录级别

- **路径**: `~/Downloads/TWT/TWT/twt/CLAUDE.md`
- **作用范围**: 整个 twt 项目
- **内容示例**:

```markdown
- 架构说明、monorepo 结构
- design token 规范（--agent-* 前缀）
- 构建命令（pnpm dev:web-agent）
- 依赖关系（web-agent → ui-agent → tokens）
```

### 3. 子目录级别

- **路径**: `~/Downloads/TWT/TWT/twt/apps/web-agent/CLAUDE.md`
- **作用范围**: 操作 web-agent 目录下的文件时生效
- **内容示例**:

```markdown
- 只能导入 @twt/ui-agent 和 @twt/tokens
- 路由定义在 src/router.ts
- 主布局在 src/App.vue
```

- **路径**: `~/Downloads/TWT/TWT/twt/packages/ui-agent/CLAUDE.md`
- **作用范围**: 操作 ui-agent 目录下的文件时生效
- **内容示例**:

```markdown
- 组件使用 BEM 命名（agent- 前缀）
- 统一从 src/index.ts 导出
- 共享类型放在 src/types.ts
```

---

## MEMORY.md 说明

### 路径规则

项目路径会被自动编码（`/` 替换为 `-`），存放在 Claude Code 系统目录下：

| 项目路径 | MEMORY.md 位置 |
|---|---|
| `/Users/pg133/Downloads/TWT/TWT/twt` | `~/.claude/projects/-Users-pg133-Downloads-TWT-TWT-twt/memory/MEMORY.md` |
| `/Users/pg133/work/other-project` | `~/.claude/projects/-Users-pg133-work-other-project/memory/MEMORY.md` |

### 记录内容

- 跨会话确认的 UI 约定（如 Toast 文案、弹窗颜色）
- 需求讨论中确认的决策结论
- 用户个人偏好（如工作流习惯）
- 反复出现的问题和解决方案

### 不适合记录的内容

- 当前会话的临时状态
- 未经验证的推测
- 与 CLAUDE.md 重复的内容

---

## 总结

```
~/.claude/
├── CLAUDE.md                          # 全局指令（所有项目生效）
└── projects/
    └── -Users-pg133-...-twt/
        └── memory/
            └── MEMORY.md              # 项目记忆（Claude 自动维护）

~/Downloads/TWT/TWT/twt/
├── CLAUDE.md                          # 项目级指令（团队共享）
├── apps/
│   └── web-agent/
│       └── CLAUDE.md                  # 子目录指令（可选）
└── packages/
    └── ui-agent/
        └── CLAUDE.md                  # 子目录指令（可选）
```
