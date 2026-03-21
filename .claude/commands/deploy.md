# Deploy web-agent & web-customer & web-admin & mobile-app

同时构建并部署客服端（web-agent）、访客端（web-customer）、运营后台（web-admin）和移动端（mobile-app）到预览服务器。

## 步骤

1. 并行运行 `pnpm deploy:web-agent`、`pnpm deploy:web-customer`、`pnpm deploy:web-admin` 和 `pnpm deploy:mobile-app`（各自会先 build 再 rsync 到远程服务器）
2. 等待所有命令执行完成
3. 如果其中一个构建失败，分析错误原因并告知用户，其他不受影响
4. 部署完成后输出预览地址：
   - 客服端：`https://pm.pro.jishu666.com/web-agent/index.html`
   - 访客端：`https://pm.pro.jishu666.com/web-customer/index.html`
   - 运营后台：`https://pm.pro.jishu666.com/web-admin/index.html`
   - 移动端：`https://pm.pro.jishu666.com/mobile-app/index.html`

## 注意事项

- 构建前不需要手动 install，直接执行 deploy 命令即可
- 四个部署任务互相独立，应并行执行以节省时间
- 如果遇到 TypeScript 类型错误导致构建失败，帮用户定位并修复问题后重新部署
- 部署完成后用简洁的中文告知用户结果
