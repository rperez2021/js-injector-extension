// Initialize button with user's preferred color
let submitButton = document.getElementById("submit_button");


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
checkURL(tabId, changeInfo, tab);
})

async function checkURL(tabId, changeInfo, tab) {
  let urlActive = await readLocalStorage("url");
  console.log(urlActive)
  console.log(tab.url, urlActive)
  if (changeInfo.status == 'complete' && tab.active && urlActive == tab.url) {
    let hotelId = '';
    chrome.storage.local.get("hotelId", (result) => {
      console.log(result.hotelId)
      hotelId = result.hotelId;
    })
    let apiKey = '';
    chrome.storage.local.get("apiKey", (result) => {
      console.log(result.apiKey)
      apiKey = result.apiKey;
    })
    let sdkPath = chrome.runtime.getURL('/sdk.min.js')

    console.log("tab is active")
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: loadScript,
      args: [sdkPath, hotelId, apiKey]
    });
  }
}


submitButton.addEventListener("click", async (e) => {
  e.preventDefault()
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let hotelId = document.getElementById("hotelId").value
  let apiKey = document.getElementById("apiKey").value
  let sdkPath = await chrome.runtime.getURL('/sdk.min.js')
  let url = new URL(tab.url)
  let domain = url.hostname

  console.log(hotelId, apiKey, domain)
  chrome.storage.local.set({ hotelId: hotelId, apiKey: apiKey, url: tab.url }, function () {
    console.log('Value is set to ' + hotelId + ' and ' + apiKey + ' and ' + domain);
  })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: loadScript,
    args: [sdkPath, hotelId, apiKey]
  });
});

// This function will load the script in the current page
function loadScript(sdkPath, hotelId, apiKey) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = sdkPath + '?' + 'hotelId=' + hotelId + '&apiKey=' + apiKey;
    script.id = "selfbook_jssdk"
    console.log(script)
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
    console.log(script, "has been added to this page")
  });
}

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};
