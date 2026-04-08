import re

with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """                <!-- 标题 -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="font-size: 14px; font-weight: 500; color: #111;">标题</div>
                    <input type="text" placeholder="请输入标题" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid #e5e6eb; border-radius: 8px; font-size: 14px; color: #111; outline: none; box-sizing: border-box; transition: border 0.2s;" onfocus="this.style.borderColor='#2970FF'" onblur="this.style.borderColor='#e5e6eb'">
                </div>

                <!-- 图标 -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="font-size: 14px; font-weight: 500; color: #111;">图标</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background: #f7f8fa; border: 1px dashed #e5e6eb; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <i class="ri-add-line" style="color: #c9cdd4; font-size: 20px;"></i>
                        </div>
                        <div style="font-size: 13px; color: #86909c;">支持.jpg.png格式，大小在1MB以内，160x160</div>
                    </div>
                </div>"""

replacement = """                <!-- 标题 -->
                <div style="display: flex; flex-direction: column; gap: 8px; position: relative;">
                    <div style="font-size: 14px; font-weight: 500; color: #111;">标题</div>
                    <input id="shortcutTitleInput" type="text" placeholder="请输入标题" style="width: 100%; height: 38px; padding: 0 12px; border: 1px solid #e5e6eb; border-radius: 8px; font-size: 14px; color: #111; outline: none; box-sizing: border-box; transition: border 0.2s;" onfocus="this.style.borderColor='#2970FF'; document.getElementById('shortcutTitleDropdown').style.display='block';" onblur="this.style.borderColor='#e5e6eb'; setTimeout(function(){var d=document.getElementById('shortcutTitleDropdown'); if(d) d.style.display='none';}, 200);">
                    
                    <!-- 下拉弹窗 -->
                    <div id="shortcutTitleDropdown" style="display: none; position: absolute; top: 70px; left: 0; right: 0; background: #fff; border: 1px solid #e5e6eb; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); z-index: 10; max-height: 240px; overflow-y: auto; padding: 4px 0;">
                        <!-- JS injected options -->
                    </div>
                </div>

                <!-- 图标 -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="font-size: 14px; font-weight: 500; color: #111;">图标</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div id="shortcutIconWrapper" style="width: 42px; height: 42px; border-radius: 50%; background: #f7f8fa; border: 1px dashed #e5e6eb; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden;">
                            <i id="shortcutIconEl" class="ri-add-line" style="color: #c9cdd4; font-size: 20px;"></i>
                        </div>
                        <div style="font-size: 13px; color: #86909c;">支持.jpg.png格式，大小在1MB以内，160x160</div>
                    </div>
                </div>

                <script>
                    (function() {
                        var shortcutOptions = [
                            { name: 'Email', icon: 'ri-mail-fill', color: '#111' },
                            { name: 'Telephone', icon: 'ri-phone-fill', color: '#111' },
                            { name: 'Adress', icon: 'ri-map-pin-fill', color: '#111' },
                            { name: 'Telegram', icon: 'ri-telegram-fill', color: '#0088cc' },
                            { name: 'X', icon: 'ri-twitter-x-line', color: '#111' },
                            { name: 'Whatsapp', icon: 'ri-whatsapp-fill', color: '#25D366' },
                            { name: 'Instagram', icon: 'ri-instagram-line', color: '#E1306C' },
                            { name: 'Facebook', icon: 'ri-facebook-circle-fill', color: '#1877F2' },
                            { name: 'Linkedin', icon: 'ri-linkedin-fill', color: '#0A66C2' },
                            { name: 'Discord', icon: 'ri-discord-fill', color: '#5865F2' },
                            { name: 'Youtube', icon: 'ri-youtube-fill', color: '#FF0000' }
                        ];

                        var dropdownEl = document.getElementById('shortcutTitleDropdown');
                        shortcutOptions.forEach(function(opt) {
                            var div = document.createElement('div');
                            div.style.cssText = 'padding: 10px 16px; font-size: 14px; color: #111; cursor: pointer; transition: 0.2s;';
                            div.innerText = opt.name;
                            div.onmouseover = function() { this.style.background = '#f2f3f5'; };
                            div.onmouseout = function() { this.style.background = 'transparent'; };
                            div.onclick = function() {
                                document.getElementById('shortcutTitleInput').value = opt.name;
                                var iconWrapper = document.getElementById('shortcutIconWrapper');
                                iconWrapper.style.border = 'none';
                                iconWrapper.style.background = '#f2f3f5';
                                iconWrapper.innerHTML = '<i class=\"' + opt.icon + '\" style=\"color: ' + opt.color + '; font-size: 24px;\"></i>';
                            };
                            dropdownEl.appendChild(div);
                        });
                    })();
                </script>"""

if target in html:
    html = html.replace(target, replacement)
    with open('link_customer_service.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replacement successful")
else:
    print("Target not found. Please review the target string.")
