import re

with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update shortcutListWrapper in Config Panel
old_config = """                        <div class="panel-content" style="display: none; margin-top: 24px; flex-direction: column; gap: 24px;">
                            <div style="background: #f7f8fa; border-radius: 12px; padding: 20px; display: flex; align-items: flex-start;">
                                <div style="background: #fff; padding: 8px 16px 8px 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='#fff'" onclick="document.getElementById('addShortcutModal').style.display='flex'">"""

new_config = """                        <div class="panel-content" style="display: none; margin-top: 24px; flex-direction: column; gap: 24px;">
                            <div id="shortcutListWrapper" style="background: #f7f8fa; border-radius: 12px; padding: 20px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px;">
                                <div style="background: #fff; padding: 8px 16px 8px 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='#fff'" onclick="document.getElementById('addShortcutModal').style.display='flex'">"""

if old_config in html:
    html = html.replace(old_config, new_config)
else:
    print("Warning: old_config not found!")

# 2. Update Preview Panel Input Area to include wrapper
old_preview = """                                <div style="margin-top: auto; padding-top: 16px; padding-bottom: 0;">
                                    <div style="background: #fff; border-radius: 12px; padding: 12px 16px; border: 1px solid #e5e6eb; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">"""

new_preview = """                                <div style="margin-top: auto; padding-top: 16px; padding-bottom: 0; display: flex; flex-direction: column;">
                                    <div id="previewShortcutWrapper" style="display: none; flex-wrap: wrap; gap: 8px;"></div>
                                    <div style="background: #fff; border-radius: 12px; padding: 12px 16px; border: 1px solid #e5e6eb; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">"""

if old_preview in html:
    html = html.replace(old_preview, new_preview)
else:
    print("Warning: old_preview not found!")

with open('link_customer_service.html', 'w', encoding='utf-8') as f:
    f.write(html)
