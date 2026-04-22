import re

with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('/tmp/tabs_replacement.html', 'r', encoding='utf-8') as f:
    tabs_content = f.read()

# Replace cust-content-other
pattern_other = re.compile(r'<div id="cust-content-other" style="display: none; justify-content: center; align-items: center; padding-top: 80px;">.*?</div>\s*</div>', re.DOTALL)
html = pattern_other.sub(tabs_content + '\n', html, count=1)

# Replace switchCustTab logic
new_js_logic = """                        if(tabId === 'appearance') {
                            document.getElementById('cust-content-appearance').style.display = 'flex';
                            document.getElementById('cust-content-content').style.display = 'none';
                            document.getElementById('cust-content-form').style.display = 'none';
                            document.getElementById('cust-content-general').style.display = 'none';
                        } else if(tabId === 'content') {
                            document.getElementById('cust-content-appearance').style.display = 'none';
                            document.getElementById('cust-content-content').style.display = 'flex';
                            document.getElementById('cust-content-form').style.display = 'none';
                            document.getElementById('cust-content-general').style.display = 'none';
                        } else if(tabId === 'form') {
                            document.getElementById('cust-content-appearance').style.display = 'none';
                            document.getElementById('cust-content-content').style.display = 'none';
                            document.getElementById('cust-content-form').style.display = 'flex';
                            document.getElementById('cust-content-general').style.display = 'none';
                        } else if(tabId === 'general') {
                            document.getElementById('cust-content-appearance').style.display = 'none';
                            document.getElementById('cust-content-content').style.display = 'none';
                            document.getElementById('cust-content-form').style.display = 'none';
                            document.getElementById('cust-content-general').style.display = 'flex';
                        }"""

pattern_js = re.compile(r'if\(tabId === \'appearance\'\) \{.*?(?=^\s*\})', re.DOTALL | re.MULTILINE)
html = pattern_js.sub(new_js_logic + '\n', html, count=1)

with open('link_customer_service.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML patched")
