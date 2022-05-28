let text = '!'

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text });
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
  });