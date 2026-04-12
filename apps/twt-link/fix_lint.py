with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("onchange=\"this.style.color=\\'#444\\';", "onchange=\"this.style.color='#444';")
with open('link_customer_service.html', 'w', encoding='utf-8') as f:
    f.write(content)
