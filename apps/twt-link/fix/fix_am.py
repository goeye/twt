with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<!-- 添加成员独立页面 -->')
if start == -1:
    print("Start not found")
else:
    # Find the end of addMemberPge component
    end = content.find('</script>\n        </div>\n        <div class="calendar-page" id="mobileSearchPage"', start)
    if end == -1:
        print("End not found")
    else:
        block = content[start:end]
        block = block.replace('Cgc', 'Am')
        content = content[:start] + block + content[end:]
        with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Replaced Cgc with Am in addMemberPage")
