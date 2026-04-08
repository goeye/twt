import re

def fix_messages():
    file_path = '/Users/pg139/Desktop/反重力/Linkv1.1.0/link_client.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the entire block from `if (name === '[客服咨询]问题处理群聊' || isServiceChat) {`
    # down to `} else if (type === 'group') {`

    # Start matching at `if (name === '[客服咨询]问题处理群聊' || isServiceChat) {`
    # end matching exactly before `} else if (type === 'group') {`

    pattern = re.compile(r'(if \(\s*name === \'\[客服咨询\]问题处理群聊\'\s*\|\|\s*isServiceChat\s*\)\s*\{)(.*?)(\}\s*else if\s*\(\s*type === \'group\'\s*\)\s*\{)', re.DOTALL)
    
    match = pattern.search(content)
    if not match:
        print("Could not find the target block.")
        return
    
    # Extract the block that contains the 3-message template currently shared by all service chats
    shared_html = match.group(2)
    # The current shared html contains "你好", "欢迎王三入群", and "@张四 你好".
    # I want to assign that ONLY to '[客服咨询]问题处理群聊'.
    
    new_script = """
            if (name === '访客00001') {
                messageArea.innerHTML = `
<div class="msg-row" style="margin-top: 20px;">
    ${senderAvatarHtml}
    <div class="msg-col">
        <div class="msg-name">访客00001</div>
        <div class="msg-wrapper">
            <div class="msg-bubble">你好</div>
            <div class="msg-actions" onclick="showMsgMenu(event, false)"><i class="ri-more-fill"></i></div>
        </div>
    </div>
</div>`;
            } else if (name === '访客00003') {
                messageArea.innerHTML = `
<div class="msg-row" style="margin-top: 20px;">
    ${senderAvatarHtml}
    <div class="msg-col">
        <div class="msg-name">访客00003</div>
        <div class="msg-wrapper">
            <div class="msg-bubble">请问发货了吗？</div>
            <div class="msg-actions" onclick="showMsgMenu(event, false)"><i class="ri-more-fill"></i></div>
        </div>
    </div>
</div>`;
            } else if (name === '访客00004') {
                messageArea.innerHTML = `
<div class="msg-row self" style="margin-top: 20px;">
    <div class="chat-avatar" style="width: 32px; height: 32px; background:#DCE6FE; color:var(--primary-color); border-radius:8px; font-size:14px; font-weight:500;">王三</div>
    <div class="msg-col">
        <div class="msg-wrapper">
            <div class="msg-bubble">好的，明白了</div>
            <div class="msg-actions" onclick="showMsgMenu(event, true)"><i class="ri-more-fill"></i></div>
        </div>
        <div class="msg-read-status read">已读</div>
    </div>
</div>`;
            } else if (name === '客户00006') {
                messageArea.innerHTML = `
<div class="msg-row" style="margin-top: 20px;">
    ${senderAvatarHtml}
    <div class="msg-col">
        <div class="msg-name">客户00006</div>
        <div class="msg-wrapper">
            <div class="msg-bubble">谢谢</div>
            <div class="msg-actions" onclick="showMsgMenu(event, false)"><i class="ri-more-fill"></i></div>
        </div>
    </div>
</div>`;
            } else if (name === '客户00007') {
                messageArea.innerHTML = `
<div class="msg-row self" style="margin-top: 20px;">
    <div class="chat-avatar" style="width: 32px; height: 32px; background:#DCE6FE; color:var(--primary-color); border-radius:8px; font-size:14px; font-weight:500;">王三</div>
    <div class="msg-col">
        <div class="msg-wrapper">
            <div class="msg-bubble">再见</div>
            <div class="msg-actions" onclick="showMsgMenu(event, true)"><i class="ri-more-fill"></i></div>
        </div>
        <div class="msg-read-status read">已读</div>
    </div>
</div>`;
            } else if (name === '[客服咨询]问题处理群聊') {
""" + shared_html + """
            } else if (isServiceChat) {
                messageArea.innerHTML = `
<div class="msg-row" style="margin-top: 20px;">
    ${senderAvatarHtml}
    <div class="msg-col">
        <div class="msg-name">${senderName}</div>
        <div class="msg-wrapper">
            <div class="msg-bubble">这是最新的需求说明文档</div>
            <div class="msg-actions" onclick="showMsgMenu(event, false)"><i class="ri-more-fill"></i></div>
        </div>
    </div>
</div>`;
            """

    new_content = content[:match.start()] + new_script + match.group(3) + content[match.end():]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Fixed chat messages!")

if __name__ == '__main__':
    fix_messages()
