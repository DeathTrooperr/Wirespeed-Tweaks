chrome.runtime.onInstalled.addListener(() => {
  console.log('Wirespeed Tweaks Extension Installed');
  
  // Set default values if not already set
  chrome.storage.sync.get(['enabled'], (result) => {
    if (result.enabled === undefined) {
      chrome.storage.sync.set({ 
        enabled: true,
        tweakNavigation: true,
        tweakDeleteCase: true,
        tweakSupportChat: true,
        tweakDeleteDetection: true
      });
    }
  });
});

// Open side panel on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
