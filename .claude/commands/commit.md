# Commit & Push

自动提交所有改动并推送到 GitHub。

## 步骤

1. 运行 `git status` 查看当前改动文件（不要用 -uall 参数）
2. 运行 `git diff --stat` 查看改动概要
3. 如果没有任何改动，告知用户"没有需要提交的改动"并停止
4. 分析所有改动内容（用 `git diff` 查看详细改动）
5. 将所有改动文件添加到暂存区（用具体文件名，不要用 `git add .`）
6. 生成中文 commit message，格式要求：
   - 第一行：简洁概括本次改动（不超过 50 个字）
   - 空一行
   - 后续行：用 `- ` 列出每个文件的主要改动点
   - 最后加上 `Co-Authored-By: Claude Opus 4.6`
7. 执行 `git commit`（用 HEREDOC 传递 message）
8. 执行 `git push` 推送到远程
9. 用简洁的中文告知用户提交结果

## Commit Message 风格参考

```
优化归档页面交互体验

- ArchiveAssignModal: 将客服行改为独立分配按钮
- FilesRoutePage: 用内联面板替代全屏抽屉
```

## 注意事项

- 不要提交 .env、credentials 等敏感文件
- 如果 pre-commit hook 失败，修复问题后创建新 commit（不要 amend）
- 如果推送失败，告知用户原因，不要强制推送
