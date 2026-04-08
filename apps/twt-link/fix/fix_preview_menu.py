import re

CSS_ADD_CSS = """
        /* Preview Msg Menu Styles */
        .msg-content-wrapper { display: flex; align-items: center; }
        .msg-actions { opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #f2f3f5; color: #86909C; cursor: pointer; margin: 0 8px; }
        .msg-content-wrapper:hover .msg-actions { opacity: 1; }
        .msg-menu { position: fixed; display: none; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); padding: 8px 0; min-width: 100px; z-index: 1000; flex-direction: column; border: 1px solid #f2f3f5; }
        .msg-menu-item { padding: 8px 16px; font-size: 14px; color: #1d2129; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
        .msg-menu-item:hover { background: #f2f3f5; }
        .msg-menu-divider { height: 1px; background: #f2f3f5; margin: 4px 0; }
"""

JS_ADD_JS = """
        function showWebsitePreviewMsgMenu(e, isSelf) {
            e.stopPropagation();
            const menu = document.getElementById('websitePreviewMsgMenu');
            menu.style.display = 'flex';
            menu.style.left = e.pageX + 'px';
            menu.style.top = e.pageY + 'px';
            if (isSelf) {
                const recallBtn = menu.querySelector('.msg-menu-recall');
                if(recallBtn) recallBtn.style.display = 'flex';
            } else {
                const recallBtn = menu.querySelector('.msg-menu-recall');
                if(recallBtn) recallBtn.style.display = 'none';
            }
        }
"""

HTML_ADD_HTML = """
    <!-- Website Preview Msg Menu -->
    <div id="websitePreviewMsgMenu" class="msg-menu" onmouseleave="this.style.display='none'">
        <div class="msg-menu-item"><i class="ri-file-copy-line"></i> 复制</div>
        <div class="msg-menu-item"><i class="ri-reply-line"></i> 回复</div>
        <div class="msg-menu-divider"></div>
        <div class="msg-menu-item msg-menu-recall"><i class="ri-arrow-go-back-line"></i> 撤销</div>
    </div>
"""

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Inject CSS
    if '.ww-msg-menu' not in content and '.msg-content-wrapper' not in content:
        content = content.replace('</style>', CSS_ADD_CSS + '\n    </style>')

    # Inject HTML
    if 'websitePreviewMsgMenu' not in content:
        content = content.replace('</body>', HTML_ADD_HTML + '\n</body>')

    # Inject JS
    if 'showWebsitePreviewMsgMenu' not in content:
        content = content.replace('</script>', JS_ADD_JS + '\n    </script>')
        
    # Update hardcoded messages
    # 1. Left message (not self)
    left_msg_target = '''<div style="background: #e8f3ff; color: #111; padding: 14px 16px; border-radius: 4px 12px 12px 12px; font-size: 15px; max-width: 85%; line-height: 1.6;">
                            你好
                        </div>'''
    left_msg_replacement = '''<div class="msg-content-wrapper">
                            <div style="background: #e8f3ff; color: #111; padding: 14px 16px; border-radius: 4px 12px 12px 12px; font-size: 15px; max-width: 85%; line-height: 1.6;">
                                你好
                            </div>
                            <div class="msg-actions" onclick="showWebsitePreviewMsgMenu(event, false)"><i class="ri-more-fill"></i></div>
                        </div>'''
    content = content.replace(left_msg_target, left_msg_replacement)

    # 2. Right message (self)
    right_msg_target = '''<div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 12px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">
                            你好。
                        </div>'''
    right_msg_replacement = '''<div class="msg-content-wrapper" style="flex-direction: row-reverse;">
                            <div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 12px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">
                                你好。
                            </div>
                            <div class="msg-actions" onclick="showWebsitePreviewMsgMenu(event, true)"><i class="ri-more-fill"></i></div>
                        </div>'''
    content = content.replace(right_msg_target, right_msg_replacement)

    # 3. Dynamic new messages (JS)
    js_target = '''const newMsg = document.createElement('div');
                newMsg.style.cssText = 'display: flex; justify-content: flex-end; margin-top: -4px; animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
                newMsg.innerHTML = `<div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 10px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">${text.replace(/</g, "&lt;")}</div>`;'''
    js_replacement = '''const newMsg = document.createElement('div');
                newMsg.style.cssText = 'display: flex; justify-content: flex-end; margin-top: -4px; animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
                newMsg.innerHTML = `<div class="msg-content-wrapper" style="flex-direction: row-reverse;">
                    <div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 10px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">${text.replace(/</g, "&lt;")}</div>
                    <div class="msg-actions" onclick="showWebsitePreviewMsgMenu(event, true)"><i class="ri-more-fill"></i></div>
                </div>`;'''
    content = content.replace(js_target, js_replacement)
    
    js_target_2 = '''const newMsg = document.createElement('div');
                newMsg.style.cssText = 'display: flex; justify-content: flex-end; margin-top: -6px; animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
                newMsg.innerHTML = `<div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 12px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">${text.replace(/</g, "&lt;")}</div>`;'''
    js_replacement_2 = '''const newMsg = document.createElement('div');
                newMsg.style.cssText = 'display: flex; justify-content: flex-end; margin-top: -6px; animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
                newMsg.innerHTML = `<div class="msg-content-wrapper" style="flex-direction: row-reverse;">
                    <div style="background: #fff; border: 1px solid #e5e6eb; color: #111; padding: 12px 16px; border-radius: 12px 4px 12px 12px; font-size: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.01); max-width: 85%; word-break: break-all;">${text.replace(/</g, "&lt;")}</div>
                    <div class="msg-actions" onclick="showWebsitePreviewMsgMenu(event, true)"><i class="ri-more-fill"></i></div>
                </div>`;'''
    content = content.replace(js_target_2, js_replacement_2)

    with open(filepath, 'w') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_agent.html')

