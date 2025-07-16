// background.js 
chrome.runtime.onInstalled.addListener(() => {
    console.log('PhishingDetection extension installed');
});


chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishingDetection extension installed');
});

// Listen for phishing check requests from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPhishing') {
    const urlToCheck = request.url;
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToCheck })
    })
      .then(res => res.json())
      .then(data => {
        sendResponse({ prediction: data.bert_prediction || 'error' });
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ prediction: 'error' });
      });

    return true; // keep message channel open for async response
  }
});
