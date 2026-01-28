document.addEventListener('DOMContentLoaded', async () => {
  const elements = {
    enabled: document.getElementById('enabled'),
    tweakNavigation: document.getElementById('tweakNavigation'),
    tweakDeleteCase: document.getElementById('tweakDeleteCase'),
    tweakSupportChat: document.getElementById('tweakSupportChat'),
    tweakDeleteDetection: document.getElementById('tweakDeleteDetection'),
    save: document.getElementById('save'),
    status: document.getElementById('status')
  };

  const keys = Object.keys(elements).filter(k => k !== 'save' && k !== 'status');

  // Load saved settings
  const settings = await chrome.storage.sync.get(keys);
  
  keys.forEach(key => {
    const el = elements[key];
    if (!el) return;
    const val = settings[key];
    if (el.type === 'checkbox') {
      el.checked = val !== false; // Default to true
    } else if (el.tagName === 'SELECT') {
      el.value = (val !== undefined ? val : true).toString();
    } else {
      el.value = val || '';
    }
  });

  // Save settings
  elements.save.addEventListener('click', async () => {
    const newSettings = {};
    keys.forEach(key => {
      const el = elements[key];
      if (!el) return;
      if (el.type === 'checkbox') {
        newSettings[key] = el.checked;
      } else if (el.tagName === 'SELECT') {
        newSettings[key] = el.value === 'true';
      } else {
        newSettings[key] = el.value;
      }
    });
    
    await chrome.storage.sync.set(newSettings);
    
    elements.status.classList.remove('hidden');
    setTimeout(() => {
      elements.status.classList.add('hidden');
    }, 2000);
  });
});
