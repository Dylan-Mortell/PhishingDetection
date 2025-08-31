checkButton.addEventListener('click', function () {
  const resultElement = document.getElementById('result');
  const model = document.getElementById('modelSelect').value;

  // Get active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0 || !tabs[0].url) {
      resultElement.textContent = 'Could not get the current tab URL.';
      resultElement.className = '';
      return;
    }

    const url = tabs[0].url;

    if (!isValidUrl(url) || !hasValidDomain(url)) {
      resultElement.textContent = 'This tab does not have a valid URL.';
      resultElement.className = 'phishing';
      return;
    }

    sendPredictionRequest(url, model);
  });
});
