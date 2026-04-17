import re

with open('/Users/pg139/Desktop/Linkv1.1.0/link_admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Kefu row
text = text.replace(
    '<span id="listAppScopeTag" style="background: #E8F3FF',
    '<span id="listAppScopeTag-kefu" style="background: #E8F3FF'
)
text = text.replace(
    '''<span class="action-link" onclick="openAppDetail('kefu')">设置</span>
                                    <span class="action-link danger" id="listAppStatusBtn" onclick="toggleAppStatus()">停用</span>''',
    '''<span class="action-link" onclick="openAppDetail('kefu')">设置</span>
                                    <span class="action-link danger" id="listAppStatusBtn-kefu" onclick="toggleAppStatus('kefu')">停用</span>'''
)

# Fix Calendar row
text = text.replace(
    '''<td><span style="background: #E8F3FF; color: var(--primary); padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">全部成员</span></td>
                                <td>
                                    <span class="action-link" onclick="openAppDetail('calendar')">设置</span>
                                    <span class="action-link danger" onclick="toggleAppStatus()">停用</span>
                                </td>''',
    '''<td><span id="listAppScopeTag-calendar" style="background: #E8F3FF; color: var(--primary); padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">全部成员</span></td>
                                <td>
                                    <span class="action-link" onclick="openAppDetail('calendar')">设置</span>
                                    <span class="action-link danger" id="listAppStatusBtn-calendar" onclick="toggleAppStatus('calendar')">停用</span>
                                </td>'''
)

# Fix Todo row
text = text.replace(
    '''<td><span style="background: #E8F3FF; color: var(--primary); padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">全部成员</span></td>
                                <td>
                                    <span class="action-link" onclick="openAppDetail('todo')">设置</span>
                                    <span class="action-link danger" onclick="toggleAppStatus()">停用</span>
                                </td>''',
    '''<td><span id="listAppScopeTag-todo" style="background: #E8F3FF; color: var(--primary); padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 500;">全部成员</span></td>
                                <td>
                                    <span class="action-link" onclick="openAppDetail('todo')">设置</span>
                                    <span class="action-link danger" id="listAppStatusBtn-todo" onclick="toggleAppStatus('todo')">停用</span>
                                </td>'''
)

# Fix JS status variable
new_js = """        let appStates = { kefu: true, calendar: true, todo: true };
        let currentActiveApp = 'kefu';
        let pendingDisableAppType = '';

        function toggleAppStatus(appType) {
            if (!appType) appType = currentActiveApp;
            if (appStates[appType]) {
                pendingDisableAppType = appType;
                openModal('disableAppModal');
            } else {
                appStates[appType] = true;
                updateAppSwitchUI(appType);
            }
        }

        function confirmDisableApp() {
            if (pendingDisableAppType) {
                appStates[pendingDisableAppType] = false;
                updateAppSwitchUI(pendingDisableAppType);
            }
            closeModal('disableAppModal');
        }

        function updateAppSwitchUI(appType) {
            const isEnabled = appStates[appType];
            
            // Detail view update sync
            if (appType === currentActiveApp) {
                const statusText = document.getElementById('appStatusText');
                const switchBg = document.getElementById('appStatusSwitch');
                const switchKnob = document.getElementById('appStatusKnob');
                
                if (statusText) statusText.innerText = isEnabled ? '已启用' : '已停用';
                if (switchBg) switchBg.style.background = isEnabled ? 'var(--primary)' : '#e5e6eb';
                if (switchKnob) {
                    if(isEnabled) {
                         switchKnob.style.right = '2px';
                         switchKnob.style.left = 'auto';
                    } else {
                         switchKnob.style.left = '2px';
                         switchKnob.style.right = 'auto';
                    }
                }
            }
            
            // List view update
            const listBtn = document.getElementById('listAppStatusBtn-' + appType);
            const listScopeTag = document.getElementById('listAppScopeTag-' + appType);
            
            if (listBtn) {
                if (isEnabled) {
                    listBtn.innerText = '停用';
                    listBtn.className = 'action-link danger';
                } else {
                    listBtn.innerText = '启用';
                    listBtn.className = 'action-link';
                    listBtn.style.color = 'var(--primary)';
                }
            }
            
            if (listScopeTag) {
                if (isEnabled) {
                    // Basic fallback to '全部成员'
                    listScopeTag.innerText = '全部成员';
                    listScopeTag.style.background = '#E8F3FF';
                    listScopeTag.style.color = 'var(--primary)';
                    listScopeTag.style.borderRadius = '12px';
                    listScopeTag.style.fontWeight = '500';
                } else {
                    listScopeTag.innerText = '已停用';
                    listScopeTag.style.background = '#f2f3f5';
                    listScopeTag.style.color = '#86909c';
                    listScopeTag.style.borderRadius = '4px';
                    listScopeTag.style.fontWeight = 'normal';
                }
            }
        }"""

# Extract the old toggle JS block to replace it
import re

old_toggle_pattern = re.compile(
    r'let isAppEnabled = true;.*?function updateAppSwitchUI\(\) \{.*?\}(?=\s*function )',
    re.DOTALL
)

print("Found toggle pattern:", "Yes" if old_toggle_pattern.search(text) else "No")

# Replace
text = old_toggle_pattern.sub(new_js.replace('\\', '\\\\'), text)

# update openAppDetail
text = text.replace(
    'function openAppDetail(appType) {',
    '''function openAppDetail(appType) {
            currentActiveApp = appType;
            updateAppSwitchUI(appType);'''
)

# update `isAppEnabled` reference inside `updatePartialScopeListUI`
text = text.replace(
    'if (listScopeTag && isAppEnabled) {',
    'if (listScopeTag && typeof appStates !== "undefined" && appStates[currentActiveApp]) {'
)

with open('/Users/pg139/Desktop/Linkv1.1.0/link_admin.html', 'w', encoding='utf-8') as f:
    f.write(text)

