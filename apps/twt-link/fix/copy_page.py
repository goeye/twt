import re

with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract lines 1775 to 1936 (0-indexed 1774 to 1936)
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if '<div class="chat-page" id="createGroupChatPage"' in line:
        start_idx = i - 1 # Include the comment
    if 'function submitCreateGroupChat()' in line:
        end_idx = i + 5

block = "".join(lines[start_idx:end_idx])

# Modify the block
block = block.replace('createGroupChatPage', 'addMemberPage')
block = block.replace('cgc', 'am')
block = block.replace('createGroupChat', 'addMember')
block = block.replace('submitCreateGroupChat', 'submitAddMember')
block = block.replace('openCreateGroupChatPage', 'openAddMemberPage')
block = block.replace('发起群聊', '添加成员')
block = block.replace('<!-- 添加成员 -->', '<!-- 添加成员 -->')
# fix comment
block = block.replace('<!-- 发起群聊 -->', '<!-- 添加成员独立页面 -->')

# Insert after createGroupChatPage (end_idx)
lines.insert(end_idx, '\n' + block + '\n')

with open('/Users/pg139/Desktop/Linkv1.1.0/link_mobile.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
