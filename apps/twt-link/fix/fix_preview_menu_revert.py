import os

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    target_dropdown = """                <div style="width: 1px; height: 14px; background: #e5e6eb; margin: 0 -8px;"></div>

                <!-- 客服状态切换 -->
                <div style="position: relative; user-select: none; cursor: pointer;" id="agentStatusToggle" onclick="toggleAgentStatusMenu(event)">
                    <div style="display: flex; align-items: center; gap: 6px; color: #111; font-size: 14px; padding: 4px 8px; border-radius: 6px; transition: background 0.2s;" onmouseover="this.style.background='#f2f3f5'" onmouseout="this.style.background='transparent'" id="currentAgentStatusBox">
                        <i id="currentAgentStatusIcon" class="ri-checkbox-circle-fill" style="color: #00B42A; font-size: 16px;"></i>
                        <span id="currentAgentStatusText" style="font-weight: 500;">在线</span>
                        <i class="ri-arrow-down-s-line" style="color:#86909c; font-size: 16px;"></i>
                    </div>

                    <!-- 状态下拉菜单 (Silky Interaction) -->
                    <style>
                        #agentStatusDropdown {
                            position: absolute; top: calc(100% + 4px); right: 0; width: 140px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); border: 1px solid #e5e6eb; padding: 8px; z-index: 1000; font-size: 14px;
                            opacity: 0; transform: translateY(-8px); pointer-events: none;
                            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                        }
                        #agentStatusDropdown.show {
                            opacity: 1; transform: translateY(0); pointer-events: auto;
                        }
                        #agentStatusDropdown .agent-opt {
                            padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; color: #111; transition: all 0.2s; margin-bottom: 4px;
                        }
                        #agentStatusDropdown .agent-opt:last-child { margin-bottom: 0; }
                        #agentStatusDropdown .agent-opt:hover { background: #f2f3f5; }
                        #agentStatusDropdown .agent-opt.active { background: #E8F3FF; color: #1677FF; font-weight: 500; }
                        #agentStatusDropdown .agent-opt.active i { color: #1677FF !important; }
                    </style>
                    <div id="agentStatusDropdown">
                        <div class="agent-opt active" onclick="selectAgentStatus('online', '在线', 'ri-checkbox-circle-fill', '#00B42A', this)">
                            <i class="ri-checkbox-circle-fill" style="color: #00B42A; font-size: 16px;"></i>
                            <span>在线</span>
                        </div>
                        <div class="agent-opt" onclick="selectAgentStatus('away', '离开', 'ri-time-fill', '#86909C', this)">
                            <i class="ri-time-fill" style="color: #86909C; font-size: 16px;"></i>
                            <span>离开</span>
                        </div>
                    </div>
                </div>"""
    
    replacement_dropdown = """"""
    if target_dropdown in content:
        content = content.replace(target_dropdown, replacement_dropdown)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
