with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<div class="chat-page" id="addMemberPage"')
end = content.find('function submitAddMember()')

if start != -1 and end != -1:
    end = content.find('</script>', end)
    block = content[start:end]
    block = block.replace('Cgc', 'Am')
    content = content[:start] + block + content[end:]
    with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Indices not found")
