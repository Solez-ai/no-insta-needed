document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const retryBtn = document.getElementById('retry-btn');

    const initialState = document.getElementById('initial-state');
    const successState = document.getElementById('success-state');
    const errorState = document.getElementById('error-state');
    const resultLink = document.getElementById('result-link');
    const errorMsg = document.getElementById('error-msg');

    // TODO: Update this to your deployed Vercel domain
    const BASE_URL = "https://no-insta.vercel.app";

    // Regex patterns
    // Matches: https://www.instagram.com/reels/ABC123_xyz/?...
    // Matches: https://instagram.com/reel/ABC123_xyz
    const IG_REEL_REGEX = /^https?:\/\/(www\.)?instagram\.com\/reels?\/([^\/?]+)/;

    copyBtn.addEventListener('click', handleCopy);
    resetBtn.addEventListener('click', resetUI);
    retryBtn.addEventListener('click', resetUI);

    function handleCopy() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || tabs.length === 0) {
                showError("Could not detect active tab.");
                return;
            }

            const activeTab = tabs[0];
            const url = activeTab.url;

            if (!url) {
                showError("Could not read URL.");
                return;
            }

            if (!url.includes("instagram.com")) {
                showError("Please open Instagram first.");
                return;
            }

            const match = url.match(IG_REEL_REGEX);

            if (match && match[2]) {
                const reelId = match[2];
                const newUrl = `${BASE_URL}/view/${reelId}`;

                copyToClipboard(newUrl);
            } else {
                showError("Please open a specific Instagram Reel.");
            }
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showSuccess(text);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showError("Failed to copy to clipboard.");
        });
    }

    function showSuccess(url) {
        resultLink.value = url;
        initialState.classList.add('hidden');
        errorState.classList.add('hidden');
        successState.classList.remove('hidden');
    }

    function showError(message) {
        errorMsg.textContent = message;
        initialState.classList.add('hidden');
        successState.classList.add('hidden');
        errorState.classList.remove('hidden');
    }

    function resetUI() {
        initialState.classList.remove('hidden');
        successState.classList.add('hidden');
        errorState.classList.add('hidden');
        resultLink.value = '';
    }
});
