import re

with open('link_customer_service.html', 'r', encoding='utf-8') as f:
    html = f.read()

toggle_js = "(function(el){ var isOn = el.getAttribute('data-on') === 'true'; el.setAttribute('data-on', !isOn); el.style.background = !isOn ? '#2970FF' : '#e5e6eb'; var knob = el.children[0]; if(!isOn) { knob.style.left = 'auto'; knob.style.right = '2px'; } else { knob.style.right = 'auto'; knob.style.left = '2px'; }})(this)"

html = html.replace(f'onclick="{toggle_js}"', 'onclick="toggleSwitchStatus(this)"')

# Add the function definition if it doesn't exist
if 'function toggleSwitchStatus(el)' not in html:
    func_def = """
        function toggleSwitchStatus(el) {
            var isOn = el.getAttribute('data-on') === 'true';
            el.setAttribute('data-on', !isOn);
            el.style.background = !isOn ? '#2970FF' : '#e5e6eb';
            var knob = el.children[0];
            if(!isOn) {
                knob.style.left = 'auto';
                knob.style.right = '2px';
            } else {
                knob.style.right = 'auto';
                knob.style.left = '2px';
            }
        }
    """
    html = html.replace("</script>", func_def + "\n    </script>", 1)

with open('link_customer_service.html', 'w', encoding='utf-8') as f:
    f.write(html)
