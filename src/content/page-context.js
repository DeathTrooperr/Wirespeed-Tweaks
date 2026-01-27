// This script runs in the MAIN world context to access window.Intercom
window.addEventListener('wirespeed-tweaks-open-chat', () => {
  if (window.Intercom) {
    window.Intercom('show');
  } else if (window.HelpScout) {
    window.HelpScout('show');
  } else {
    console.log('Chat event received, but no widget found in page context.');
  }
});
