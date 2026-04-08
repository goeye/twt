import re

with open('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_mobile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the sessionInfoPage content
start_idx = content.find('<div id="spContentSession"')
end_idx = content.find('<!-- End Session Button')

if start_idx != -1 and end_idx != -1:
    sub_content = content[start_idx:end_idx]
    
    # 1. Remove all ri-arrow-up-s-line
    sub_content = re.sub(r'<i class="ri-arrow-up-s-line"[^>]*></i>', '', sub_content)
    
    # 2. Replace font-size: 15px with 14px
    sub_content = sub_content.replace('font-size: 15px;', 'font-size: 14px;')
    
    # 3. Replace font-size: 16px with 14px (for fields and headers)
    sub_content = sub_content.replace('font-size: 16px;', 'font-size: 14px;')
    
    # 4. Replace left-over margin/padding issues if ri-arrow... removal leaves empty space
    
    new_content = content[:start_idx] + sub_content + content[end_idx:]
    with open('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_mobile.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated font sizes and removed arrows.")
else:
    print("Could not find the target section.")
