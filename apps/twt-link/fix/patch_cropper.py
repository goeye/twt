import re

with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace handleLogoUpload
old_js = """        function handleLogoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                
                // Update Config panel logo
                const configImg = document.getElementById('configLogoImg');
                const configIcon = document.getElementById('configLogoIcon');
                if (configImg && configIcon) {
                    configImg.src = url;
                    configImg.style.display = 'block';
                    configIcon.style.display = 'none';
                }

                // Update Preview panel logo
                const prevImg = document.getElementById('previewLogoImg');
                const prevIcon = document.getElementById('previewLogoIcon');
                if (prevImg && prevIcon) {
                    prevImg.src = url;
                    prevImg.style.display = 'block';
                    prevIcon.style.display = 'none';
                }
            }
        }"""

new_js = """        let temporaryCropUrl = null;

        function handleLogoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                temporaryCropUrl = URL.createObjectURL(file);
                const cropperImg = document.getElementById('cropperSourceImg');
                if (cropperImg) cropperImg.src = temporaryCropUrl;
                document.getElementById('imageCropModal').style.display = 'flex';
                event.target.value = '';
            }
        }

        function confirmCrop() {
            if (temporaryCropUrl) {
                // Update Config panel logo
                const configImg = document.getElementById('configLogoImg');
                const configIcon = document.getElementById('configLogoIcon');
                if (configImg && configIcon) {
                    configImg.src = temporaryCropUrl;
                    configImg.style.display = 'block';
                    configIcon.style.display = 'none';
                }

                // Update Preview panel logo
                const prevImg = document.getElementById('previewLogoImg');
                const prevIcon = document.getElementById('previewLogoIcon');
                if (prevImg && prevIcon) {
                    prevImg.src = temporaryCropUrl;
                    prevImg.style.display = 'block';
                    prevIcon.style.display = 'none';
                }
            }
            document.getElementById('imageCropModal').style.display = 'none';
        }"""

if old_js in html:
    html = html.replace(old_js, new_js)
else:
    print("handleLogoUpload not found")

# Append Modal HTML
modal_html = """
    <!-- 图片裁剪 Modal -->
    <div class="modal center" id="imageCropModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 4000; align-items: center; justify-content: center;">
        <div class="modal-center-content" style="width: 800px; max-width: 90vw; background: #fff; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <!-- Header -->
            <div style="padding: 24px 24px 16px 24px; font-size: 18px; font-weight: 600; color: #111;">图片裁剪</div>
            
            <!-- Cropper Area -->
            <div style="padding: 0 24px; display: flex; justify-content: center;">
                <div style="position: relative; width: 100%; height: 460px; background-color: #f0f0f0; background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px;">
                    <!-- Original Image under overlay -->
                    <img id="cropperSourceImg" src="" style="position: absolute; max-width: 100%; max-height: 100%; object-fit: contain; z-index: 1;">
                    
                    <!-- Crop Box Wrapper (Mask created by massive box shadow) -->
                    <div style="position: relative; width: 276px; height: 276px; border: 2px solid #2970FF; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5); z-index: 2; box-sizing: border-box; cursor: move;">
                        <!-- 4 dots -->
                        <div style="position: absolute; top: -6px; left: -6px; width: 10px; height: 10px; background: #2970FF; border-radius: 50%;"></div>
                        <div style="position: absolute; top: -6px; right: -6px; width: 10px; height: 10px; background: #2970FF; border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: -6px; left: -6px; width: 10px; height: 10px; background: #2970FF; border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: -6px; right: -6px; width: 10px; height: 10px; background: #2970FF; border-radius: 50%;"></div>
                        <!-- Label 276 x 276 -->
                        <div style="position: absolute; top: -34px; left: -2px; background: #111; color: #fff; font-size: 14px; padding: 4px 8px; border-radius: 4px; display: flex; align-items: center; font-family: monospace;">276 &times; 276</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="padding: 24px; display: flex; justify-content: flex-end; gap: 12px;">
                <button style="height: 40px; padding: 0 24px; border: 1px solid #e5e6eb; background: #fff; color: #111; border-radius: 8px; cursor: pointer; font-size: 14px; transition: 0.2s;" onmouseover="this.style.background='#f2f3f5'" onmouseout="this.style.background='#fff'" onclick="document.getElementById('imageCropModal').style.display='none'">取消</button>
                <button style="height: 40px; padding: 0 32px; border: none; background: #2970FF; color: #fff; border-radius: 8px; cursor: pointer; font-size: 14px; transition: 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" onclick="confirmCrop()">确定</button>
            </div>
        </div>
    </div>
</body>"""

if 'id="imageCropModal"' not in html:
    html = html.replace("</body>", modal_html)
else:
    print("Modal already exists")

with open('link_customer_service.html', 'w', encoding='utf-8') as f:
    f.write(html)
