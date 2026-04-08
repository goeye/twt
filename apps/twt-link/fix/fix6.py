import os

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update filterQueueChats
    target_filter_queue = """        window.filterQueueChats = function(btn, type) {
            Array.from(btn.parentNode.children).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const items = document.querySelectorAll('#queueListContent .queue-item');
            items.forEach(el => {
                if (type === 'all') el.style.display = 'flex';
                else if (type === 'visitor') el.style.display = el.innerText.includes('访客') ? 'flex' : 'none';
                else if (type === 'customer') el.style.display = el.innerText.includes('客户') ? 'flex' : 'none';
            });
        };"""
    replacement_filter_queue = """        window.filterQueueChats = function(btn, type) {
            Array.from(btn.parentNode.children).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const items = document.querySelectorAll('#queueListContent .queue-item');
            let visibleCount = 0;
            items.forEach(el => {
                let show = false;
                if (type === 'all') show = true;
                else if (type === 'visitor') show = el.innerText.includes('访客');
                else if (type === 'customer') show = el.innerText.includes('客户');
                
                el.style.display = show ? 'flex' : 'none';
                if (show) visibleCount++;
            });
            
            const emptyState = document.getElementById('queueEmptyState');
            if (emptyState) {
                emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
            }
        };"""
    if target_filter_queue in content:
        content = content.replace(target_filter_queue, replacement_filter_queue)

    # 2. Update updateQueueCount properly
    target_update_queue_count = """            if (count === 0) {
                queueListContent.style.display = 'none';
                if(queueEmptyState) queueEmptyState.style.display = 'flex';
            } else {
                queueListContent.style.display = 'block';
                if(queueEmptyState) queueEmptyState.style.display = 'none';
            }"""
    replacement_update_queue_count = """            if (count === 0) {
                queueListContent.style.display = 'none';
                if(queueEmptyState) queueEmptyState.style.display = 'flex';
            } else {
                queueListContent.style.display = 'block';
                const activeFilter = Array.from(document.querySelectorAll('#msgListPanelQueue .filter-tab')).find(el => el.classList.contains('active'));
                let visibleCount = count;
                if (activeFilter) {
                    if (activeFilter.innerText.includes('访客')) visibleCount = vCount;
                    if (activeFilter.innerText.includes('客户')) visibleCount = cCount;
                }
                if(queueEmptyState) queueEmptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
            }"""
    if target_update_queue_count in content:
        content = content.replace(target_update_queue_count, replacement_update_queue_count)

    # 3. Apply chatEmptyState for main panel and applyChatFilters
    target_apply_filters = """                item.style.display = show ? 'flex' : 'none';
            });
        };"""
    replacement_apply_filters = """                item.style.display = show ? 'flex' : 'none';
                if (show) visibleCount++;
            });

            const chatEmptyState = document.getElementById('chatEmptyState');
            if (chatEmptyState) {
                chatEmptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
            }
        };"""
    if target_apply_filters in content:
        # Also need to add let visibleCount = 0; at top of applyChatFilters
        content = content.replace(target_apply_filters, replacement_apply_filters)
        content = content.replace("const items = document.querySelectorAll('#chatList .chat-item');", "const items = document.querySelectorAll('#chatList .chat-item');\n            let visibleCount = 0;")

    # 4. Inject chatEmptyState HTML
    target_chat_list = """                        <div class="list-content" id="chatList">"""
    replacement_chat_list = """                        <div class="list-content" id="chatList">
                            <!-- chat empty state -->
                            <div id="chatEmptyState" style="display: none; flex: 1; align-items: center; justify-content: center; flex-direction: column; color: var(--text-tertiary); padding-top: 40px;">
                                <i class="ri-inbox-2-line" style="font-size: 48px; margin-bottom: 8px; color: #E5E6EB;"></i>
                                <span style="font-size: 13px;">暂无匹配会话</span>
                            </div>"""
    if target_chat_list in content:
        content = content.replace(target_chat_list, replacement_chat_list)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_client.html')
