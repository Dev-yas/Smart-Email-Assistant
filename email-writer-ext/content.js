console.log("📩 Email Writer Extension - Content Script Loaded");

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function insertPlainTextWithNewlines(element, text) {
    element.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    selection.deleteFromDocument();

    const lines = text.split('\n');

    // Insert lines in reverse order so the final text appears correctly top-to-bottom
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].length > 0) {
            selection.getRangeAt(0).insertNode(document.createTextNode(lines[i]));
        }
        if (i !== 0) {
            const br = document.createElement('br');
            selection.getRangeAt(0).insertNode(br);
        }
    }

    selection.collapseToEnd();
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("❌ Toolbar not found");
        return;
    }

    console.log("✅ Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = '⏳ Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const data = await response.json();
            const generatedReply = data.reply || "";

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                insertPlainTextWithNewlines(composeBox, generatedReply);
            } else {
                console.error('❌ Compose box was not found');
            }
        } catch (error) {
            console.error("❌ Failed to generate reply:", error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("✉️ Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
