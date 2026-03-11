# Deploy web-agent

构建并部署 web-agent 到预览服务器。

## 步骤

1. 运行 `pnpm deploy:web-agent`（会先 build 再 rsync 到远程服务器）
2. 等待命令执行完成
3. 如果构建失败，分析错误原因并告知用户
4. 如果部署成功，输出预览地址：`https://pm.pro.jishu666.com/web-agent/index.html`

## 注意事项

- 构建前不需要手动 install，直接执行 deploy 命令即可
- 如果遇到 TypeScript 类型错误导致构建失败，帮用户定位并修复问题后重新部署
- 部署完成后用简洁的中文告知用户结果
