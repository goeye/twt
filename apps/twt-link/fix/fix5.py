import os

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update the document event listener to remove 'show' class
    target_click = """        document.addEventListener('click', () => {
            const agentStatusDd = document.getElementById('agentStatusDropdown');
            if(agentStatusDd) agentStatusDd.style.display = 'none';"""
    replacement_click = """        document.addEventListener('click', () => {
            const agentStatusDd = document.getElementById('agentStatusDropdown');
            if(agentStatusDd) agentStatusDd.classList.remove('show');"""
    if target_click in content:
        content = content.replace(target_click, replacement_click)

    # 2. Rewrite toggleAgentStatusMenu and selectAgentStatus
    target_js = """        function toggleAgentStatusMenu(e) {
            e.stopPropagation();
            const dd = document.getElementById('agentStatusDropdown');
            dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
        }

        function selectAgentStatus(statusVal, statusText, iconClass, color, el) {
            const iconEl = document.getElementById('currentAgentStatusIcon');
            iconEl.className = iconClass;
            iconEl.style.color = color;
            document.getElementById('currentAgentStatusText').innerText = statusText;
            
            const options = document.querySelectorAll('#agentStatusDropdown .agent-opt');
            options.forEach(opt => {
                opt.style.background = 'transparent';
                opt.style.color = '#111';
                opt.className = 'agent-opt';
                opt.onmouseover = function() { this.style.background = '#f2f3f5'; };
                opt.onmouseout = function() { this.style.background = 'transparent'; };
            });

            el.style.background = '#E8F3FF';
            el.style.color = '#2970FF';
            el.className = 'agent-opt active';
            el.onmouseover = null;
            el.onmouseout = null;

            document.getElementById('agentStatusDropdown').style.display = 'none';
        }"""
    replacement_js = """        function toggleAgentStatusMenu(e) {
            e.stopPropagation();
            const dd = document.getElementById('agentStatusDropdown');
            dd.classList.toggle('show');
        }

        function selectAgentStatus(statusVal, statusText, iconClass, color, el) {
            const iconEl = document.getElementById('currentAgentStatusIcon');
            iconEl.className = iconClass;
            iconEl.style.color = color;
            document.getElementById('currentAgentStatusText').innerText = statusText;
            
            const options = document.querySelectorAll('#agentStatusDropdown .agent-opt');
            options.forEach(opt => opt.classList.remove('active'));
            el.classList.add('active');

            setTimeout(() => {
                document.getElementById('agentStatusDropdown').classList.remove('show');
            }, 100);
        }"""
    if target_js in content:
        content = content.replace(target_js, replacement_js)

    # 3. Update the HTML layout
    target_dropdown = """                    <!-- 状态下拉菜单 -->
                    <div id="agentStatusDropdown" style="display: none; position: absolute; top: calc(100% + 4px); right: 0; width: 140px; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); border: 1px solid #e5e6eb; padding: 8px; z-index: 1000; font-size: 14px;">
                        <div class="agent-opt active" style="padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; background: #E8F3FF; color: #2970FF; margin-bottom: 4px;" onclick="selectAgentStatus('online', '在线', 'ri-checkbox-circle-fill', '#00B42A', this)">
                            <i class="ri-checkbox-circle-fill" style="color: #00B42A; font-size: 16px;"></i>
                            <span>在线</span>
                        </div>
                        <div class="agent-opt" style="padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer; color: #111; transition: background 0.2s;" onmouseover="if(!this.classList.contains('active')) this.style.background='#f2f3f5'" onmouseout="if(!this.classList.contains('active')) this.style.background='transparent'" onclick="selectAgentStatus('away', '离开', 'ri-time-fill', '#86909C', this)">
                            <i class="ri-time-fill" style="color: #86909C; font-size: 16px;"></i>
                            <span>离开</span>
                        </div>
                    </div>"""
    replacement_dropdown = """                    <!-- 状态下拉菜单 (Silky Interaction) -->
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
                    </div>"""
    if target_dropdown in content:
        content = content.replace(target_dropdown, replacement_dropdown)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_agent.html')
update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
