// This script runs in the MAIN world context to access window.Intercom and site-level storage
window.addEventListener('wirespeed-tweaks-open-chat', () => {
  if (window.Intercom) {
    window.Intercom('show');
  } else if (window.HelpScout) {
    window.HelpScout('show');
  } else {
    console.log('Chat event received, but no widget found in page context.');
  }
});

// Extract JWT from storage and send it to the content script
function extractAndSendJWT() {
  // Common places to find JWT in web apps
  const jwt = sessionStorage.getItem('AUTH_TOKEN');

  if (jwt) {
    window.postMessage({ type: 'WIRESPEED_TWEAKS_JWT', jwt }, '*');
  }
}

// Initial extraction
extractAndSendJWT();

// Periodically check if JWT changes or becomes available
setInterval(extractAndSendJWT, 5000);
