// Toolblip Chrome Extension - Background Service Worker

// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Toolblip extension installed');
  }
});

// Handle keyboard shortcut
chrome.action.onClicked.addListener((tab) => {
  // Open the popup
});
