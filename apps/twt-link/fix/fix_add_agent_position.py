import re

with open('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_mobile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract the code block
start_marker = "        <!-- 添加客服界面 -->"
start_idx = content.find(start_marker)

# Find the next </body> after the start marker to slice out everything
body_end_idx = content.find("</body>", start_idx)

if start_idx != -1 and body_end_idx != -1:
    extracted = content[start_idx:body_end_idx].strip()
    
    # Remove it from the bottom
    content = content[:start_idx] + "\n</body>" + content[body_end_idx+7:]
    
    # 2. Find the target position: before the script tag starting around line 1630
    script_idx = content.find("    <script>\n        function showToast")
    if script_idx != -1:
        # Find the </div> just before script_idx
        div_idx = content.rfind("</div>", 0, script_idx)
        if div_idx != -1:
            # We insert it right before the </div> that closes phone-frame
            # Actually, to be safe, I'll insert it right before "    <script>" BUT inside phone-frame.
            # wait, the phone-frame closing div is right before the script.
            # The structure is:
            # 1628:     </div>
            # 1629: 
            # 1630:     <script>
            
            # So I should find "    </div>\n\n    <script>"
            target = "    </div>\n\n    <script>"
            if target in content:
                content = content.replace(target, "        " + extracted + "\n\n" + target)
                with open('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_mobile.html', 'w', encoding='utf-8') as f:
                    f.write(content)
                print("Successfully moved '添加客服界面' inside phone-frame!")
            else:
                print("Target location '    </div>\\n\\n    <script>' not found.")
        else:
            print("Couldn't find closing </div>.")
    else:
        print("Couldn't find '<script>\\n        function showToast'.")
else:
    print("Couldn't find start or end markers for extraction.")
