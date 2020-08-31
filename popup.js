// Initialize the popup window.
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get(['testKey'], function(result) {
    console.log('Value of testKey is ' + JSON.stringify(result));
  });
});