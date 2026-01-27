chrome.runtime.onInstalled.addListener(() => {
  console.log('Wirespeed Tweaks Extension Installed');
  
  // Set default values if not already set
  chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
    if (result.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});
