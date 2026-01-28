// Wirespeed Tweaks Content Script
console.log('Wirespeed Tweaks loaded');

const NEW_ASSETS = [
  {
    name: 'IPs',
    href: '/assets/ips',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>'
  },
  {
    name: 'Files',
    href: '/assets/files',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-files"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v4.5c0 .3.2.5.5.5H20"/></svg>'
  },
  {
    name: 'Processes',
    href: '/assets/processes',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
  },
  {
    name: 'Locations',
    href: '/assets/locations',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
  }
];

let settings = {
  enabled: true,
  tweakNavigation: true,
  tweakDeleteCase: true,
  tweakSupportChat: true,
  tweakDeleteDetection: true
};

let siteJwt = null;

// Listen for JWT from page context
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data && event.data.type === 'WIRESPEED_TWEAKS_JWT') {
    siteJwt = event.data.jwt;
  }
});

function getAuthToken() {
  return siteJwt;
}

/**
 * Utility to find a sidebar group by label
 */
function findSidebarGroup(labelName) {
  const groups = document.querySelectorAll('div[data-sidebar="group"]');
  for (const group of groups) {
    const label = group.querySelector('div[data-sidebar="group-label"]');
    if (label && label.textContent.trim() === labelName) {
      return group;
    }
  }
  return null;
}

/**
 * Navigation Shortcuts Tweak
 */
function injectAssets() {
  const assetsGroup = findSidebarGroup('Assets');
  if (!assetsGroup) return;

  const content = assetsGroup.querySelector('div[data-sidebar="group-content"]');
  if (!content || content.querySelector('[data-injected-by="wirespeed-tweaks"]')) return;

  if (!settings.enabled || !settings.tweakNavigation) return;

  NEW_ASSETS.forEach(asset => {
    const li = document.createElement('li');
    li.setAttribute('data-sidebar', 'menu-item');
    li.className = 'group/menu-item relative rounded-md';
    li.innerHTML = `
      <a data-sidebar="menu-button" data-size="default" data-active="false" href="${asset.href}" data-injected-by="wirespeed-tweaks" 
         class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm font-medium">
        ${asset.icon}
        <span>${asset.name}</span>
      </a>
    `;
    content.appendChild(li);
  });
}

/**
 * Delete Case Tweak
 */
