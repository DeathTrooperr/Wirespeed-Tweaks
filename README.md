# Wirespeed Tweaks

Wirespeed Tweaks is a Chrome Extension designed to enhance the Wirespeed interface with useful developer tools and navigation shortcuts.

## Features

- **Navigation Shortcuts**: Adds quick links to common assets (IPs, Files, Processes, Locations) directly in the sidebar.
- **Delete Case Button**: Adds a convenient "Delete Case" button to the Quick Actions section on case pages (requires an API Key).
- **Support Chat**: Adds a "Chat" link to the Support section for easier access to assistance.
- **Customizable**: Enable or disable tweaks through the extension popup.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the root directory of this project.

## Configuration

To use the **Delete Case** feature, you must provide your Wirespeed API Key:

1. Click on the Wirespeed Tweaks icon in your browser toolbar.
2. Enter your **API Key**.
3. Toggle **Enable Tweaks** to "On".
4. The tweaks will automatically apply when you visit `*.wirespeed.co`.

## Development

- `src/content/content.js`: Main logic for DOM manipulation and feature injection.
- `src/popup/`: UI and logic for the extension settings.
- `manifest.json`: Extension configuration and permissions.
