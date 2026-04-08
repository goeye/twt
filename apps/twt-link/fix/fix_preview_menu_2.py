import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # JS replacement
    old_js = """        function showWebsitePreviewMsgMenu(e, isSelf) {
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
        }"""
        
    new_js = """        function showWebsitePreviewMsgMenu(e, isSelf) {
            e.stopPropagation();
            const menu = document.getElementById('websitePreviewMsgMenu');
            menu.style.display = 'flex';
            menu.style.left = e.pageX + 'px';
            menu.style.top = e.pageY + 'px';
            
            const recallBtn = menu.querySelector('.msg-menu-recall');
            const divider = menu.querySelector('.msg-menu-divider');
            
            if (isSelf) {
                if(recallBtn) recallBtn.style.display = 'flex';
                if(divider) divider.style.display = 'block';
            } else {
                if(recallBtn) recallBtn.style.display = 'none';
                if(divider) divider.style.display = 'none';
            }
        }"""
    
    content = content.replace(old_js, new_js)

    # CSS replacement
    old_css = """.msg-menu { position: fixed; display: none; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); padding: 8px 0; min-width: 100px; z-index: 1000; flex-direction: column; border: 1px solid #f2f3f5; }
        .msg-menu-item { padding: 8px 16px; font-size: 14px; color: #1d2129; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }"""
        
    new_css = """.msg-menu { position: fixed; display: none; background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); padding: 8px 0; min-width: 120px; z-index: 1000; flex-direction: column; border: 1px solid #f2f3f5; }
        .msg-menu-item { padding: 12px 20px; font-size: 15px; color: #1d2129; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: background 0.2s; }
        .msg-menu-item i { font-size: 18px; color: #4e5969; }"""

    content = content.replace(old_css, new_css)

    with open(filename, 'w') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_agent.html')
