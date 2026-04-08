import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    target = "document.querySelectorAll('.action-menu').forEach(dd => dd.style.display = 'none');"
    replacement = "document.querySelectorAll('.action-menu').forEach(dd => dd.style.display = 'none');\n            const previewMenu = document.getElementById('websitePreviewMsgMenu');\n            if(previewMenu) previewMenu.style.display = 'none';"

    if "websitePreviewMsgMenu" not in content.split("document.addEventListener('click', () => {")[1].split("})")[0]:
        content = content.replace(target, replacement)

    with open(filename, 'w') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_agent.html')
