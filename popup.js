// Initialize button with user's preferred color
let submitButton = document.getElementById("submit_button");




submitButton.addEventListener("click", async (e) => {
    e.preventDefault()
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let hotelId = document.getElementById("hotelId").value
    let apiKey = document.getElementById("apiKey").value
    let sdkPath = chrome.runtime.getURL('/sdk.min.js')
    console.log(hotelId, apiKey)
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
