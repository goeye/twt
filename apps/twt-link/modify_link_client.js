const fs = require('fs');
let html = fs.readFileSync('/Users/pg139/Desktop/反重力/Linkv1.1.0/link_client.html', 'utf-8');

// 1. Remove csActionGroupMore button's onclick and hide it or just remove the element
html = html.replace('<span id="csActionGroupMore" class="td-tooltip tooltip-align-right" style="display: none;" data-tooltip="群设置" onclick="document.getElementById(\'csGroupDetailModal\').style.display=\'flex\'"><i class="ri-more-fill"></i></span>', '');
// Wait, maybe the text varies slightly. Let's use regex.
html = html.replace(/<span id="csActionGroupMore"[^>]*>.*?<\/span>/s, '');

// 2. Extract csGroupDetailModal inner content
const modalRegex = /<div class="modal" id="csGroupDetailModal"[\s\S]*?<!-- Header Card -->([\s\S]*?)<\/div>\s*<\/div>\s*<div class="modal" id="createGroupModal"/;
const match = html.match(modalRegex);
if (!match) {
    console.log("Could not find csGroupDetailModal");
    process.exit(1);
}
let groupContent = '<!-- Header Card -->' + match[1];

// Remove the close button if it's there
groupContent = groupContent.replace(/<i class="ri-close-line"[^>]*><\/i>/, '');

// Adjust grid from 6 columns to 4 columns for members
groupContent = groupContent.replace(/grid-template-columns:\s*repeat\(6,\s*1fr\)/, 'grid-template-columns: repeat(4, 1fr)');

// Wrap in tabContentGroup
groupContent = `
                    <!-- 群设置内容 -->
                    <div id="tabContentGroup" style="display: none; background: #F2F3F5; flex-direction: column; flex: 1; overflow-y: auto; padding-bottom: 24px;">
                        ${groupContent}
                    </div>
`;

// Remove the whole modal from the document
html = html.replace(/<div class="modal" id="csGroupDetailModal"[\s\S]*?<\/div>\s*<\/div>\s*(?=<div class="modal" id="createGroupModal")/, '');

// 3. Insert tabContentGroup after tabContentSession
html = html.replace(/(<div id="tabContentSession"[^>]*>[\s\S]*?<!-- 服务客服 -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/, `$1${groupContent}`);
// Wait, let's be more precise.
// tabContentSession ends where "通讯录应用区" begins? No, it ends inside customerInfoPanel.
// Let's replace </div id="tabContentSession"...> ending.
