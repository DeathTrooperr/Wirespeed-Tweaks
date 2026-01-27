document.addEventListener('DOMContentLoaded', () => {
  const enabledSelect = document.getElementById('enabled');
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const statusEl = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
    if (result.enabled !== undefined) {
      enabledSelect.value = result.enabled.toString();
    }
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const enabled = enabledSelect.value === 'true';
    const apiKey = apiKeyInput.value;

    chrome.storage.sync.set({ enabled, apiKey }, () => {
      statusEl.classList.remove('hidden');
      setTimeout(() => {
        statusEl.classList.add('hidden');
      }, 2000);
    });
  });
});
