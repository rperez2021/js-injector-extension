// Initialize button with user's preferred color
let submitButton = document.getElementById("submit_button");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
submitButton.addEventListener("click", async (e) => {
    e.preventDefault()
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let url = document.getElementById("script").value
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: loadScript,
      args: [url]
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }

  // This function will load the script in the current page
    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = "selfbook_jssdk"
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
        console.log(script)
      });
    }