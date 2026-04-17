const fs = require('fs');
const html = fs.readFileSync('/Users/pg139/Desktop/Linkv1.1.0/link_customer_service.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const window = dom.window;
const document = window.document;

// Execute the final script tag
const scripts = document.querySelectorAll('script');
for (let script of scripts) {
    if (script.innerHTML.includes('openResetAppSecretModal')) {
        try {
            window.eval(script.innerHTML);
            console.log("Script evaluated successfully.");
        } catch(e) {
            console.log("Error evaluating script:", e);
        }
    }
}

try {
    window.openResetAppSecretModal();
    const modal = document.getElementById('resetAppSecretModal');
    console.log("Modal display after calling:", modal.style.display);
} catch(e) {
    console.log("Error triggering function:", e);
}