async function deleteCase(caseId) {
  if (!confirm(`Are you sure you want to delete case ${caseId}?`)) return;

  const token = getAuthToken();
  if (!token) {
    alert('No authentication token (AUTH_KEY/JWT) found. Please ensure you are logged into Wirespeed.');
    return;
  }

  try {
    const response = await fetch(`https://api.wirespeed.co/cases/${caseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = 'https://app.wirespeed.co/cases';
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(`Failed to delete case: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting case:', error);
    alert('An error occurred while deleting the case.');
  }
}

function injectDeleteButton() {
  if (!settings.enabled || !settings.tweakDeleteCase) return;

  const match = window.location.pathname.match(/\/cases\/([^\/]+)/);
  if (!match) return;

  const caseId = match[1];
  const headers = Array.from(document.querySelectorAll('h2'));
  const quickActionsHeader = headers.find(h => h.textContent.trim() === 'Quick Actions' && h.classList.contains('font-semibold'));
  if (!quickActionsHeader) return;

  const container = quickActionsHeader.nextElementSibling;
  if (!container || !container.classList.contains('flex') || container.querySelector('.delete-case-button')) return;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-case-button inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input/60 bg-background shadow-sm hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2 gap-2 justify-start';
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
    Delete Case
  `;

  deleteButton.addEventListener('click', () => deleteCase(caseId));
  container.appendChild(deleteButton);
}

/**
 * Delete Detection Tweak
 */
async function deleteDetection(detectionId) {
  if (!confirm(`Are you sure you want to delete detection ${detectionId}?`)) return;

  const token = getAuthToken();
  if (!token) {
    alert('No authentication token (AUTH_KEY/JWT) found. Please ensure you are logged into Wirespeed.');
    return;
  }

  try {
    const response = await fetch(`https://api.wirespeed.co/detections/${detectionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      window.location.href = 'https://app.wirespeed.co/detections';
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(`Failed to delete detection: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting detection:', error);
    alert('An error occurred while deleting the detection.');
  }
}

function injectDeleteDetectionDropdownItem() {
  if (!settings.enabled || !settings.tweakDeleteDetection) return;

  const match = window.location.pathname.match(/\/detections\/([^\/]+)/);
  if (!match) return;

  const detectionId = match[1];
  const menu = document.querySelector('[role="menu"][data-radix-menu-content]');
  if (!menu || menu.querySelector('.delete-detection-item')) return;

  const separator = document.createElement('div');
  separator.setAttribute('role', 'separator');
  separator.className = '-mx-1 my-1 h-px bg-muted delete-detection-item';

  const menuItem = document.createElement('div');
  menuItem.setAttribute('role', 'menuitem');
  menuItem.className = 'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer delete-detection-item hover:bg-destructive hover:text-destructive-foreground';
  menuItem.innerHTML = `
    <div>
      <h4 class="font-semibold">Delete Detection</h4>
      <p class="text-muted-foreground">Permanently delete this detection</p>
    </div>
  `;

  menuItem.addEventListener('click', () => deleteDetection(detectionId));
  menu.appendChild(separator);
  menu.appendChild(menuItem);
}

/**
 * Support Chat Tweak
 */
function injectSupportChat() {
  const supportGroup = findSidebarGroup('Support');
  if (!supportGroup) return;

  const content = supportGroup.querySelector('div[data-sidebar="group-content"]');
  if (!content || content.querySelector('[data-injected-by="wirespeed-tweaks"]')) return;

  if (!settings.enabled || !settings.tweakSupportChat) return;

  const li = document.createElement('li');
  li.setAttribute('data-sidebar', 'menu-item');
  li.className = 'group/menu-item relative rounded-md';
  li.innerHTML = `
    <div class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm font-medium cursor-pointer" 
         data-sidebar="menu-button" data-injected-by="wirespeed-tweaks">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-question"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
      <span>Chat</span>
    </div>
  `;
  
  li.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('wirespeed-tweaks-open-chat'));
  });

  content.appendChild(li);
}

function removeTweaks() {
  document.querySelectorAll('[data-injected-by="wirespeed-tweaks"]').forEach(el => {
    const li = el.closest('li');
    if (li) li.remove();
  });
  document.querySelectorAll('.delete-case-button, .delete-detection-item').forEach(el => el.remove());
}

function applyTweaks() {
  if (!settings.enabled) {
    removeTweaks();
    return;
  }
  injectAssets();
  injectDeleteButton();
  injectSupportChat();
  injectDeleteDetectionDropdownItem();
}

/**
 * Initialize
 */
async function init() {
  const result = await chrome.storage.sync.get(['enabled', 'tweakNavigation', 'tweakDeleteCase', 'tweakSupportChat', 'tweakDeleteDetection']);
  
  Object.assign(settings, {
    enabled: result.enabled !== false,
    tweakNavigation: result.tweakNavigation !== false,
    tweakDeleteCase: result.tweakDeleteCase !== false,
    tweakSupportChat: result.tweakSupportChat !== false,
    tweakDeleteDetection: result.tweakDeleteDetection !== false
  });

  if (settings.enabled) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('src/content/page-context.js');
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
    applyTweaks();
  }

  // MutationObserver with debouncing for performance
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(applyTweaks, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Sync settings dynamically
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      for (const [key, change] of Object.entries(changes)) {
        if (settings.hasOwnProperty(key)) {
          settings[key] = change.newValue;
        }
      }
      applyTweaks();
    }
  });
}

init();
