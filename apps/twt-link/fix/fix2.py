import re

def fix_html():
    file_path = '/Users/pg139/Desktop/反重力/Linkv1.1.0/link_client.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix the chatActionGroup wrapper
    target_action_groups = """                        <div class="chat-actions" id="chatActionGroupNormal">
                            <i class="ri-search-2-line" title="查找聊天记录"></i>
                            <i class="ri-more-fill" title="群聊设置"></i>
                        </div>
                        <div class="chat-actions" id="chatActionGroupMessage" style="display: none;">
                            <span class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="添加成员" onclick="openAddMemberModal()"><i class="ri-add-circle-line"></i></span>
                        </div>
                        <div class="chat-actions" id="chatActionGroupService" style="display: none; align-items: center;">
                            <span id="csActionAdd" class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="添加客服" onclick="openAddCustomerServiceModal()"><i class="ri-add-circle-line"></i></span>
                            <span id="csActionTransfer" class="td-tooltip" style="display: flex;" data-tooltip="转移会话" onclick="openTransferCustomerServiceModal()"><i class="ri-arrow-left-right-line"></i></span>
                            <span id="csActionPending" class="td-tooltip" style="display: flex; cursor: pointer;" data-tooltip="标记为待处理" onclick="toggleSessionPendingState(this)"><i class="ri-inbox-archive-line"></i></span>
                            <span id="csActionEnd" class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="结束会话" onclick="document.getElementById('endSessionConfirmModal').style.display='flex'"><i class="ri-shut-down-line" style="color: #F53F3F;"></i></span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <div id="chatHeaderToggleDivider" style="display: none; width: 1px; height: 16px; background: var(--border-color); margin: 0 4px;"></div>
                            <span id="chatHeaderToggleSidebarBtn" class="td-tooltip tooltip-align-right" style="display: none; align-items: center; margin-left: 8px;" data-tooltip="展开详情" onclick="toggleCustomerInfoPanel()">
                                <!-- custom right sidebar toggle icon -->
                                <div style="width: 16px; height: 16px; border: 1.5px solid currentColor; border-radius: 4px; position: relative; cursor: pointer; display: flex; box-sizing: border-box; color: var(--text-tertiary);">
                                    <div style="width: 6.5px; height: 100%; border-right: 1.5px solid currentColor; box-sizing: border-box;"></div>
                                </div>
                            </span>
                        </div>"""

    replacement_action_groups = """                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div class="chat-actions" id="chatActionGroupNormal">
                                <i class="ri-search-2-line" title="查找聊天记录"></i>
                                <i class="ri-more-fill" title="群聊设置"></i>
                            </div>
                            <div class="chat-actions" id="chatActionGroupMessage" style="display: none;">
                                <span class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="添加成员" onclick="openAddMemberModal()"><i class="ri-add-circle-line"></i></span>
                            </div>
                            <div class="chat-actions" id="chatActionGroupService" style="display: none; align-items: center;">
                                <span id="csActionAdd" class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="添加客服" onclick="openAddCustomerServiceModal()"><i class="ri-add-circle-line"></i></span>
                                <span id="csActionTransfer" class="td-tooltip" style="display: flex;" data-tooltip="转移会话" onclick="openTransferCustomerServiceModal()"><i class="ri-arrow-left-right-line"></i></span>
                                <span id="csActionPending" class="td-tooltip" style="display: flex; cursor: pointer;" data-tooltip="标记为待处理" onclick="toggleSessionPendingState(this)"><i class="ri-inbox-archive-line"></i></span>
                                <span id="csActionEnd" class="td-tooltip tooltip-align-right" style="display: flex;" data-tooltip="结束会话" onclick="document.getElementById('endSessionConfirmModal').style.display='flex'"><i class="ri-shut-down-line" style="color: #F53F3F;"></i></span>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div id="chatHeaderToggleDivider" style="display: none; width: 1px; height: 16px; background: var(--border-color); margin: 0 4px;"></div>
                                <span id="chatHeaderToggleSidebarBtn" class="td-tooltip tooltip-align-right" style="display: none; align-items: center; margin-left: 8px;" data-tooltip="展开详情" onclick="toggleCustomerInfoPanel()">
                                    <!-- custom right sidebar toggle icon -->
                                    <div style="width: 16px; height: 16px; border: 1.5px solid currentColor; border-radius: 4px; position: relative; cursor: pointer; display: flex; box-sizing: border-box; color: var(--text-tertiary);">
                                        <div style="width: 6.5px; height: 100%; border-right: 1.5px solid currentColor; box-sizing: border-box;"></div>
                                    </div>
                                </span>
                            </div>
                        </div>"""

    if target_action_groups in content:
        content = content.replace(target_action_groups, replacement_action_groups)
    else:
        print("Action groups not matched!")

    # 2. Fix the grid avatar
    grid_avatar = '<div class="chat-avatar" style="background:#F2F3F5; padding: 2px; box-sizing: border-box; display: grid; grid-template-columns: 15px 15px; grid-template-rows: 15px 15px; gap: 2px; justify-content: center; align-content: center; border-radius: 6px;">\n                                <div style="grid-column: span 2; justify-self: center; width: 15px; height: 15px; background:#E8F3FF; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:8px; border-radius: 2px;">王</div>\n                                <div style="width: 15px; height: 15px; background:#DCE6FE; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:500; border-radius: 2px;">?</div>\n                                <div style="width: 15px; height: 15px; background:#E8F3FF; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:8px; border-radius: 2px;">客</div>\n                            </div>'
    replacement_grid_avatar = '<div class="chat-avatar" style="background:#F2F3F5; padding: 0; box-sizing: border-box; display: grid; grid-template-columns: 21px 21px; grid-template-rows: 21px 21px; gap: 2px; justify-content: center; align-content: center; border-radius: 6px; overflow: hidden;">\n                                <div style="grid-column: span 2; justify-self: center; width: 21px; height: 21px; background:#E8F3FF; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:12px; border-radius: 4px;">王</div>\n                                <div style="width: 21px; height: 21px; background:#DCE6FE; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; border-radius: 4px;">?</div>\n                                <div style="width: 21px; height: 21px; background:#E8F3FF; color:#1677FF; display:flex; align-items:center; justify-content:center; font-size:12px; border-radius: 4px;">客</div>\n                            </div>'
    if grid_avatar in content:
        content = content.replace(grid_avatar, replacement_grid_avatar)
    else:
        print("Grid avatar not matched!")

    # 3. Populate empty msg-previews
    # We will use regex to find `<div class="chat-item" ...` blocks, extract the name, and replace `class="msg-preview"></div>` with `class="msg-preview">NAME: 你好</div>`.
    # Wait, some items have `你好` already.
    # The rule says: `最后一条消息的发送人昵称+消息`
    # Let's just blindly update the previews for specific names in the code as visible on the screenshot.
    
    previews_to_update = {
        "'李四'": "王三: 好的收到",
        "'Link 项目组内部群'": "李四: 这是最新的需求说明文档...",
        "'排队中 · 2'": "[3条]访客00001: 我这有问题...",
        "'访客00001'": "访客00001: 你好",
        "'访客00003'": "访客00003: 请问发货了吗？",
        "'访客00004'": "王三: 好的，明白了",
        "'客户00006'": "客户00006: 谢谢",
        "'客户00007'": "王三: 再见",
        "'[客服咨询]问题处理群聊'": "王三: @张四 你好",
        "'新建的群聊'": "王三: 大家好"
    }

    # I'll manually replace the previews around the specific names
    for name, prev in previews_to_update.items():
        # Find the block for this name
        # A simple way: find the onclick attribute containing this name, then the next msg-preview
        pattern = f"(selectChat\\(this,\\s*{re.escape(name)}.*?class=\"msg-preview\">)(.*?)(</div>)"
        content = re.sub(pattern, lambda m: m.group(1) + prev + m.group(3), content, flags=re.DOTALL)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed!")

if __name__ == '__main__':
    fix_html()
