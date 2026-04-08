import re

def fix_avatar_sizes():
    file_path = '/Users/pg139/Desktop/反重力/Linkv1.1.0/link_client.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace width: 36px; height: 36px; with width: 32px; height: 32px; 
    # anywhere inside the `<div class="chat-avatar"` string.
    # Also fix font-size: 14px to font-size: 13px just to be safe for 32px boxes, but 14px might be fine. Let's just do 32x32.
    
    # We only apply this after a certain line or just globally since we want message avatars to match header avatars (which are 32x32).
    # Wait, are there other 36x36 avatars?
    # From grep output, there are 14 occurrences, all in the JS message rendering section!
    
    modified_content = re.sub(
        r'(class="chat-avatar"[^>]*?)width:\s*36px;\s*height:\s*36px;',
        r'\1width: 32px; height: 32px;',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified_content)
        
    print("Fixed avatar sizes!")

if __name__ == '__main__':
    fix_avatar_sizes()
