# TWT 管理后台

TWT Chat 平台的管理后台，用于管理代理商、配置平台参数。

## 功能模块

### 1. 代理商管理
- 代理商列表：查看、搜索、筛选所有代理商
- 代理商审核：审核新申请的代理商
- 代理商详情：查看代理商完整信息、项目、订单、佣金
- 数据统计：总数、待审核、已启用、已停用

### 2. 平台配置
- **基础配置**：平台名称、默认分成比例、联系方式
- **白标功能**：启用/禁用白标、域名验证、SSL 证书管理
- **支付配置**：Stripe API、Webhook、Connect 分账
- **邮件配置**：SMTP 服务器、发件人信息、测试邮件
- **存储配置**：OSS/S3 配置、连接测试
- **审核配置**：代理商/域名/APP 审核开关

## 技术栈

- Vue 3 + TypeScript
- Ant Design Vue 4
- Vue Router 4
- Vite 6
- @twt/branding (白标功能)

## 开发

```bash
# 启动开发服务器
pnpm dev:twt-admin

# 构建生产版本
pnpm build:twt-admin

# 部署到预览服务器
pnpm deploy:twt-admin
```

## 目录结构

```
src/
├── views/              # 页面组件
│   ├── ResellerManagePage.vue      # 代理商管理
│   ├── ResellerDetailPage.vue      # 代理商详情
│   └── PlatformConfigPage.vue      # 平台配置
├── composables/        # 组合式函数
│   └── useVersionCheck.ts          # 版本检查
├── mock/              # 模拟数据
│   └── resellersData.ts            # 代理商数据
├── router/            # 路由配置
│   └── index.ts
├── App.vue            # 根组件
└── main.ts            # 入口文件
```

## 部署

构建后的文件会部署到：
```
https://pm.pro.jishu666.com/twt-admin/index.html
```

## 优化说明

详见 [OPTIMIZATION.md](./OPTIMIZATION.md)
