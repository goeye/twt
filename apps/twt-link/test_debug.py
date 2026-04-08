from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('file:///Users/pg139/Desktop/反重力/Linkv1.1.0/link_customer_service.html')
        
        # open preview modal
        print("Opening preview modal...")
        page.evaluate('showWebsitePreviewModal()')
        
        # turn on chat view
        print("Opening chat view...")
        page.evaluate("document.getElementById('websiteWidgetListView').style.display = 'none'; document.getElementById('websiteWidgetChatView').style.display = 'flex';")
        
        # get the msg-actions button
        actions = page.locator('.msg-actions').first
        actions.wait_for()
        print(f"msg-actions visible? {actions.is_visible()}")
        
        # try clicking it
        actions.click()
        
        # check msg menu
        menu = page.locator('#websitePreviewMsgMenu')
        print(f"msg-menu display style: {menu.evaluate('node => window.getComputedStyle(node).display')}")
        print(f"msg-menu z-index: {menu.evaluate('node => window.getComputedStyle(node).zIndex')}")
        
        browser.close()

if __name__ == '__main__':
    test()
